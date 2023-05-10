import createError from "../utill/error.js";
import Test from "../models/test.js";
import Question from "../models/question.js";
import Subject from "../models/subject.js";


  const generateTestpaper = async (subjects, maxmarks, queTypes) => {
    let templist = [];
    let quelist = [];
    let anslist = [];
    let totalMarks = 0;
    try {
      const allQuestions = await Question.find({ status: true, subject: { $in: subjects }, marks: { $in: queTypes } });
      for (let x in allQuestions) {
        totalMarks += allQuestions[x].marks;
      }
      if (totalMarks < maxmarks) {
        console.log('Not enough questions for the given subjects.');
      } else {
        let remaining = maxmarks;
        const qIndexSet = new Set();
        while (remaining > 0) {
          const i = Math.floor(Math.random() * allQuestions.length);
          if (qIndexSet.has(i) || allQuestions[i].marks > remaining) {
            continue;
          } else {
            qIndexSet.add(i);
            quelist.push(allQuestions[i]._id);
            anslist.push(allQuestions[i].answer);
            remaining -= allQuestions[i].marks;
          }
        }
      }
      return { quelist, anslist };
    } catch (err) {
      console.log(err);
      return { quelist, anslist };
    }
  };
  
  

  
  
 export const createTest = async (req, res) => {
  const genQue = await generateTestpaper(req.body.subjects,req.body.maxmarks, req.body.queTypes);
  if(genQue.quelist.length < 1) {
    res.json({
      success : false,
      message : 'Not enough questions for selected subject'
    })
    return;
  }

const tempdata= new Test({
  title: req.body.title,
  subjects: req.body.subjects,
  maxmarks: req.body.maxmarks,
  queTypes : req.body.queTypes,
  questions : genQue.quelist,
  answers : genQue.anslist,
  startTime : req.body.startTime,
  duration : req.body.duration,
  // regStartTime : req.body.regStartTime,
  // regEndTime : req.body.regEndTime,
  // resultTime : req.body.resultTime,

})
try {
  await tempdata.save();
  res.json({
    success: true,
    message: 'Test created successfully',
  });
} catch (error) {
  console.log(error);
  res.status(500).json({
    success: false,
    message: 'Unable to create test',
  });
}
}
  //   try {
  //     const { title, subjects, maxmarks, queTypes, endTime, duration, regStartTime, regEndTime, resultTime } = req.body.test;
  
  //     const newTest = new Test({
  //       title,
  //       subjects,
  //       maxmarks,
  //       queTypes,
  //       endTime,
  //       duration,
  //       regStartTime,
  //       regEndTime,
  //       resultTime,
  //     });
  
  //     const questionIds = [];
  
  //     for (const q of req.body.questions) {
  //       const {body, explanation, options, subject, answer, marks } = q;
  //       const newQuestion = new Question({
  //         body,
  //         explanation,
  //         options,
  //         subject,
  //         answer,
  //         marks,
  //         status: true
  //       });
  //       const addedQuestion = await newQuestion.save();
  //       questionIds.push(addedQuestion._id);
  //     }
  
  //     newTest.questions = questionIds;
  //     const addedTest = await newTest.save();
  
  //     res.status(200).json({
  //       success: true,
  //       message: 'Test with questions created successfully!',
  //       test: addedTest
  //     });
  
  //   } catch (err) {
  //     res.status(500).json({
  //       success: false,
  //       message: 'Test with questions not created',
  //       error: err.message
  //     });
  //   }
  // } 



export const getAllTest = async (req, res) => {
    try {
      const tests = await Test.find()
    
      res.json(tests)
    }catch(err){
      console.log(err);
      res.json({
        success:false,
        message: "an error occured"
      })
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

export const getUpcomingTestforStudent = async (req, res, next) => {
  
  try {
    const tests = await Test
    .find({ startTime: { $gte: Date.now() } })
    .sort({ startTime: 1 });
  
    
    const testlist = tests.reduce((acc, test) => {  
      acc.push({
          _id: test._id,
          title: test.title,
          startTime: test.startTime,
          maxmarks: test.maxmarks,
          duration: test.duration,
        });
    
      return acc;
    }, []);

    res.json({ success: true, upcomingtestlist: testlist });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getTestsDetailsFromId = async (req, res, next) => {
  try {
    const test = await Test.findById({ _id: req.body.testid });
    if (test) {
      

      const testResponse = {
        _id: test._id,
        title: test.title,
        startTime: test.startTime,
        maxmarks: test.maxmarks,
        duration: test.duration,
      };

      
      return res.json({
        success: true,
        test: testResponse,
      });
    } else {
      return res.json({
        success: false,
        message: "test id not found",
      });
    }
  } catch (err) {
    console.log(err);
    return res.json({
      success: false,
      message: "Internal server error",
    });
  }
};
