import { useState, ChangeEvent, FormEvent, Fragment } from 'react'
import  axios from 'axios'
import {useCookies} from 'react-cookie'
import {Upload} from 'lucide-react'
import {Toaster , toast} from "sonner"

export function VideoUpload({ onVideoUpload }) {
  const [file, setFile] = useState(null)
  const [cookies , setCookies] = useCookies()

  console.log("uploader")

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      if (selectedFile.type.startsWith('video/')) {
        setFile(selectedFile)
      } else {
        setFile(null)
      }
    }
  }

  /*
    I am using a private s3 bucket to upload the video , and to upload this video I need a s3 bucket's 
    pre signed url. And using this pre signed url user will upload the video to my private S3 bucket,
    inbehalf of me.
  */

  const handleSubmit = async(e) => {
    e.preventDefault()
    console.log("started")
    toast.info("uploading...")
    try {
      const s3PutUrl = await axios.get(`https://hls-adaptive-bitrate-streaming.onrender.com/api/v1/video/putObjectUrl?fileName=${file.name}&&contentType=${file.type}`)
      console.log(s3PutUrl.data.message)
      await axios.put(s3PutUrl.data.message , file , {
        headers:{
          "Content-Type":file.type
        }    
      })
      setCookies("uploadedFileName", {name:file.name})
      toast.success("uploaded")
      setFile(null)
    } catch (error) {
      console.log("Something went wrong while uploading video" , error)
    }

  }

  return (
    <div className="w-full">
      <div
        className="w-full"
      >
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center border-indigo-400 bg-gray-800`}
        >
          <input
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="space-y-4">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="space-y-2">
              <p className="text-lg font-medium text-gray-900">
                {file ? file.name : 'Drop your video here'}
              </p>
              <p className="text-sm text-gray-500">
                or click to select a file
              </p>
              <p className='text-bold text-white'>upto 512mb videos can only be processed</p>
            </div>
          </div>
        </div>
      </div>
      {file && (
        <div className='text-center m-5'>
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400"
          onClick={handleSubmit}
        >
          Upload Video
        </button>
        </div>
      )}
      <Toaster position="bottom-center" />
    </div>
  )
}
