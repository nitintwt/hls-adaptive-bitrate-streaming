import React from 'react'
import { useRef } from 'react';
import VideoPlayer from '../components/VideoPlayer';
import { VideoUpload } from '../components/VideoUpload'
import { useCookies } from 'react-cookie';

function Home() {
      const [cookies] = useCookies()
      console.log("cookies" , cookies?.uploadedFileName?.name)
  
      const encodedVideoName = encodeURIComponent(cookies?.uploadedFileName?.name)
      const masterPlaylistUrl = `https://nitintwt-hls-stream-files.s3.ap-south-1.amazonaws.com/${encodedVideoName}/master.m3u8`;

  const playerRef = useRef(null);

  const videoJsOptions = {
    autoplay: true,
    controls: true,
    responsive: true,
    fluid: true,
    sources: [{
      src: masterPlaylistUrl,
      type: 'application/x-mpegURL'
    }],
  };

  const handlePlayerReady = (player) => {
    playerRef.current = player;

    // You can handle player events here, for example:
    player.on('waiting', () => {
      videojs.log('player is waiting');
    });

    player.on('dispose', () => {
      videojs.log('player will dispose');
    });
  };
  return (
    <div>
      <VideoUpload/>
      <VideoPlayer options={videoJsOptions} onReady={handlePlayerReady} />
    </div>
  )
}

export default Home

