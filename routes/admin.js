import express from "express";
import { addSubject } from "../controllers/admin.js";

const router= express.Router();

router.post("/addsubject", addSubject)

export default router;