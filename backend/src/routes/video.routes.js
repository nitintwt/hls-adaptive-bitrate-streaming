import { Router } from "express";
import { putObjectUrl } from "../controllers/video.controller.js";

const videoRouter = Router()

videoRouter.route("/putObjectUrl").get(putObjectUrl)

export default videoRouter