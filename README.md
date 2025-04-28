
# HLS Adaptive Bitrate Streaming

HLS Adaptive Bitrate Streaming is a simple proof of concept project that demonstrates how major platforms like YouTube and Spotify stream videos and audio efficiently. Instead of sending entire media files, this system breaks videos into smaller segments and streams them progressively, adapting to the viewer's network speed and device capabilities.


## How it Works

- User uploads a video through the frontend, which requests a pre signed URL from the backend.

- Using the pre signed URL, the video is uploaded to a private S3 bucket.

- An S3 event triggers an AWS Lambda function.

- The Lambda function downloads the video, uses FFmpeg to generate segmented HLS streams, and uploads the output to a public S3 bucket.

- Video.js fetches and plays the video segments from the public S3 bucket, adapting quality based on the user's network conditions.

## Tech Stack

**Client:** React.js, Video.js

**Server:** Node.js, Express.js , AWS S3 , AWS Lambda , FFmpeg
