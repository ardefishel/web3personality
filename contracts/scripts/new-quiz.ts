import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { PinataSDK } from "pinata";
import { network } from "hardhat";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const THEME_FOLDER_TITLE = "01-space-cat";
const NETWORK_NAME = "baseSepolia";
const themeFolderPath = path.join(
  __dirname,
  "../assets/quiz/",
  THEME_FOLDER_TITLE
);

// Environment variables validation
function validateEnvironment(): void {
  const requiredEnvVars = [
    "CONTRACT_MANAGER",
    "PINATA_API_JWT",
    "PINATA_GATEAWAY",
  ];

  const missingVars = requiredEnvVars.filter(
    (varName) => !process.env[varName]
  );

  if (missingVars.length > 0) {
    console.error(
      "❌ Missing required environment variables:",
      missingVars.join(", ")
    );
    process.exit(1);
  }

  console.log("✅ Environment variables validated");
}

validateEnvironment();

const CONTRACT_MANAGER = process.env
  .CONTRACT_MANAGER as `0x${string}`;

// Initialize Pinata SDK
const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_API_JWT!,
  pinataGateway: process.env.PINATA_GATEAWAY,
});

interface ThemeDefaultExport {
  name: string;
  description: string;
  questions: string[];
  attributes: string[];
}

interface PersonalityMetadata {
  name: string;
  tokenId: number;
  image: string;
  attributes: Array<{ trait_type: string; value: string }>;
}

interface CollectionMetadata {
  name: string;
  description: string;
  quizId: number;
  totalPersonalities: number;
  questions: string[];
  attributes: string[];
  personalities: Array<{
    name: string;
    tokenId: number;
    image: string;
    attributes: Array<{ trait_type: string; value: string }>;
  }>;
}

function capitalizeEachWord(sentence: string) {
  // Handle empty or non-string inputs
  if (typeof sentence !== "string" || sentence.length === 0) {
    return "";
  }

  // Split the sentence into an array of words
  const words = sentence.split(" ");

  // Map over each word to capitalize its first letter
  const capitalizedWords = words.map((word) => {
    if (word.length === 0) {
      return ""; // Handle empty strings within the array
    }
    return word.charAt(0).toUpperCase() + word.slice(1);
  });

  // Join the capitalized words back into a single string
  return capitalizedWords.join(" ");
}

