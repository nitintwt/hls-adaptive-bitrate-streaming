import { useState, ChangeEvent, FormEvent } from 'react'
import {Button, ButtonGroup} from "@nextui-org/button";
import {Input} from "@nextui-org/input";
import {Card, CardHeader, CardBody, CardFooter} from "@nextui-org/card";
import  axios from 'axios'

export function VideoUpload({ onVideoUpload }) {
  const [file, setFile] = useState(null)

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      if (selectedFile.type.startsWith('video/')) {
        console.log(file.name)
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
      console.log("completed")
    } catch (error) {
      console.log("Something went wrong while uploading video" , error)
    }

  }

  return (
    <Card className="mt-6">
      <CardHeader>
        Upload Video
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              id="file"
              type="file"
              onChange={handleFileChange}
              accept="video/*"
              required
            />
          </div>
          <Button type="submit"  color="primary" variant="solid">
            Upload Video
          </Button>
        </form>
      </CardBody>
    </Card>
  )
}
