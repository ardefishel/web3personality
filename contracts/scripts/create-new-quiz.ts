import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

import { PinataSDK } from "pinata";
import { network } from "hardhat";
import { decodeEventLog } from "viem";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const THEME_FOLDER_TITLE = "00-space-cat";

const QUIZ_CONTRACT_ADDRESS = process.env
  .CONTRACT_QUIZ_MANAGER as `0x${string}`;

const themeFolderPath = path.join(
  __dirname,
  "../assets/quiz/",
  THEME_FOLDER_TITLE
);

const themeConfigPath = path.join(themeFolderPath, "config.json");
const themeConfigContent = fs.readFileSync(themeConfigPath, "utf-8");
const theme = JSON.parse(themeConfigContent) as {
  title: string;
  description: string;
};

const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_API_JWT!,
  pinataGateway: process.env.PINATA_GATEAWAY,
});

const { viem } = await network.connect({ network: "baseSepolia" });
const [myWallet] = await viem.getWalletClients();
const publicClient = await viem.getPublicClient();
const quizManagerContract = await viem.getContractAt(
  "QuizManager",
  QUIZ_CONTRACT_ADDRESS
);

async function uploadImages() {
  const imgsPath = path.join(themeFolderPath, "/img");
  const imgs = fs.readdirSync(imgsPath);
  const imgsArr = imgs.map((img) => {
    return path.join(imgsPath, img);
  });

  const fileArray = imgsArr.map((filePath) => {
    const fileBuffer = fs.readFileSync(filePath);
    const fileName = path.basename(filePath);

    return new File([fileBuffer], fileName, {
      type: "image/png",
    });
  });

  try {
    const { cid } = await pinata.upload.public
      .fileArray(fileArray)
      .name(`${theme.title} - Imgs`);

    const uploadedImages = await imgs.map((img) => {
      return {
        name: img,
        fullUrl: `https://ipfs.io/ipfs/${cid}/${img}`,
      };
    });

    return uploadedImages;
  } catch (error) {
    console.error("Upload images error", error);
    process.exit(1);
  }
}

async function uploadQuestionAndPersonalities(
  imgsData: {
    name: string;
    fullUrl: string;
  }[]
) {
  const questionTxt = path.join(themeFolderPath, "questions.txt");
  const personalitiesTxt = path.join(themeFolderPath, "personalities.txt");

  const questions = fs
    .readFileSync(questionTxt, "utf-8")
    .split("\n")
    .filter((line) => line.trim() !== "")
    .map((line) => line.replace(/^\d+\|/, "").trim());

  const personalities = fs
    .readFileSync(personalitiesTxt, "utf-8")
    .split("\n")
    .filter((line) => line.trim() !== "")
    .map((line) => line.replace(/^\d+\|/, "").trim())
    .map((personality, i) => ({
      name: personality,
      id: i,
      filename: imgsData[i].name,
      fullurl: imgsData[i].fullUrl,
    }));

  const themeInfo = {
    ...theme,
    questions,
    personalities,
  };

  if (!fs.existsSync(path.join(themeFolderPath, "/output"))) {
    fs.mkdirSync(path.join(themeFolderPath, "/output"));
  }

  await fs.writeFileSync(
    path.join(themeFolderPath, "/output/info.json"),
    JSON.stringify(themeInfo, null, 2)
  );

  //

  const counter = await quizManagerContract.read.quizIdCounter();

  const tokenIdPrefix = Number(counter) * 1000;

  personalities.forEach((per) => {
    const newData = {
      tokenId: tokenIdPrefix + per.id,
      image: per.fullurl,
      name: per.name,
      description: `${theme.title} - ${per.name}`,
    };

    fs.writeFileSync(
      path.join(
        themeFolderPath,
        "/output",
        `${newData.tokenId.toString()}.json`
      ),
      JSON.stringify(newData, null, 2)
    );
  });

  try {
    const outDir = path.join(themeFolderPath, "/output");
    const outDatas = fs.readdirSync(outDir);
    const outDatasArr = outDatas.map((json) => {
      return path.join(outDir, json);
    });

    const fileArray = outDatasArr.map((filePath) => {
      const fileBuffer = fs.readFileSync(filePath);
      const fileName = path.basename(filePath);
      return new File([fileBuffer], fileName);
    });

    const { cid } = await pinata.upload.public
      .fileArray(fileArray)
      .name(`${theme.title} - Metadata`);

    return {
      cid,
      ...themeInfo,
    };
  } catch (error) {
    console.error("Upload info error", error);
    process.exit(1);
  }
}

async function createNewQuizOnChain(
  contentHash: string,
  contentPersonalites: {
    name: string;
    id: number;
  }[]
) {
  const hash = await myWallet.writeContract({
    address: quizManagerContract.address,
    abi: quizManagerContract.abi,
    functionName: "createQuiz",
    args: [contentHash, contentPersonalites.flatMap((p) => p.name)],
  });

  const receipt = await publicClient.waitForTransactionReceipt({
    hash: hash,
  });

  if (receipt.status !== "success") {
    throw new Error("Failed to get receipts transaction data");
  }

  const decodedLogs = receipt.logs.map((log) => {
    return decodeEventLog({
      abi: quizManagerContract.abi,
      data: log.data,
      topics: log.topics,
    });
  });

  const quizCreatedDecodedLog = decodedLogs.find(
    (item) => item.eventName == "QuizCreated"
  );

  if (!quizCreatedDecodedLog) {
    throw new Error("Failed to get QuizCreated event log");
  }

  return {
    ...quizCreatedDecodedLog.args,
  };
}

(async () => {
  try {
    const imgsData = await uploadImages();
    const { personalities, cid: contentHash } =
      await uploadQuestionAndPersonalities(imgsData);
    const { quizId } = await createNewQuizOnChain(contentHash, personalities);
  } catch (error) {
    console.error("Error creating quiz:", error);
    process.exit(1);
  }
})();
