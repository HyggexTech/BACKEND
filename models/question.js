import mongoose from "mongoose";
import { Schema } from "mongoose";
const QuestionSchema= new mongoose.Schema({
    // body : {
    //     type : String,
    //     required : true
    //   },
      explanation : {
        type : String
      },
      options : [ {
        type : String,
        required : true
      }],
      subject : {
        type : String,
        // ref : 'subjectModel',
        required : true
      },
      answer : {
        type : String,
        required : true
      },
      marks : {
        type : Number,
        required : true
      },
      status : {
        type : Boolean,
        required : true,
        default : true
      },
    //   createdBy : {
    //     type : mongoose.Schema.Types.ObjectId,
    //     ref : 'userModel'
    //   }
    }, 
    {
      timestamps: {}
})
export default mongoose.model("Question", QuestionSchema)