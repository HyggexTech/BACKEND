import mongoose from "mongoose";

const SubjectSchema= new mongoose.Schema({
    name : {
        type : String,
        required : true,
        unique : true
      },
      status : {
        type : Boolean,
        required : true,
        default : true
      },
    //   createdBy : {
    //     type : mongoose.Schema.Types.ObjectId,
    //     ref : 'adminModel'
    //   }
    },
    {
      timestamps : {}
    
})
export default mongoose.model("subjectModel", SubjectSchema);