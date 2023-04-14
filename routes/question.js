import express from "express";
import question from "../models/question.js";
import createError from "../utill/error.js";

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
//UPDATE QUESTION
router.put("/:id", async(req,res)=>{
  try {
    const updatedQuestion= await question.findByIdAndUpdate(req.params.id,{$set: req.body}, {new:true})
    res.status(200).json({success:true, message:'Question Updated Succesfully'})
  } catch (err) {
    res.status(500).json({success:false, message:'Question Not Updated'});
  }
})

//DELETE QUESTION

router.delete("/:id", async(req,res,next)=>{
  const failed =false;
  if(failed) return next(createError(401, "You are Not Authenticated"))
  try {
    const updatedQuestion= await question.findByIdAndDelete(req.params.id)
    res.status(200).json({success:true, message:'Question Deleted Succesfully'})
  } catch (err) {
    next(err)
  }
})
//GET ALL QUESTIONS
router.get('/', async (req, res) => {
  try {
    const questions = await question.find();
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
