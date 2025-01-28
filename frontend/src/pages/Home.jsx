import React from 'react'
import { useRef } from 'react';
import VideoPlayer from '../components/VideoPlayer';
import { VideoUpload } from '../components/VideoUpload'

import videojs from 'video.js';

function Home() {
  const playerRef = useRef(null);

  const handlePlayerReady = (player) => {
    playerRef.current = player;
    player.on('waiting', () => {
      videojs.log('player is waiting');
    });

    player.on('dispose', () => {
      videojs.log('player will dispose');
    })
  }

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
          <p className='text-gray-400 font-semibold pb-5'>The longer the video, the more time it will take to process. Once processing is complete, the video will automatically start streaming.</p>
          <div className=" aspect-video bg-gray-900  rounded-lg overflow-hidden">
            <VideoPlayer onReady={handlePlayerReady} />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Home

