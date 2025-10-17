import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

import { PinataSDK } from "pinata";
import { network } from "hardhat";
import { decodeEventLog } from "viem";

// File path setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const THEME_FOLDER_TITLE = "00-space-cat";
const NETWORK_NAME = "baseSepolia";

// Environment variables validation
function validateEnvironment(): void {
  const requiredEnvVars = [
    'CONTRACT_QUIZ_MANAGER',
    'PINATA_API_JWT',
    'PINATA_GATEAWAY'
  ];
  
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:', missingVars.join(', '));
    process.exit(1);
  }
  
  console.log('✅ Environment variables validated');
}

// Initialize constants after validation
validateEnvironment();

const QUIZ_CONTRACT_ADDRESS = process.env.CONTRACT_QUIZ_MANAGER as `0x${string}`;

// File paths
const themeFolderPath = path.join(__dirname, "../assets/quiz/", THEME_FOLDER_TITLE);
const themeConfigPath = path.join(themeFolderPath, "config.json");
const outputDir = path.join(themeFolderPath, "output");

// Load and validate theme configuration
function loadThemeConfig(): { title: string; description: string } {
  console.log(`📁 Loading theme config from: ${themeConfigPath}`);
  
  if (!fs.existsSync(themeConfigPath)) {
    console.error(`❌ Theme config not found: ${themeConfigPath}`);
    process.exit(1);
  }
  
  try {
    const themeConfigContent = fs.readFileSync(themeConfigPath, "utf-8");
    const theme = JSON.parse(themeConfigContent) as { title: string; description: string };
    console.log(`✅ Theme loaded: "${theme.title}"`);
    return theme;
  } catch (error) {
    console.error('❌ Failed to parse theme config:', error);
    process.exit(1);
  }
}

const theme = loadThemeConfig();

// Initialize Pinata SDK
console.log('🔗 Initializing Pinata SDK...');
const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_API_JWT!,
  pinataGateway: process.env.PINATA_GATEAWAY,
});
console.log('✅ Pinata SDK initialized');

// Initialize blockchain connection
console.log(`🌐 Connecting to ${NETWORK_NAME} network...`);
const { viem } = await network.connect({ network: NETWORK_NAME });
const [myWallet] = await viem.getWalletClients();
const publicClient = await viem.getPublicClient();
const quizManagerContract = await viem.getContractAt("QuizManager", QUIZ_CONTRACT_ADDRESS);
console.log(`✅ Connected to ${NETWORK_NAME} network`);
console.log(`📋 Quiz Manager Contract: ${QUIZ_CONTRACT_ADDRESS}`);
console.log(`💼 Wallet Address: ${myWallet.account.address}`);

// Types
interface ImageData {
  name: string;
  fullUrl: string;
}

interface PersonalityData {
  name: string;
  id: number;
  filename: string;
  fullurl: string;
}

interface ThemeInfo {
  title: string;
  description: string;
  image: string;
  questions: string[];
  personalities: PersonalityData[];
}

/**
 * Upload images to IPFS via Pinata
 * @returns Array of uploaded image data with IPFS URLs
 */
