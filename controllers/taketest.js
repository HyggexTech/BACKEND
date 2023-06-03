import answersheet from "../models/answersheet.js";
import Question from "../models/question.js";
import Test from "../models/test.js";
import User from "../models/user.js";
// import { updateStatus } from "./test.js";

// const getTestStatus = (test) =>{
//     if(test.status === 'CANCELLED')
//     return test.status;
//   const status = 'CREATED'
//   const now = new Date();
//   if(Date.parse(test.resultTime) < now) {
//     status = 'RESULT_DECLARED';
//   } else if(Date.parse(test.endTime) < now) {
//     status = 'TEST_COMPLETE';
//   } else if(Date.parse(test.startTime) < now) {
//     status = 'TEST_STARTED';
//   }
//   return status;
// }

const getAttemptEndTime = (test, startAttemptTme) =>{
    const regularEndTime = new Date(Date.parse(startAttemptTme) + (test.duration*1000));
    return regularEndTime;
}

const sortByIds = (questions, questionids) => {
    const result = [];
    for(const i in questionids) {
      for(const j in questions) {
        if(questionids[i].toString() === questions[j]._id.toString()) {
          result.push(questions[j]);
          break;
        }
      }
    }
    return result;
  }
  const getIndex = (questionDetail, questionids) =>{
    for(const j in questionids){
        if(questionDetail._id.toString()===questionids[j].toString())
         return j;
    }
    return -1;
  }

  const calculateMarks = async (questionids, answers , ansid) =>{
    const marks = 0;
    const questionDetails = await Question.find({_id:{$in:questionids}})
    .catch(err => {
        console.log(err);
    }) 
   if(questionDetails.length !== questionids.length) {
    console.log("not all questions found");
    return;
   }
   for(const i in questionDetails) {
    const index = getIndex(questionDetails[i], questionids);
    if(index!=-1 && answers[index]!= null){
        if(questionDetails[i].answer.toString() === answers[index].toString()){
            marks += questionDetails[i].marks;
        }
    }
   }
   try {
    const result = await answersheet.findOneAndUpdate({ _id: ansid, completed: true }, { score: marks });
    console.log("score is added in answersheet " + ansid);
  } catch (err) {
    console.log(err);
  }
  }


  export const startTestForStudent = async (req, res, next) => {
    try {
      const test = await Test.findById(req.params.testid);
  
      if (!test) {
        res.json({
          success: false,
          message: 'Unable to find test',
        });
        return;
      }
  
      const student = await User.findById(req.user.id);
  
      if (!student) {
        res.json({
          success: false,
          message: 'Unable to find student',
        });
        return;
      }
  
      const answersheets = await answersheet.find({
        student: req.user.id,
        test: req.params.testid,
      });
  
      if (answersheets.length > 0) {
        if (Date.now() > getAttemptEndTime(test, answersheets[0].startTime)) {
          answersheets[0].completed = true;
          await answersheet.findByIdAndUpdate(
            answersheets[0]._id,
            answersheets[0]
          );
          console.log(
            `answer sheet marked completed for test ${test._id} user ${req.user.id}`
          );
          await calculateMarks(
            test.questions,
            answersheets[0].answers,
            answersheets[0]._id
          );
        }
  
        if (answersheets[0].completed) {
          res.json({
            success: false,
            message: 'you have taken this test',
          });
        } else {
          res.json({
            success: true,
            message: 'test is already started',
            answersheet: answersheets[0],
            questions: test.questions,
          });
        }
      } else {
        const tempdata = new answersheet({
          test: req.params.testid,
          student: req.user.id,
        });
        const newdata = await tempdata.save();
        res.json({
          success: true,
          message: 'Test started',
          answersheet: newdata,
          questions: test.questions,
        });
      }
    } catch (err) {
      console.log(err);
      res.json({
        success: false,
        message: 'Unable to start test',
      });
    }
  };
    
  export const getQuestionsAndSetStartTime = async (req, res, next) => {
    const ques = await Question.find({ _id: { $in: req.body.questionid } });
    const questions = sortByIds(ques, req.body.questionid);
  
    let startTime = "";
    if (req.body.addStartTime) {
      startTime = new Date();
      const anssheet = await answersheet.findByIdAndUpdate({ _id: req.body.answersheetid }, { startTime: startTime })
        .catch((err => {
          res.json({
            success: false,
            message: "Internal server error"
          });
          return;
        }));
    } else {
      const anssheet = await answersheet.findById({ _id: req.body.answersheetid })
        .catch((err => {
          res.json({
            success: false,
            message: "Internal server error"
          });
          return;
        }));
      if (anssheet) {
        startTime = anssheet.startTime;
      }
    }
    console.log(startTime);
    if (startTime > 0) {
      res.json({
        success: true,
        startTime: startTime,
        questions: questions.map(x => ({
          _id: x._id,
          body: x.body,
          options: x.options,
          marks: x.marks,
          subject: x.subject
        }))
      });
    } else {
      res.json({
        success: false,
        message: "answersheet not found"
      });
    }
  };
  

  export const saveAnswer = async (req, res, next) => {
    try {
  
      const anssheet = await answersheet.findById({
        _id: req.body.answersheetid,
      });
      if (anssheet) {
        if (anssheet.completed) {
          res.json({
            success: true,
            testDone: true,
            message: "Test is completed",
          });
          return;
        }
        const test = await Test.findById({ _id: anssheet.test });
        if (Date.now() - getAttemptEndTime(test, anssheet.startTime) > 0) {
          await answersheet.findByIdAndUpdate(
            { _id: req.body.answersheetid },
            { answers: req.body.answers, completed: true }
          );
          res.json({
            success: true,
            testDone: true,
            message: "answers updated",
          });
          calculateMarks(test.questions, req.body.answers, req.body.answersheetid);
        } else {
          await answersheet.findByIdAndUpdate(
            { _id: req.body.answersheetid },
            { answers: req.body.answers }
          );
          res.json({
            success: true,
            testDone: false,
            message: "answers updated",
          });
        }
      } else {
        res.json({
          success: false,
          message: "Answersheet not found",
        });
      }
    } catch (err) {
      console.log(err);
      res.json({
        success: false,
        message: "Internal server error",
      });
    }
  };
   

  
export  const saveAnswerandEndTest = async (req, res, next) => {
    try {
      
  
      const anssheet = await answersheet.findById({ _id: req.body.answersheetid });
      if (!anssheet) {
        res.json({
          success: false,
          message: "Answersheet not found"
        });
        return;
      }
  
      if (anssheet.completed) {
        res.json({
          success: true,
          message: "Test is completed"
        });
        return;
      }
  
      const test = await Test.findById({ _id: anssheet.test });
      if (!test) {
        console.log("could not mark answersheet completed");
        res.json({
          success: false,
          message: "Test not found"
        });
        return;
      }
  
      if (Date.now() - getAttemptEndTime(test, anssheet.startTime) > 10 * 1000) {
        anssheet.completed = true;
        await anssheet.save();
        console.log(`answer sheet marked compeleted for test ${test._id}`);
        res.json({
          success: true,
          message: "Test is completed"
        });
        calculateMarks(test.questions, anssheet.answers, anssheet._id);
      } else {
        anssheet.answers = req.body.answers;
        anssheet.completed = true;
        await anssheet.save();
        res.json({
          success: true,
          message: "Test is completed"
        });
        calculateMarks(test.questions, req.body.answers, anssheet._id);
      }
    } catch (error) {
      console.log(error);
      res.json({
        success: false,
        message: "Internal server error"
      });
    }
  }
   