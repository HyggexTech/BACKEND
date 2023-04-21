import question from "../models/question.js";
import createError from "../utill/error.js";
import Subject from "../models/subject.js";
import mongoose from "mongoose";

export const addQuestion=async (req, res) => {
  const subject=  await Subject.findOne({_id:req.body.subject, status: true});
   if(!subject){
    res.status(404).json({
      success: false,
      message: "Invalid Subjects"
    })
   }
    
    const newQuestion = new question({
      body : req.body.body,
      explanation : req.body.explanation,
      options: req.body.options,
      subject :subject._id,
      answer: req.body.answer,
      marks: req.body.marks,
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
  }

 export const updateQuestion = async(req,res)=>{
  try {
    const updatedQuestion= await question.findByIdAndUpdate(req.params.id,{$set: req.body}, {new:true})
    res.status(200).json(updatedQuestion)
  } catch (err) {
    res.status(500).json({success:false, message:'Question Not Updated'});
  }
} 

export const deleteQuestion = async(req,res,next)=>{
  
  try {
    const deleteQuestion= await question.findByIdAndDelete(req.params.id)
    res.status(200).json({success:true, message:'Question Deleted Succesfully'})
  } catch (err) {
    next(err)
  }
}

export const allQuestion = async (req, res) => {
  try {
    const questions = await question.find();
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}