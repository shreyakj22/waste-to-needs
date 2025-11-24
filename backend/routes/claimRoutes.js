import express from "express";
import { claimItem } from "../controllers/claimController.js";

const router = express.Router();

router.post("/claim", claimItem);

export default router;
