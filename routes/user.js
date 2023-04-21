import express from "express";
import { verifyTeacher, verifyToken } from "../utill/verifytoken.js";
import { getAllSubject } from "../controllers/subjects.js";
import { getUpcomingTestforStudent } from "../controllers/test.js";
const router= express.Router();


router.get("/checkauthentication", verifyToken, (req,res,next)=>{
   res.send("You are Logged in")
})
router.get("/checkteacher/:id", verifyTeacher, (req,res,next)=>{
   res.send("You are Logged in as Teacher")
})

router.get("/subjects", getAllSubject)

router.get("/upcomingtest", getUpcomingTestforStudent)

export default router;
