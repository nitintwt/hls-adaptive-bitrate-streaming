import {GetObjectCommand, S3Client , PutObjectCommand } from "@aws-sdk/client-s3"
import {getSignedUrl} from "@aws-sdk/s3-request-presigner"
import dotenv from "dotenv"

dotenv.config({
  path:'./.env'
})

const s3Client = new S3Client({
  region:"ap-south-1",
  credentials:{
    accessKeyId:process.env.AWS_ACCESS_KEY,
    secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY,
  }
})

// key is name of the s3 bucket file for which we want to create access url
const getObjectURL = async (key)=>{
  const command = new GetObjectCommand({
    Bucket:"nitintwt-hls-stream-files",
    Key:key
  })
  const url = await getSignedUrl(s3Client , command)
  return url
}

async function  init() {
  console.log("URL" , await getObjectURL("Recording 2024-10-29 052426.mp4/master.m3u8"))
}
init()

// function to generate a pre signed url to upload a video to my private s3 bucket
const putObjectUrl = async (req , res)=>{
  const {fileName , contentType} = req.query
  console.log(fileName , contentType)
  const command = new PutObjectCommand({
    Bucket:"nitintwt27.hls",
    Key:`${fileName}`,
    contentType:contentType
  })
  const url = await getSignedUrl(s3Client , command)
  return res.status(200).json({message: url})
}

export {putObjectUrl}