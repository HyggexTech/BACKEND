import mongoose from "mongoose";

const answersheeetSchema = new mongoose.Schema({
    test : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Test',
        required : true
      },
      student : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
      },
      score : {
        type : Number,
        default : 0,
        required : true
      },
      answers : [{
        type : String
      }],
      startTime : {
        type : Date
      },
      completed : {
        type : Boolean,
        required : true,
        default : false
      }
    },{
      timestamps : {}
})

export default mongoose.model("Answersheet", answersheeetSchema)