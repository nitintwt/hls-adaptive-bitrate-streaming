import React, { useRef, useEffect , useState, Fragment } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import { useCookies } from 'react-cookie';

export const VideoPlayer = (props) => {
    const videoRef = useRef(null)
    const playerRef = useRef(null)
    const { onReady } = props
    const [renderFlag, setRenderFlag] = useState(false)
    const [cookies] = useCookies()
    console.log("cookies" , cookies?.uploadedFileName?.name)

    const encodedVideoName = encodeURIComponent(cookies?.uploadedFileName?.name)

    const masterPlaylistUrl = `https://nitintwt-hls-stream-files.s3.ap-south-1.amazonaws.com/${encodedVideoName}/master.m3u8`;

    const videoJsOptions = {
    autoplay: true,
    controls: true,
    responsive: true,
    fluid: true,
    sources: [{
        src: masterPlaylistUrl,
        type: 'application/x-mpegURL'
    }],
    }

    useEffect(() => {
        if (!playerRef.current) {
            const videoElement = document.createElement("video-js")

            videoElement.classList.add('vjs-big-play-centered')
            videoRef.current.appendChild(videoElement)

            const player = playerRef.current = videojs(videoElement,videoJsOptions, () => {
                videojs.log('player is ready')
                onReady && onReady(player)
            })
        } else {
            const player = playerRef.current

            player.autoplay(videoJsOptions.autoplay)
            player.src(videoJsOptions.sources)
        }
    }, [videoJsOptions, videoRef])

    useEffect(() => {
        const player = playerRef.current;
        console.log("player" , player)
        return () => {
            if (player && !player.isDisposed()) {
                player.dispose();
                playerRef.current = null;
            }
        }
    }, [playerRef])

    

    return (
        <Fragment>
        <div data-vjs-player  className=" aspect-video   bg-gray-900 rounded-lg">
            <div ref={videoRef} />
        </div>
        <p className='display-none'>{renderFlag}</p>
        </Fragment>
    )
}

export default VideoPlayer