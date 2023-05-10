import express from "express";
import { addCourse, addSubject } from "../controllers/admin.js";

const router= express.Router();

router.post("/addsubject", addSubject)
router.post("/addCourse", addCourse)

export default router;