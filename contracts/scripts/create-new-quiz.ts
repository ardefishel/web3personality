import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

import { PinataSDK } from "pinata";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const THEME_FOLDER_TITLE = "00-space-cat";

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

async function uploadQuestionAndPersonalities() {
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
    .map((line) => line.replace(/^\d+\|/, "").trim());

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

  try {
    const filePath = path.join(themeFolderPath, "/output/info.json");
    const fileBuffer = fs.readFileSync(filePath);
    const fileToUpload = new File([fileBuffer], "info.json");
    const { cid } = await pinata.upload.public
      .file(fileToUpload)
      .name(`${theme.title} - Info`);

    return cid;
  } catch (error) {
    console.error("Upload info error", error);
    process.exit(1);
  }
}

(async () => {
  await uploadImages();
  await uploadQuestionAndPersonalities();
})();