(async () => {
  try {
    console.log("🚀 Starting quiz creation process...");

    // Step 1: Load theme data from index.ts
    console.log("\n📁 Loading theme data...");
    const indexPath = path.join(themeFolderPath, "index.ts");
    const indexUrl = new URL(`file://${indexPath}`);
    const indexModule = await import(indexUrl.href);
    const themeData = indexModule.default as ThemeDefaultExport;

    console.log(`✅ Theme loaded: ${themeData.name}`);
    console.log(`   • Description: ${themeData.description}`);
    console.log(`   • Questions: ${themeData.questions.length}`);
    console.log(`   • Attributes: ${themeData.attributes.join(", ")}`);

    // Step 2: Connect to blockchain and get quiz ID
    console.log("\n🌐 Connecting to blockchain...");
    const { viem } = await network.connect({ network: NETWORK_NAME });
    const quizManagerContract = await viem.getContractAt(
      "QuizManager",
      CONTRACT_MANAGER
    );

    const quizIdCounter = await quizManagerContract.read.quizIdCounter();
    const quizId = Number(quizIdCounter);
    console.log(`✅ Retrieved quiz ID counter: ${quizId}`);

    // Step 3: Process images
    console.log("\n📸 Processing images...");
    const imgsPath = path.join(themeFolderPath, "img");
    const outputImgsPath = path.join(themeFolderPath, "output", "imgs");
    const outputMetadataPath = path.join(themeFolderPath, "output", "metadata");

    if (!fs.existsSync(imgsPath)) {
      console.error(`❌ Images directory not found: ${imgsPath}`);
      process.exit(1);
    }

    // Check if output folder already exists
    const outputExists = fs.existsSync(outputImgsPath);
    const metadataExists = fs.existsSync(outputMetadataPath);

    // Get all image files from source
    const imgs = fs
      .readdirSync(imgsPath)
      .filter(
        (file) =>
          file.toLowerCase().endsWith(".png") ||
          file.toLowerCase().endsWith(".jpg") ||
          file.toLowerCase().endsWith(".jpeg")
      );

    if (imgs.length === 0) {
      console.error("❌ No image files found in images directory");
      process.exit(1);
    }

    console.log(`📁 Found ${imgs.length} image files`);

    // Extract personality data
    const personalities = imgs.map((img, index) => {
      const tokenId = 1000 * quizId + index;
      const [name, ...attrs] = img.split(".")[0].split("--");

      const personalityAttributes = themeData.attributes.map((a, i) => {
        return {
          trait_type: a,
          value: capitalizeEachWord(attrs[i].split("_").join(" ")),
        };
      });

      const personalityName = capitalizeEachWord(name.split("_").join(" "));

      return {
        name: personalityName,
        tokenId,
        attributes: personalityAttributes,
        originalFilename: img,
      };
    });

    // Check if output images already exist and are properly structured
    let imagesReady = false;
    if (outputExists) {
      const outputImgs = fs.readdirSync(outputImgsPath);
      const expectedImageNames = personalities.map(
        (p) => `${p.tokenId}${path.extname(p.originalFilename)}`
      );

      imagesReady = expectedImageNames.every((name) =>
        outputImgs.includes(name)
      );

      if (imagesReady) {
        console.log(
          `✅ Output images already exist and are properly structured`
        );
      } else {
        console.log(
          `⚠️  Output images exist but are incomplete, will recreate...`
        );
      }
    }

    // Create or update output images if needed
    if (!imagesReady) {
      if (!fs.existsSync(outputImgsPath)) {
        fs.mkdirSync(outputImgsPath, { recursive: true });
        console.log(`📁 Created output/imgs directory`);
      }

      personalities.forEach((personality) => {
        const sourcePath = path.join(imgsPath, personality.originalFilename);
        const ext = path.extname(personality.originalFilename);
        const destPath = path.join(outputImgsPath, `${personality.tokenId}${ext}`);
        fs.copyFileSync(sourcePath, destPath);
        console.log(
          `   • ${personality.originalFilename} -> ${personality.tokenId}${ext} (${personality.name})`
        );
      });
    }

    // Step 4: Check if metadata already exists and extract imageCid
    let imageCid: string | undefined;
    let metadataReady = false;

    if (metadataExists) {
      const metadataFiles = fs
        .readdirSync(outputMetadataPath)
        .filter((f) => f.endsWith(".json"));

      const expectedMetadataNames = personalities.map(
        (p) => `${p.tokenId}.json`
      );

      metadataReady = expectedMetadataNames.every((name) =>
        metadataFiles.includes(name)
      );

      if (metadataReady) {
        // Read existing metadata to extract imageCid
        const firstMetadataPath = path.join(
          outputMetadataPath,
          metadataFiles[0]
        );
        const firstMetadata = JSON.parse(
          fs.readFileSync(firstMetadataPath, "utf-8")
        ) as PersonalityMetadata;

        // Extract CID from image URL (format: https://ipfs.io/ipfs/{cid}/{tokenId}.ext)
        const imageUrlMatch = firstMetadata.image.match(
          /ipfs\.io\/ipfs\/([^\/]+)\//
        );
        if (imageUrlMatch) {
          imageCid = imageUrlMatch[1];
          console.log(
            `✅ Metadata already exists and is properly structured`
          );
          console.log(`🔗 Existing Image CID: ${imageCid}`);
        } else {
          console.log(
            `⚠️  Metadata exists but image URL format is invalid, will recreate...`
          );
          metadataReady = false;
        }
      } else {
        console.log(
          `⚠️  Metadata exists but is incomplete, will recreate...`
        );
      }
    }

    // Step 5: Upload images to Pinata if not using existing metadata
    if (!metadataReady) {
      console.log("\n☁️  Uploading images to Pinata...");
      const renamedImgFiles = fs.readdirSync(outputImgsPath);
      const imageFilePaths = renamedImgFiles.map((file) =>
        path.join(outputImgsPath, file)
      );

      const imageFileArray = imageFilePaths.map((filePath) => {
        const fileBuffer = fs.readFileSync(filePath);
        const fileName = path.basename(filePath);
        const fileExtension = path.extname(fileName).toLowerCase();

        let mimeType = "image/png";
        if (fileExtension === ".jpg" || fileExtension === ".jpeg") {
          mimeType = "image/jpeg";
        }

        return new File([fileBuffer], fileName, { type: mimeType });
      });

      const uploadName = `${themeData.name} - Images`;
      const uploadResult = await pinata.upload.public
        .fileArray(imageFileArray)
        .name(uploadName);

      imageCid = uploadResult.cid;

      console.log(`✅ Images uploaded to IPFS`);
      console.log(`🔗 CID: ${imageCid}`);
    } else {
      console.log("\n✅ Using existing images from metadata");
    }

    // Step 6: Create personality metadata with IPFS links if needed
    if (!metadataReady) {
      console.log("\n🎨 Creating personality metadata...");

      if (!fs.existsSync(outputMetadataPath)) {
        fs.mkdirSync(outputMetadataPath, { recursive: true });
        console.log(`📁 Created output/metadata directory`);
      }

      // Generate metadata JSON files
      personalities.forEach((personality) => {
        const ext = path.extname(personality.originalFilename);
        const imageUrl = `https://ipfs.io/ipfs/${imageCid}/${personality.tokenId}${ext}`;

        const metadata: PersonalityMetadata = {
          name: personality.name,
          tokenId: personality.tokenId,
          image: imageUrl,
          attributes: personality.attributes,
        };

        // Write individual metadata file
        const metadataPath = path.join(
          outputMetadataPath,
          `${personality.tokenId}.json`
        );
        fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));

        console.log(`   • Token ${personality.tokenId}: ${personality.name}`);
      });
    } else {
      console.log("\n✅ Using existing metadata files");
    }

    // Step 7: Create collection metadata
    console.log("\n📦 Creating collection metadata...");
    const collectionMetadata: CollectionMetadata = {
      name: themeData.name,
      description: themeData.description,
      quizId,
      totalPersonalities: personalities.length,
      questions: themeData.questions,
      attributes: themeData.attributes,
      personalities: personalities.map((personality) => {
        const ext = path.extname(personality.originalFilename);
        const imageUrl = `https://ipfs.io/ipfs/${imageCid}/${personality.tokenId}${ext}`;
        return {
          name: personality.name,
          tokenId: personality.tokenId,
          image: imageUrl,
          attributes: personality.attributes,
        };
      }),
    };

    const collectionMetadataPath = path.join(
      outputMetadataPath,
      "collection.json"
    );
    fs.writeFileSync(
      collectionMetadataPath,
      JSON.stringify(collectionMetadata, null, 2)
    );
    console.log(`✅ Collection metadata created: collection.json`);

    // Step 8: Upload metadata to Pinata
    console.log("\n☁️  Uploading metadata to Pinata...");
    const metadataFiles = fs.readdirSync(outputMetadataPath);
    const metadataFilePaths = metadataFiles.map((file) =>
      path.join(outputMetadataPath, file)
    );

    console.log(`📁 Found ${metadataFiles.length} metadata files`);

    const metadataFileArray = metadataFilePaths.map((filePath) => {
      const fileBuffer = fs.readFileSync(filePath);
      const fileName = path.basename(filePath);
      return new File([fileBuffer], fileName, { type: "application/json" });
    });

    const metadataUploadName = `${themeData.name} - Metadata`;
    const { cid: metadataCid } = await pinata.upload.public
      .fileArray(metadataFileArray)
      .name(metadataUploadName);

    console.log(`✅ Metadata uploaded to IPFS`);
    console.log(`🔗 Metadata CID: ${metadataCid}`);

    // Step 9: Create quiz on blockchain
    console.log("\n🔗 Creating quiz on blockchain...");
    const personalityNames = personalities.map((p) => p.name);
    console.log("📋 Quiz parameters:");
    console.log(`   • Content Hash: ${metadataCid}`);
    console.log(`   • Personalities: ${personalityNames.join(", ")}`);

    const [myWallet] = await viem.getWalletClients();
    const publicClient = await viem.getPublicClient();

    console.log("✏️  Sending transaction to create quiz...");

    const hash = await myWallet.writeContract({
      address: quizManagerContract.address,
      abi: quizManagerContract.abi,
      functionName: "createQuiz",
      args: [metadataCid, personalityNames],
    });

    console.log(`📡 Transaction hash: ${hash}`);
    console.log("⏳ Waiting for transaction confirmation...");

    const receipt = await publicClient.waitForTransactionReceipt({ hash });

    if (receipt.status !== "success") {
      console.error("❌ Transaction failed:", receipt);
      throw new Error(`Transaction failed with status: ${receipt.status}`);
    }

    console.log(`✅ Transaction confirmed in block ${receipt.blockNumber}`);
    console.log(`⛽ Gas used: ${receipt.gasUsed.toString()}`);

    console.log("\n✅ Quiz creation process completed!");
    console.log("\n" + "=".repeat(60));
    console.log("🎉 QUIZ CREATED SUCCESSFULLY!");
    console.log("=".repeat(60));
    console.log(`\n📊 Summary:`);
    console.log(`   • Quiz ID: ${quizId}`);
    console.log(`   • Theme: ${themeData.name}`);
    console.log(`   • Description: ${themeData.description}`);
    console.log(`   • Questions: ${themeData.questions.length}`);
    console.log(`   • Personalities: ${personalities.length}`);
    console.log(
      `   • Token ID range: ${1000 * quizId} - ${
        1000 * quizId + personalities.length - 1
      }`
    );
    console.log(`\n🔗 IPFS Links:`);
    console.log(`   • Images CID: ${imageCid}`);
    console.log(`   • Images URL: https://ipfs.io/ipfs/${imageCid}`);
    console.log(`   • Metadata CID: ${metadataCid}`);
    console.log(`   • Metadata URL: https://ipfs.io/ipfs/${metadataCid}`);
    console.log(`   • Collection Metadata: https://ipfs.io/ipfs/${metadataCid}/collection.json`);
    console.log(`\n⛓️  Blockchain:`);
    console.log(`   • Transaction: ${hash}`);
    console.log(`   • Block: ${receipt.blockNumber}`);
    console.log(`   • Gas Used: ${receipt.gasUsed.toString()}`);
    console.log(`\n📁 Output directories:`);
    console.log(`   • Images: ${outputImgsPath}`);
    console.log(`   • Metadata: ${outputMetadataPath}`);
    console.log(`   • Collection: ${path.join(outputMetadataPath, "collection.json")}`);
    console.log("\n✨ Quiz is ready to use!");
  } catch (error) {
    console.error("\n❌ Error:", error);
    if (error instanceof Error) {
      console.error(`📝 Error message: ${error.message}`);
      if (error.stack) {
        console.error(`📍 Stack trace:`);
        console.error(error.stack);
      }
    }
    process.exit(1);
  }
})();
