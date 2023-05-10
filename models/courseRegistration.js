import mongoose from "mongoose";

const courseRegistration = new mongoose.Schema({
user: {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'User'
},
course : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'Course'
}

},
{
    timestamps: {}
}
)

export default mongoose.model("Registration", courseRegistration)