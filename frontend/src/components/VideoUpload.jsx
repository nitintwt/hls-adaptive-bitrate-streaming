import { useState, ChangeEvent, FormEvent } from 'react'
import {Button, ButtonGroup} from "@nextui-org/button";
import {Input} from "@nextui-org/input";
import {Card, CardHeader, CardBody, CardFooter} from "@nextui-org/card";
import  axios from 'axios'
import {useCookies} from 'react-cookie'
import {Upload} from 'lucide-react'

export function VideoUpload({ onVideoUpload }) {
  const [file, setFile] = useState(null)
  const [cookies , setCookies] = useCookies()

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      if (selectedFile.type.startsWith('video/')) {
        console.log("file",file)
        setFile(selectedFile)
      } else {
        setFile(null)
      }
    }
  }

  const handleSubmit = async(e) => {
    e.preventDefault()
    try {
      const s3PutUrl = await axios.get(`http://localhost:3000/api/v1/video/putObjectUrl?fileName=${file.name}&&contentType=${file.type}`)
      console.log(s3PutUrl.data.message)
      await axios.put(s3PutUrl.data.message , file , {
        headers:{
          "Content-Type":file.type
        }    
      })
      setCookies("uploadedFileName", {name:file.name})
      console.log("completed")
    } catch (error) {
      console.log("Something went wrong while uploading video" , error)
    }

  }

  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold mb-4">Upload Video</h2>
      <form
        onSubmit={handleSubmit}
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
            </div>
            {file && (
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400"
              >
                Upload Video
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}
