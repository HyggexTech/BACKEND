import mongoose from "mongoose";

const TestSchema=new mongoose.Schema({
    title : {
        type : String,
        required : true
      },
      subjects : [{
        type : String,
        required: true
      }],
      questions : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Question'
      }],
      maxmarks : {
        type : Number,
        required : true
      },
      queTypes : [{
        type : Number
      }],
      startTime : {
        type : Date
      },
      endTime : {
        type : Date,
        required : true
      },
      duration : {
        type : Number,
        required : true
      },
      regStartTime : {
        type : Date,
        required : true
      },
      regEndTime : {
        type : Date,
        required : true
      },
      resultTime : {
        type : Date,
        required : true
      },
      status : {
        type : String,
        enum : ['CREATED','REGISTRATION_STARTED','REGISTRATION_COMPLETE','TEST_STARTED','TEST_COMPLETE','RESULT_DECLARED','CANCELLED'],
        default : 'CREATED'
      },
      // createdBy : {
      //   type : mongoose.Schema.Types.ObjectId,
      //   ref : 'User',
      //   required : true
      // }
    },
    {
      timestamps : {}
})
export default mongoose.model("Test", TestSchema)