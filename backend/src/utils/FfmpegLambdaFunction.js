// This is a lambda function. It is separately deployed with all dependency on AWS ECR.

import AWS from 'aws-sdk';
import fs from 'fs';
import util from 'util'
import path from 'path';
import { exec } from 'child_process';
import ffmpeg from 'ffmpeg-static';

// Convert exec to promise-based for async/await
const execPromise = util.promisify(exec);

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'ap-south-1',
})

const bucketName = 'nitintwt27.hls';
const outputBucketName = 'nitintwt-hls-stream-files';

export const handler = async (event) => {
  try {
    console.log('S3 Event:', JSON.stringify(event, null, 2));

    // get the bucket name from which the triggered has happened
    const bucket = event.Records[0].s3.bucket.name;
    
    // the file-name/key  due to which the triggered has happened
    const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));

    console.log(`Processing file from bucket: ${bucket}, key: ${key}`);

    // Download video from S3
    const inputFile = "/tmp/videos";
    await downloadFromS3(bucketName, key, inputFile);

    // Process video with FFmpeg
    const outputDir = '/tmp/hls';
    await processWithFFmpeg(inputFile, outputDir);

    // Generate master playlist (master.m3u8)
    const resolutions = ['360p', '480p', '720p', '1080p'];
    await generateMasterPlaylist(outputDir, resolutions);

    // Upload HLS files to the output bucket
    await uploadHLSFilesToS3(outputDir, outputBucketName, key);

    console.log('HLS processing completed successfully.');
    return {
      statusCode: 200,
      body: 'HLS processing completed successfully.',
    };
  } catch (error) {
    console.error('Error processing video:', error);
    return {
      statusCode: 500,
      body: 'Error processing video.',
    }
  }
}

// Helper function to download video from S3 and store it in lambda function temp memory
async function downloadFromS3(bucket, key, destinationPath) {
  const params = { Bucket: bucket, Key: key };
  const fileStream = fs.createWriteStream(destinationPath);

  return new Promise((resolve, reject) => {
    s3.getObject(params)
      .createReadStream() // fetches the file from S3 as a readable stream.
      .on('error', reject)
      .pipe(fileStream) // writes the stream data to the local file
      .on('close', resolve);
  })
}

// Helper function to process video with FFmpeg
async function processWithFFmpeg(inputFile, outputDir) {
  try {
    // Ensure output directory exists
    fs.mkdirSync(outputDir, { recursive: true });

    const ffmpegCommand = `
      "${ffmpeg}" -i ${inputFile} \
      -vf "scale=-2:360" -c:v libx264 -crf 23 -preset fast -c:a aac -b:a 128k -f hls -hls_time 6 -hls_playlist_type vod ${outputDir}/360p.m3u8 \
      -vf "scale=-2:480" -c:v libx264 -crf 23 -preset fast -c:a aac -b:a 128k -f hls -hls_time 6 -hls_playlist_type vod ${outputDir}/480p.m3u8 \
      -vf "scale=-2:720" -c:v libx264 -crf 23 -preset fast -c:a aac -b:a 128k -f hls -hls_time 6 -hls_playlist_type vod ${outputDir}/720p.m3u8 \
      -vf "scale=-2:1080" -c:v libx264 -crf 23 -preset fast -c:a aac -b:a 128k -f hls -hls_time 6 -hls_playlist_type vod ${outputDir}/1080p.m3u8
    `;

    console.log('Executing FFmpeg command:', ffmpegCommand);
    await execPromise(ffmpegCommand);
    console.log('FFmpeg processing completed.');
  } catch (error) {
    console.error('Error during FFmpeg processing:', error);
    throw error;
  }
}

// Helper function to generate master playlist
async function generateMasterPlaylist(outputDir, resolutions) {
  try {
    const masterPlaylistPath = path.join(outputDir, 'master.m3u8');
    const lines = resolutions.map(
      (res) =>
        `#EXT-X-STREAM-INF:BANDWIDTH=${getBandwidth(res)},RESOLUTION=${getResolution(res)}\n${res}.m3u8`
    );

    // Write master.m3u8 file
    fs.writeFileSync(masterPlaylistPath, `#EXTM3U\n${lines.join('\n')}`);
    console.log('Master playlist generated.');
  } catch (error) {
    console.error('Error generating master playlist:', error);
    throw error;
  }
}

// Helper function to upload HLS files to S3
async function uploadHLSFilesToS3(dirPath, bucket, originalKey) {
  const files = fs.readdirSync(dirPath);

  const uploadPromises = files.map((file) => {
    const filePath = path.join(dirPath, file);
    const fileKey = `${originalKey.replace('user-uploads/', '')}/${file}`;

    const params = {
      Bucket: bucket,
      Key: fileKey,
      Body: fs.createReadStream(filePath),
      ContentType: getContentType(file),
    };

    return s3.upload(params).promise();
  });

  await Promise.all(uploadPromises);
  console.log('Uploaded HLS files to S3 bucket:', bucket);
}

// Helper function to determine Content-Type
function getContentType(fileName) {
  if (fileName.endsWith('.m3u8')) return 'application/vnd.apple.mpegurl';
  if (fileName.endsWith('.ts')) return 'video/mp2t';
  return 'application/octet-stream';
}

// Helper functions for playlist parameters
function getBandwidth(res) {
  const bandwidths = { '360p': 800000, '480p': 1400000, '720p': 2800000, '1080p': 5000000 };
  return bandwidths[res] || 800000; // Default to 800kbps
}

function getResolution(res) {
  const resolutions = {
    '360p': '640x360',
    '480p': '854x480',
    '720p': '1280x720',
    '1080p': '1920x1080',
  };
  return resolutions[res] || '640x360'; // Default to 360p
}