import express from "express";
import { verifyStudent, verifyTeacher, verifyToken } from "../utill/verifytoken.js";
import { getAllSubject } from "../controllers/subjects.js";
import { getUpcomingTestforStudent } from "../controllers/test.js";
import { getQuestionsAndSetStartTime, saveAnswer, saveAnswerandEndTest, startTestForStudent } from "../controllers/taketest.js";
import { getAllCompletedTest, getResultMainDetailsByTestId } from "../controllers/result.js";
import { courseReg, getAllCourseWithStudentRegisterCheck, registerdCourseForUser } from "../controllers/user.js";
const router= express.Router();


router.get("/checkauthentication", verifyToken, (req,res,next)=>{
   res.send("You are Logged in")
})
router.get("/checkteacher/:id", verifyTeacher, (req,res,next)=>{
   res.send("You are Logged in as Teacher")
})

router.get("/subjects", getAllSubject)
router.get('/completedTest', verifyStudent, getAllCompletedTest)
router.post('/getResultMainDetailsByTestId', verifyStudent, getResultMainDetailsByTestId)

router.get("/upcomingtest", getUpcomingTestforStudent)


router.post("/register", verifyStudent, courseReg)
router.get("/allRegisteredCourse", verifyStudent, getAllCourseWithStudentRegisterCheck)
router.get("/registeredCourse", verifyStudent, registerdCourseForUser )

router.post("/startTest", verifyStudent, startTestForStudent)
router.post("/getquenStartTime", getQuestionsAndSetStartTime)
router.post("/saveAnswer", saveAnswer)
router.post("/endTest", saveAnswerandEndTest)
export default router;
