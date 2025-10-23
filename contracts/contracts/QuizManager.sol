// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.4.0
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/access/Ownable.sol";
import {QuizPersonalityToken} from "./QuizPersonalityToken.sol";

contract QuizManager is Ownable {
    QuizPersonalityToken public quizPersonalityTokenContract;

    uint256 public quizIdCounter;

    struct Quiz {
        uint256 quizId;
        string quizCid; // IPFS hash containing quiz questions
        bool isActive;
        mapping(string => uint256) personalityToTokenId;
    }

    mapping(uint256 => Quiz) quizzes;
    mapping(address => mapping(uint256 => bool)) public hasParticipated;

    event QuizCreated(
        uint256 indexed quizId,
        string quizCid,
        uint256 personalitiesCount
    );
    event QuizActivated(uint256 indexed quizId, address indexed by);
    event QuizDeactivated(uint256 indexed quizId, address indexed by);
    event QuizCompleted(
        uint256 indexed quizId,
        address indexed user,
        string personality,
        uint256 tokenId
    );

    constructor(address _quizPersonalityTokenContract) Ownable(msg.sender) {
        require(
            _quizPersonalityTokenContract != address(0),
            "invalid token address"
        );
        quizPersonalityTokenContract = QuizPersonalityToken(
            _quizPersonalityTokenContract
        );
        quizIdCounter = 1;
    }

    function createQuiz(
        string memory _quizCid,
        string[] memory _personalities
    ) external onlyOwner {
        require(bytes(_quizCid).length > 0, "empty quiz hash");
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
        newQuiz.quizCid = _quizCid;

        for (uint256 i = 0; i < _personalities.length; i++) {
            uint256 tokenId = (newQuiz.quizId * 1000) + i;
            newQuiz.personalityToTokenId[_personalities[i]] = tokenId;
        }

        quizPersonalityTokenContract.createNewCollection(newQuiz.quizCid);

        quizIdCounter++;

        emit QuizCreated(newQuiz.quizId, _quizCid, _personalities.length);
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

        quizPersonalityTokenContract.mint(msg.sender, _tokenId);

        emit QuizCompleted(_quizId, msg.sender, _quizPersonality, _tokenId);
    }

    function deactiveQuiz(uint256 _quizId) external onlyOwner {
        require(quizzes[_quizId].quizId != 0, "quiz does not exists");
        require(quizzes[_quizId].isActive == true, "quiz already inactive");
        quizzes[_quizId].isActive = false;

        emit QuizDeactivated(_quizId, msg.sender);
    }

    function activateQuiz(uint256 _quizId) external onlyOwner {
        require(quizzes[_quizId].quizId != 0, "quiz does not exists");
        require(quizzes[_quizId].isActive == false, "quiz already active");
        quizzes[_quizId].isActive = true;

        emit QuizActivated(_quizId, msg.sender);
    }

    function getQuizInfo(
        uint256 _quizId
    ) external view returns (uint256, string memory, bool) {
        require(quizzes[_quizId].quizId != 0, "quiz does not exists");

        Quiz storage quiz = quizzes[_quizId];
        return (quiz.quizId, quiz.quizCid, quiz.isActive);
    }
}
