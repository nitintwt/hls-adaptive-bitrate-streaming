Hey, I created an Adaptive Bitrate Streaming solution using the HLS (HTTP Live Streaming) protocol. 

So, how does youtube stream videos?
If you think it simply uploads the entire video into a database and, when you click on a specific video, it just returns the whole video to your browser, it's not that straightforward. Imagine if the video is 200 MB or 600 MB. When you click on that video, the browser would first have to download the entire video from the database before streaming it to you.
This download time could be very long, resulting in a bad user experience. YouTube or even spotify, sends data (videos or songs) in segments , small parts of the media. For example, if your video is 5 minutes long, the segments could be 30 seconds each.

The backend or database sends these segments one by one, and your browser streams them sequentially. An index.m3u8 file is used to maintain the sequence and timestamps of all the segments. This file is provided to an HLS based video player, which streams the video segment by segment.

I tried to replicate this in a very basic way (proof of concept).

The flow of my project :- 

1. Users upload a video to my private AWS S3 bucket. To do this, the frontend requests the backend for a pre-signed URL (a token that grants temporary access to the S3 bucket). Using this pre-signed URL, the frontend uploads the video to the private S3 bucket.

2. I’ve configured the S3 bucket such that whenever a video is uploaded, it triggers an AWS Lambda function. This Lambda function downloads the uploaded video to its local memory and uses ffmpeg to create HLS streams in different resolutions (360p, 480p, 720p, and 1080p).
It also generates an index.m3u8 file for each resolution and a main.m3u8 file to maintain the entire resolution playlist. All these files are then saved into a public AWS S3 bucket.

3. The entire process takes 3–4 minutes for a 3-minute video. Using this public AWS S3 bucket and the Video.js library, users can stream the video in HLS format.

Implemented it in a very basic way , just wanted to learn system design and implement.

Tech stack I used :- reactjs , nodejs , expressjs , videojs , AWS S3 and Lambda

