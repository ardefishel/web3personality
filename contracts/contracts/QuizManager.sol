// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.4.0
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/access/Ownable.sol";
import {PersonalityToken} from "./PersonalityToken.sol";

contract QuizManager is Ownable {
    PersonalityToken public personalityToken;

    uint256 public quizIdCounter;

    struct Quiz {
        uint256 quizId;
        string quizHash; // IPFS hash containing quiz questions
        bool isActive;
        mapping(string => uint256) personalityToTokenId;
    }

    mapping(uint256 => Quiz) quizzes;
    mapping(address => mapping(uint256 => bool)) public hasParticipated;

    constructor(address _personalityToken) Ownable(msg.sender) {
        require(_personalityToken != address(0), "invalid token address");
        personalityToken = PersonalityToken(_personalityToken);
        quizIdCounter = 1;
    }

    function createQuiz(
        string memory _quizHash,
        string[] memory _personalities
    ) external onlyOwner {
        require(bytes(_quizHash).length > 0, "empty quiz hash");
        require(_personalities.length > 0, "no personalities provided");

        // Ensure personalities are non-empty and unique
        for (uint256 i = 0; i < _personalities.length; i++) {
            require(bytes(_personalities[i]).length > 0, "empty personality");
            for (uint256 j = i + 1; j < _personalities.length; j++) {
                require(
                    keccak256(bytes(_personalities[i])) !=
                        keccak256(bytes(_personalities[j])),
                    "duplicate personality"
                );
            }
        }

        Quiz storage newQuiz = quizzes[quizIdCounter];

        newQuiz.quizId = quizIdCounter;
        newQuiz.isActive = false;
        newQuiz.quizHash = _quizHash;

        for (uint256 i = 0; i < _personalities.length; i++) {
            uint256 tokenId = (newQuiz.quizId * 1000) + i;
            newQuiz.personalityToTokenId[_personalities[i]] = tokenId;
        }

        quizIdCounter++;
    }

    function completeQuiz(
        uint256 _quizId,
        string memory _quizPersonality
    ) external {
        require(quizzes[_quizId].quizId != 0, "quiz does not exists");
        require(quizzes[_quizId].isActive == true, "quiz is no longer active");
        require(
            quizzes[_quizId].personalityToTokenId[_quizPersonality] != 0,
            "invalid personality type"
        );
        require(!hasParticipated[msg.sender][_quizId], "already participated");

        uint256 _tokenId = quizzes[_quizId].personalityToTokenId[
            _quizPersonality
        ];

        hasParticipated[msg.sender][_quizId] = true;

        personalityToken.mint(msg.sender, _tokenId, _quizId);
    }

    function deactiveQuiz(uint256 _quizId) external onlyOwner {
        require(quizzes[_quizId].quizId != 0, "quiz does not exists");
        require(quizzes[_quizId].isActive == true, "quiz already inactive");
        quizzes[_quizId].isActive = false;
    }

    function activateQuiz(uint256 _quizId) external onlyOwner {
        require(quizzes[_quizId].quizId != 0, "quiz does not exists");
        require(quizzes[_quizId].isActive == false, "quiz already active");
        quizzes[_quizId].isActive = true;
    }

    function getQuizInfo(
        uint256 _quizId
    ) external view returns (uint256, string memory, bool) {
        require(quizzes[_quizId].quizId != 0, "quiz does not exists");

        Quiz storage quiz = quizzes[_quizId];
        return (quiz.quizId, quiz.quizHash, quiz.isActive);
    }
}
