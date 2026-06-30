import fs from 'fs/promises';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.error("Missing Cloudinary credentials in .env");
  process.exit(1);
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const ASSETS_DIR = path.resolve(__dirname, '../public/assets');
const OUTPUT_FILE = path.resolve(__dirname, 'cloudinary-mapping.json');
const CLOUDINARY_FOLDER = 'spaceborn_assets';

async function getFiles(dir) {
  let files = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === '.DS_Store') continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(await getFiles(fullPath));
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

async function uploadFiles() {
  const mapping = {};
  try {
    console.log("Scanning public/assets for files...");
    const files = await getFiles(ASSETS_DIR);
    console.log(`Found ${files.length} files to upload.`);

    for (const filePath of files) {
      const relativePath = path.relative(ASSETS_DIR, filePath);
      const publicId = path.join(CLOUDINARY_FOLDER, path.parse(relativePath).dir, path.parse(relativePath).name);
      const extension = path.parse(relativePath).ext.toLowerCase();

      // Determine resource type
      let resourceType = 'image';
      if (['.mp4', '.webm', '.mov'].includes(extension)) {
        resourceType = 'video';
      } else if (['.mp3', '.wav', '.ogg'].includes(extension)) {
        resourceType = 'video'; // Audio is uploaded as 'video' in Cloudinary
      } else if (['.pdf', '.zip'].includes(extension)) {
        resourceType = 'raw';
      }

      console.log(`Uploading ${relativePath}...`);
      try {
        const result = await cloudinary.uploader.upload(filePath, {
          public_id: publicId.replace(/\\/g, '/'),
          resource_type: resourceType,
          overwrite: true
        });
        
        mapping[`/assets/${relativePath.replace(/\\/g, '/')}`] = result.secure_url;
        console.log(`Success: ${result.secure_url}`);
      } catch (err) {
        console.error(`Failed to upload ${relativePath}:`, err);
      }
    }

    await fs.writeFile(OUTPUT_FILE, JSON.stringify(mapping, null, 2));
    console.log(`\nUpload complete! Mapping saved to ${OUTPUT_FILE}`);
  } catch (error) {
    console.error("Error during upload process:", error);
  }
}

uploadFiles();
