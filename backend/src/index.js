import express from 'express'
import { app } from './app.js'
import dotenv from "dotenv"

dotenv.config({
  path:'./.env'
})

const PORT = 3000

app.listen(PORT , ()=>{
  console.log("Server running properly")
})

