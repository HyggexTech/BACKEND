import express from "express";
import Test from "../models/test.js";
import Question from "../models/question.js";
import { verifyTeacher } from "../utill/verifytoken.js";
import { createTest, deleteTest, getAllTest, getTestQuestion, getTestsDetailsFromId } from "../controllers/test.js";


const router = express.Router();
//CREATE TEST
router.post("/create", verifyTeacher, createTest );
//GET ALL TESTS
router.get('/allTest', getAllTest);
//GET QUESTION OF SPECIFIC TEST
router.get('/:testId/questions', getTestQuestion );
//DELETE TEST
router.delete('/delete', deleteTest);
//TEST DETAILS
router.get('/testDetails', getTestsDetailsFromId)

export default router;
