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
    Bucket:"nitintwt27.hls",
    Key:key
  })
  const url = await getSignedUrl(s3Client , command)
  return url
}

const putObjectUrl = async (req , res)=>{
  const {fileName , contentType} = req.query
  console.log(fileName , contentType)
  const command = new PutObjectCommand({
    Bucket:"nitintwt27.hls",
    Key:`user-uploads/${fileName}`,
    contentType:contentType
  })
  const url = await getSignedUrl(s3Client , command)
  return res.status(200).json({message: url})
}


export {putObjectUrl}