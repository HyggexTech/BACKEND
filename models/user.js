import mongoose from "mongoose";

const UserSchema= new mongoose.Schema({
    username : {
        type : String,
        required : true,
        unique:true
      },
      email : {
        type : String,
        required : true,
        unique : true
      },
      usertype : {
        type : String,
        enum : ['TEACHER', 'STUDENT'],
        required : true 
      }, 
      password : {
        type : String,
        required : true
      },
    //   isAdmin : {
    //     type : Boolean,
    //     default : false
    //   },
    // //   createdBy : {
    //     type : mongoose.Schema.Types.ObjectId,
    //     ref : 'adminModel'
    //   }
    
    },
    {
      timestamps:{}
})
export default mongoose.model("User", UserSchema)