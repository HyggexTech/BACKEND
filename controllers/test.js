import createError from "../utill/error.js";
import Test from "../models/test.js";
import Question from "../models/question.js";


const getTestStatus = (test) => {
    if(test.status === 'CANCELLED')
      return test.status;
    var status = 'CREATED'
    var now = new Date();
    if(Date.parse(test.resultTime) < now) {
      status = 'RESULT_DECLARED';
    } else if(Date.parse(test.endTime) < now) {
      status = 'TEST_COMPLETE';
    } else if(Date.parse(test.startTime) < now) {
      status = 'TEST_STARTED';
    } else if(Date.parse(test.regEndTime) < now) {
      status = 'REGISTRATION_COMPLETE'
    } else if(Date.parse(test.regStartTime) < now) {
      status = 'REGISTRATION_STARTED';
    }
  
  
    return status;
  }
  
export const updateStatus = (test,correctStatus) => {
  
    if(correctStatus !== test.status) {
      console.log(correctStatus + " "+ test.status)
  
      testModel.findByIdAndUpdate({_id:test._id},{status : correctStatus})
      .then((updated)=>{
        console.log("updated status of test "+updated._id+" to "+correctStatus);
      }).catch((err)=>{
        console.log('Error in status update');
        console.log(err);
      })
    }
  }
  
  
 export const createTest = async (req, res) => {
    try {
      const { title, subjects, maxmarks, queTypes, endTime, duration, regStartTime, regEndTime, resultTime } = req.body.test;
  
      const newTest = new Test({
        title,
        subjects,
        maxmarks,
        queTypes,
        endTime,
        duration,
        regStartTime,
        regEndTime,
        resultTime,
      });
  
      const questionIds = [];
  
      for (const q of req.body.questions) {
        const {body, explanation, options, subject, answer, marks } = q;
        const newQuestion = new Question({
          body,
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
  } 



export const getAllTest = async (req, res) => {
    try {
      const tests = await Test.find();
      res.json(tests);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
  
export const getTestQuestion =async (req, res) => {
    try {
      const test = await Test.findById(req.params.testId).populate('questions');
      if (!test) {
        return res.status(404).json({
          success: false,
          message: 'Test not found'
        });
      }
  
      const questions = test.questions.filter(Question => Question.status === true);
      res.json(questions);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }  

 export const deleteTest = async (req, res , next) => {
    try{const deleteTest= await Test.findByIdAndDelete(req.params.id)
    res.status(200).json({
        success: true,
        message: 'Test Deleted'
    })
} catch(err){
    next(err)
}
 } 
// export const deleteTest = async (req, res, next) ={
//     try {
        
//     } catch (error) {
        
//     }
//     // try {
//     //     const updatedQuestion= await question.findByIdAndDelete(req.params.id)
//     //     res.status(200).json({success:true, message:'Question Deleted Succesfully'})
//     //   } catch (err) {
//     //     next(err)
//     //   }
// }