import express from "express";
import question from "../models/question.js";

const router = express.Router();

//ADD QUESTION
router.post("/", async (req, res) => {
  const { explanation, options, subject, answer, marks } = req.body;
  const newQuestion = new question({
    explanation,
    options,
    subject,
    answer,
    marks,
    status: true
  });

  try {
    const addedQuestion = await newQuestion.save();
    res.status(200).json(  {success : true,
      message : 'Question created successfully!'});
  } catch (err) {
    res.status(500).json({
      success: false,
      message:'Question not Created'
    });
  }
});

export default router;