async function uploadImages(): Promise<ImageData[]> {
  console.log('\n📸 Starting image upload process...');
  
  const imgsPath = path.join(themeFolderPath, "img");
  
  // Validate images directory exists
  if (!fs.existsSync(imgsPath)) {
    console.error(`❌ Images directory not found: ${imgsPath}`);
    process.exit(1);
  }
  
  const imgs = fs.readdirSync(imgsPath).filter(file => 
    file.toLowerCase().endsWith('.png') || 
    file.toLowerCase().endsWith('.jpg') || 
    file.toLowerCase().endsWith('.jpeg')
  );
  
  if (imgs.length === 0) {
    console.error('❌ No image files found in images directory');
    process.exit(1);
  }
  
  console.log(`📁 Found ${imgs.length} image files:`, imgs.join(', '));
  
  // Create full file paths
  const imagePaths = imgs.map(img => path.join(imgsPath, img));
  
  // Create File objects for upload
  const fileArray = imagePaths.map((filePath) => {
    console.log(`📄 Processing: ${path.basename(filePath)}`);
    const fileBuffer = fs.readFileSync(filePath);
    const fileName = path.basename(filePath);
    const fileExtension = path.extname(fileName).toLowerCase();
    
    // Determine MIME type based on extension
    let mimeType = 'image/png';
    if (fileExtension === '.jpg' || fileExtension === '.jpeg') {
      mimeType = 'image/jpeg';
    }
    
    return new File([fileBuffer], fileName, { type: mimeType });
  });
  
  try {
    console.log('☁️  Uploading images to IPFS...');
    const uploadName = `${theme.title} - Images`;
    
    const { cid } = await pinata.upload.public
      .fileArray(fileArray)
      .name(uploadName);
    
    console.log(`✅ Images uploaded successfully!`);
    console.log(`🔗 IPFS CID: ${cid}`);
    
    const uploadedImages: ImageData[] = imgs.map((img) => ({
      name: img,
      fullUrl: `https://ipfs.io/ipfs/${cid}/${img}`,
    }));
    
    console.log('📋 Generated image URLs:');
    uploadedImages.forEach(img => {
      console.log(`   • ${img.name}: ${img.fullUrl}`);
    });
    
    return uploadedImages;
  } catch (error) {
    console.error('❌ Failed to upload images:', error);
    process.exit(1);
  }
}

/**
 * Process questions and personalities, generate metadata, and upload to IPFS
 * @param imgsData - Array of uploaded image data
 * @returns Object containing CID and theme information
 */
async function uploadQuestionAndPersonalities(
  imgsData: ImageData[]
): Promise<ThemeInfo & { cid: string }> {
  console.log('\n📝 Processing questions and personalities...');
  
  // File paths for text files
  const questionTxt = path.join(themeFolderPath, "questions.txt");
  const personalitiesTxt = path.join(themeFolderPath, "personalities.txt");
  
  // Validate text files exist
  if (!fs.existsSync(questionTxt)) {
    console.error(`❌ Questions file not found: ${questionTxt}`);
    process.exit(1);
  }
  
  if (!fs.existsSync(personalitiesTxt)) {
    console.error(`❌ Personalities file not found: ${personalitiesTxt}`);
    process.exit(1);
  }
  
  // Parse questions
  console.log('📄 Reading questions file...');
  const questions = fs
    .readFileSync(questionTxt, "utf-8")
    .split("\n")
    .filter((line) => line.trim() !== "")
    .map((line) => line.replace(/^\d+\|/, "").trim());
  
  console.log(`✅ Loaded ${questions.length} questions`);
  
  // Parse personalities
  console.log('📄 Reading personalities file...');
  const personalityNames = fs
    .readFileSync(personalitiesTxt, "utf-8")
    .split("\n")
    .filter((line) => line.trim() !== "")
    .map((line) => line.replace(/^\d+\|/, "").trim());
  
  console.log(`✅ Loaded ${personalityNames.length} personalities`);
  
  // Validate personality count matches image count
  if (personalityNames.length !== imgsData.length) {
    console.error(`❌ Mismatch: ${personalityNames.length} personalities but ${imgsData.length} images`);
    process.exit(1);
  }
  
  // Create personality data with image mapping
  const personalities: PersonalityData[] = personalityNames.map((name, i) => ({
    name,
    id: i,
    filename: imgsData[i].name,
    fullurl: imgsData[i].fullUrl,
  }));
  
  console.log('📋 Personality mapping:');
  personalities.forEach(p => {
    console.log(`   • ${p.name} -> ${p.filename}`);
  });
  
  // Create theme info object
  const themeInfo: ThemeInfo = {
    ...theme,
    image: personalities[0].fullurl, // Use first personality image as theme image
    questions,
    personalities,
  };
  
  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    console.log('📁 Creating output directory...');
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Write main theme info file
  const themeInfoPath = path.join(outputDir, "info.json");
  console.log(`✏️  Writing theme info to: ${themeInfoPath}`);
  fs.writeFileSync(themeInfoPath, JSON.stringify(themeInfo, null, 2));
  
  // Get next quiz ID from contract
  console.log('🔍 Fetching quiz ID counter from contract...');
  const counter = await quizManagerContract.read.quizIdCounter();
  const tokenIdPrefix = Number(counter) * 1000;
  console.log(`🎲 Next quiz ID: ${counter}, token ID prefix: ${tokenIdPrefix}`);
  
  // Generate NFT metadata files for each personality
  console.log('🎨 Generating NFT metadata files...');
  personalities.forEach((personality) => {
    const tokenId = tokenIdPrefix + personality.id;
    const nftMetadata = {
      tokenId,
      image: personality.fullurl,
      name: personality.name,
      description: `${theme.title} - ${personality.name}`,
    };
    
    const metadataPath = path.join(outputDir, `${tokenId}.json`);
    fs.writeFileSync(metadataPath, JSON.stringify(nftMetadata, null, 2));
    console.log(`   • Token ${tokenId}: ${personality.name}`);
  });
  
  try {
    // Upload all metadata files to IPFS
    console.log('☁️  Uploading metadata files to IPFS...');
    const metadataFiles = fs.readdirSync(outputDir);
    const metadataFilePaths = metadataFiles.map(file => path.join(outputDir, file));
    
    console.log(`📁 Found ${metadataFiles.length} metadata files:`, metadataFiles.join(', '));
    
    const fileArray = metadataFilePaths.map((filePath) => {
      const fileBuffer = fs.readFileSync(filePath);
      const fileName = path.basename(filePath);
      return new File([fileBuffer], fileName, { type: 'application/json' });
    });
    
    const uploadName = `${theme.title} - Metadata`;
    const { cid } = await pinata.upload.public
      .fileArray(fileArray)
      .name(uploadName);
    
    console.log(`✅ Metadata uploaded successfully!`);
    console.log(`🔗 Metadata IPFS CID: ${cid}`);
    
    return {
      cid,
      ...themeInfo,
    };
  } catch (error) {
    console.error('❌ Failed to upload metadata:', error);
    process.exit(1);
  }
}

