import OSS from 'ali-oss';
import * as fs from 'fs';
import * as path from 'path';

// OSS configuration
const accessKeyId: string | undefined = process.env.ALIBABA_CLOUD_ACCESS_KEY_ID;
const accessKeySecret: string | undefined = process.env.ALIBABA_CLOUD_ACCESS_KEY_SECRET;
const bucketName: string | undefined = process.env.PAGE_OSS_BUCKET;
const region: string | undefined = process.env.PAGE_OSS_REGION;
const ossPath: string = '';

if (!accessKeyId || !accessKeySecret) {
  console.error('Missing Alibaba Cloud credentials. Please set ALIBABA_CLOUD_ACCESS_KEY_ID and ALIBABA_CLOUD_ACCESS_KEY_SECRET environment variables.');
  process.exit(1);
}

// Initialize OSS client
const client = new OSS({
  region,
  accessKeyId,
  accessKeySecret,
  bucket: bucketName,
  secure: true, // Using secure instead of authorizationV4
});

// Function to check if a file exists
const fileExists = (filePath: string): boolean => {
  try {
    return fs.statSync(filePath).isFile();
  } catch (err) {
    return false;
  }
};

// Function to recursively get all files in a directory
const getAllFiles = (dirPath: string, arrayOfFiles: string[] = []): string[] => {
  try {
    // Check if directory exists
    if (!fs.existsSync(dirPath)) {
      console.error(`Directory not found: ${dirPath}`);
      return arrayOfFiles;
    }
    
    const files = fs.readdirSync(dirPath);
    
    files.forEach(file => {
      try {
        const filePath = path.resolve(dirPath, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
          arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
        } else if (stat.isFile()) {
          arrayOfFiles.push(filePath);
        }
      } catch (err) {
        console.error(`Error processing file ${file}: ${(err as Error).message}`);
      }
    });
  } catch (err) {
    console.error(`Error reading directory ${dirPath}: ${(err as Error).message}`);
  }
  
  return arrayOfFiles;
};

// Function to clear all objects in the bucket
const clearBucket = async (): Promise<boolean> => {
  try {
    console.log(`Clearing all objects from bucket: ${bucketName}`);
    
    // List all objects in the bucket
    let nextMarker: string | undefined = undefined;
    let objectsDeleted = 0;
    
    do {
      const listResult = await client.list({
        marker: nextMarker,
        'max-keys': 1000
      }, {});  // Adding empty options object as the second parameter
      
      nextMarker = listResult.nextMarker;
      const objects = listResult.objects || [];
      
      if (objects.length > 0) {
        console.log(`Found ${objects.length} objects to delete`);
        
        // Delete objects in batches
        const objectKeys = objects.map(obj => obj.name);
        if (objectKeys.length > 0) {
          const result = await client.deleteMulti(objectKeys, { quiet: true });
          objectsDeleted += objectKeys.length;
          console.log(`Deleted ${objectKeys.length} objects`);
        }
      }
    } while (nextMarker);
    
    console.log(`Successfully cleared bucket. Total objects deleted: ${objectsDeleted}`);
    return true;
  } catch (error) {
    console.error(`Error clearing bucket: ${(error as Error).message}`);
    return false;
  }
};

// Upload all files from dist directory
const uploadFiles = async (): Promise<void> => {
  try {
    // First clear the bucket
    await clearBucket();
    
    // Use absolute path to ensure correct file resolution
    const sourceDir = path.resolve('./dist');
    console.log(`Looking for files in: ${sourceDir}`);
    
    if (!fs.existsSync(sourceDir)) {
      console.error(`Source directory not found: ${sourceDir}`);
      process.exit(1);
    }
    
    const allFiles = getAllFiles(sourceDir);
    console.log(`Found ${allFiles.length} files to upload`);
    
    if (allFiles.length === 0) {
      console.error('No files found to upload');
      process.exit(1);
    }
    
    for (const filePath of allFiles) {
      try {
        // Verify file exists before attempting to upload
        if (!fileExists(filePath)) {
          console.error(`File not found: ${filePath}`);
          continue;
        }
        
        // Calculate relative path for OSS
        const relativePath = path.relative(sourceDir, filePath);
        // Combine with OSS path
        const ossKey = path.posix.join(ossPath || '', relativePath.split(path.sep).join(path.posix.sep));
        
        console.log(`Uploading ${filePath} to oss://${bucketName}/${ossKey}`);
        
        // Upload file to OSS using file stream
        const fileStream = fs.createReadStream(filePath);
        const result = await client.put(ossKey, fileStream);
        console.log(`Uploaded successfully: ${result.url}`);
      } catch (err) {
        console.error(`Error uploading file ${filePath}: ${(err as Error).message}`);
      }
    }
    
    console.log('All files uploaded successfully!');
  } catch (error) {
    console.error(`Error uploading files: ${(error as Error).message}`);
    process.exit(1);
  }
};

uploadFiles();