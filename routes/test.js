import express from "express";
import test from "../models/test.js";
import question from "../models/question.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { title, subjects, maxmarks, queTypes, endTime, duration, regStartTime, regEndTime, resultTime } = req.body.test;

    const newTest = new test({
      title,
      subjects,
      maxmarks,
      queTypes,
      endTime,
      duration,
      regStartTime,
      regEndTime,
      resultTime,
      status: 'CREATED'
    });

    const questionIds = [];

    for (const q of req.body.questions) {
      const { explanation, options, subject, answer, marks } = q;
      const newQuestion = new question({
        explanation,
        options,
        subject,
        answer,
        marks,
        status: true
      });
      const addedQuestion = await newQuestion.save();
      questionIds.push(addedQuestion._id);
    }

    newTest.questions = questionIds;
    const addedTest = await newTest.save();

    res.status(200).json({
      success: true,
      message: 'Test with questions created successfully!',
      test: addedTest
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Test with questions not created',
      error: err.message
    });
  }
});

//GET ALL TESTS
router.get('/', async (req, res) => {
  try {
    const tests = await test.find();
    res.json(tests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
