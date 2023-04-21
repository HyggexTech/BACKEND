import express from "express";
import Test from "../models/test.js";
import Question from "../models/question.js";
import { verifyTeacher } from "../utill/verifytoken.js";
import { createTest, deleteTest, getAllTest, getTestQuestion } from "../controllers/test.js";


const router = express.Router();
//CREATE TEST
router.post("/create", verifyTeacher, createTest );
//GET ALL TESTS
router.get('/allTest', getAllTest);
//GET QUESTION OF SPECIFIC TEST
router.get('/:testId/questions', getTestQuestion );
//DELETE TEST
router.delete('/delete', deleteTest);

export default router;
