import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    body : {
        type : String,
        required: true
    },
       
    
},
{
    timestamps: {}
   }


)

export default mongoose.model('Course', courseSchema)