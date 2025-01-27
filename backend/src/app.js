import express from "express";
import cors from 'cors'
import videoRouter from "./routes/video.routes.js";

const app = express()

app.use(cors({
  origin:"*",
  credentials:true
}))
app.use(express.json({limit:'16kb'})) 

app.get("/", (req , res)=>{
  return res.status(200).json({message:"Hello from HLS"})
})

app.use("/api/v1/video", videoRouter)

export {app}