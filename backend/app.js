import express from "express";
import cors from 'cors'
import videoRouter from "./src/routes/video.routes.js";

const app = express()

app.use(cors({
  origin:"*",
  credentials:true
}))

app.get("/", (req , res)=>{
  return res.status(200).json({message:"Hello from hsl"})
})

app.use("/api/v1/video", videoRouter)

export {app}