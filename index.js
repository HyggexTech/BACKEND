import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoute from "./routes/auth.js"
import userRoute from "./routes/user.js"
import questionRoute from "./routes/question.js"
import testRoute from "./routes/test.js"
import cors from "cors";
import morgan from "morgan";
const app =express();

const PORT = process.env.PORT || 8000

dotenv.config();
const connect= async ()=>{
try {
    await mongoose.connect(process.env.DATABASE, {useNewUrlParser: true,
        useUnifiedTopology: true,
        writeConcern: {
            w: "majority"
          }
    }
        );
    console.log("connected to mongodb"); 
} catch (error) {
    throw error;
  }
};

//middlewares
app.use(cors())
app.use(morgan("dev"))
app.use(express.json())
app.use("/api/test", testRoute)
app.use("/api/auth", authRoute)
app.use("/api/user", userRoute)
app.use("/api/question", questionRoute)

app.use((err,req,res,next)=>{
    const errorStatus=err.status || 500
    const errorMessage=err.message || "Something Went Wrong"
  return res.status(500).json({
    success:false,
    status:errorStatus,
    message:errorMessage,
    stack: err.stack
  })
})



app.listen(PORT,()=>{
    connect()
    console.log("SERVER STARTED");
})
  