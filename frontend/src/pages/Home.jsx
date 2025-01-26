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
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto ">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">
          Stream Your Videos Seamlessly
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Upload and stream your videos with our advanced HLS streaming platform
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <VideoUpload />
        </div>
        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-white">Preview</h2>
          <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
            <VideoPlayer />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Home

