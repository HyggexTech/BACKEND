import Answersheet from "../models/answersheet.js";
import Test from "../models/test.js";
import Subject from "../models/subject.js";

export const getAllCompletedTest = async (req, res, next) => {
    try {
        


      const answerSheetResults = await Answersheet.find({
        student: req.user._id,
        completed: true,
      }, { test: 1 });
  
      const testIds = answerSheetResults.map(x => x.test);
  
      const tests = await Test.find({ _id: { $in: testIds } });
  
  
      return res.json({
        success: true,
        completedtestlist: tests.map(t => ({
          _id: t._id,
          title: t.title,
          maxmarks: t.maxmarks,
          subjects: t.subjects,
        })),
      });
    } catch (err) {
      console.log(err);
      return res.json({
        success: false,
        message: "Internal server error",
      });
    }
  };
  
  export  const getResultMainDetailsByTestId = async (req, res, next) => {
    try {
      
      const answersheets = await Answersheet.find({
        student: req.user._id,
        test: req.body.testid,
        completed: true,
      });
  
      if (answersheets[0]) {
        const test = await Test.findById({ _id: req.body.testid });
        if (test) {
          const subjects = await Subject.find(
            { _id: { $in: test.subjects } },
            { name: 1 }
          );
          const subs = subjects.map((sub) => sub.name);
          res.json({
            success: true,
            result: {
              title: test.title,
              maxmarks: test.maxmarks,
              subjects: subs,
              score: answersheets[0].score,
              questions: test.questions,
              answers: answersheets[0].answers,
            },
          });
        } else {
          res.json({
            success: false,
            message: 'Answer sheet not found',
          });
        }
      } else {
        res.json({

          success: false,
          message: 'Answer sheet not found',
        });
      }
    } catch (err) {
      console.log(err);
      res.json({
        success: false,
        message: 'Internal server error',
      });
    }
  };
  