/**
 * Create a new quiz on the blockchain
 * @param contentHash - IPFS hash of the quiz metadata
 * @param personalities - Array of personality data
 * @returns Quiz creation event arguments
 */
async function createNewQuizOnChain(
  contentHash: string,
  personalities: PersonalityData[]
): Promise<any> {
  console.log('\n🔗 Creating quiz on blockchain...');
  
  const personalityNames = personalities.map(p => p.name);
  console.log('📋 Quiz parameters:');
  console.log(`   • Content Hash: ${contentHash}`);
  console.log(`   • Personalities: ${personalityNames.join(', ')}`);
  
  try {
    console.log('✏️  Sending transaction to create quiz...');
    
    const hash = await myWallet.writeContract({
      address: quizManagerContract.address,
      abi: quizManagerContract.abi,
      functionName: "createQuiz",
      args: [contentHash, personalityNames],
    });
    
    console.log(`📡 Transaction hash: ${hash}`);
    console.log('⏳ Waiting for transaction confirmation...');
    
    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    
    if (receipt.status !== "success") {
      console.error('❌ Transaction failed:', receipt);
      throw new Error(`Transaction failed with status: ${receipt.status}`);
    }
    
    console.log(`✅ Transaction confirmed in block ${receipt.blockNumber}`);
    console.log(`⛽ Gas used: ${receipt.gasUsed.toString()}`);
    
    // Decode event logs to extract quiz creation data
    console.log('🔍 Decoding event logs...');
    const decodedLogs = receipt.logs
      .map((log) => {
        try {
          return decodeEventLog({
            abi: quizManagerContract.abi,
            data: log.data,
            topics: log.topics,
          });
        } catch (error) {
          // Skip logs that can't be decoded with our ABI
          return null;
        }
      })
      .filter(Boolean); // Remove null entries
    
    const quizCreatedEvent = decodedLogs.find(
      (event) => event?.eventName === "QuizCreated"
    );
    
    if (!quizCreatedEvent) {
      console.error('❌ QuizCreated event not found in transaction logs');
      console.log('Available events:', decodedLogs.map(log => log?.eventName).filter(Boolean));
      throw new Error("QuizCreated event not found in transaction logs");
    }
    
    console.log('✅ Quiz created successfully!');
    console.log('🎉 Event data:', quizCreatedEvent.args);
    
    return quizCreatedEvent.args;
  } catch (error) {
    console.error('❌ Failed to create quiz on blockchain:', error);
    throw error;
  }
}

