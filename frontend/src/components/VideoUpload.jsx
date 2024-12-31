import { useState, ChangeEvent, FormEvent } from 'react'
import {Button, ButtonGroup} from "@nextui-org/button";
import {Input} from "@nextui-org/input";
import {Card, CardHeader, CardBody, CardFooter} from "@nextui-org/card";

export function VideoUpload({ onVideoUpload }) {
  const [file, setFile] = useState(null)

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

  const handleSubmit = (e) => {
    e.preventDefault()

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