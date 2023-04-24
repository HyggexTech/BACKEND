import express from "express";
import { verifyTeacher, verifyToken } from "../utill/verifytoken.js";
import { getAllSubject } from "../controllers/subjects.js";
import { getUpcomingTestforStudent } from "../controllers/test.js";
import { getQuestionsAndSetStartTime, saveAnswer, saveAnswerandEndTest, startTestForStudent } from "../controllers/taketest.js";
const router= express.Router();


router.get("/checkauthentication", verifyToken, (req,res,next)=>{
   res.send("You are Logged in")
})
router.get("/checkteacher/:id", verifyTeacher, (req,res,next)=>{
   res.send("You are Logged in as Teacher")
})

router.get("/subjects", getAllSubject)

router.get("/upcomingtest", getUpcomingTestforStudent)

router.post("/startTest", startTestForStudent)
router.post("/getquenStartTime", getQuestionsAndSetStartTime)
router.post("/saveAnswer", saveAnswer)
router.post("/endTest", saveAnswerandEndTest)
export default router;