/**
 * Main execution function
 */
async function main(): Promise<void> {
  const startTime = Date.now();
  console.log('🚀 Starting quiz creation process...');
  console.log(`📅 Started at: ${new Date().toISOString()}`);
  console.log('=' .repeat(60));
  
  try {
    // Step 1: Upload images to IPFS
    console.log('\n🎯 STEP 1: Upload Images');
    const imagesData = await uploadImages();
    
    // Step 2: Process questions/personalities and upload metadata
    console.log('\n🎯 STEP 2: Process Questions & Personalities');
    const { personalities, cid: contentHash, ...themeInfo } = 
      await uploadQuestionAndPersonalities(imagesData);
    
    // Step 3: Create quiz on blockchain
    console.log('\n🎯 STEP 3: Create Quiz on Blockchain');
    const quizEventData = await createNewQuizOnChain(contentHash, personalities);
    
    // Success summary
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    console.log('\n' + '=' .repeat(60));
    console.log('🎉 QUIZ CREATION COMPLETED SUCCESSFULLY!');
    console.log('=' .repeat(60));
    console.log(`⏱️  Total Duration: ${duration} seconds`);
    console.log(`📊 Quiz Details:`);
    console.log(`   • Theme: ${themeInfo.title}`);
    console.log(`   • Description: ${themeInfo.description}`);
    console.log(`   • Questions: ${themeInfo.questions.length}`);
    console.log(`   • Personalities: ${personalities.length}`);
    console.log(`   • Images Uploaded: ${imagesData.length}`);
    console.log(`\n🔗 IPFS Links:`);
    console.log(`   • Metadata CID: ${contentHash}`);
    console.log(`   • Metadata URL: https://ipfs.io/ipfs/${contentHash}`);
    console.log(`\n⛓️  Blockchain Data:`);
    if (quizEventData.quizId) {
      console.log(`   • Quiz ID: ${quizEventData.quizId}`);
    }
    Object.entries(quizEventData).forEach(([key, value]) => {
      if (key !== 'quizId') {
        console.log(`   • ${key}: ${value}`);
      }
    });
    console.log(`\n📁 Local Files:`);
    console.log(`   • Output Directory: ${outputDir}`);
    console.log(`   • Theme Config: ${themeConfigPath}`);
    console.log('\n✨ Quiz is ready to use!');
    
  } catch (error) {
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    console.log('\n' + '=' .repeat(60));
    console.error('💥 QUIZ CREATION FAILED!');
    console.log('=' .repeat(60));
    console.error(`⏱️  Duration before failure: ${duration} seconds`);
    console.error('❌ Error details:', error);
    
    if (error instanceof Error) {
      console.error(`📝 Error message: ${error.message}`);
      if (error.stack) {
        console.error(`📍 Stack trace:`);
        console.error(error.stack);
      }
    }
    
    console.error('\n🛠️  Troubleshooting tips:');
    console.error('   • Check environment variables are set correctly');
    console.error('   • Verify all required files exist in the theme folder');
    console.error('   • Ensure wallet has sufficient funds for gas');
    console.error('   • Confirm network connectivity');
    
    process.exit(1);
  }
}

// Execute main function
main().catch((error) => {
  console.error('💥 Unhandled error in main function:', error);
  process.exit(1);
});
