import express from "express";
import { addQuestion, allQuestion, deleteQuestion, updateQuestion } from "../controllers/question.js";
import { verifyTeacher } from "../utill/verifytoken.js";

const router = express.Router();

//ADD QUESTION
router.post("/add",verifyTeacher, addQuestion );
//UPDATE QUESTION
router.put("/:id/update", verifyTeacher, updateQuestion);
//DELETE QUESTION
router.delete("/:id/delete", verifyTeacher, deleteQuestion)
//GET ALL QUESTIONS
router.get('/all', allQuestion );

export default router;
