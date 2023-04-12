import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoute from "./routes/auth.js"
import userRoute from "./routes/user.js"
import questionRoute from "./routes/question.js"
import bodyParser from "body-parser";
import path from "path";
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
app.use(express.json())
app.use("/api/auth", authRoute)
app.use("/api/user", userRoute)
app.use("/api/question", questionRoute)




app.listen(PORT,()=>{
    connect()
    console.log("SERVER STARTED   ");
})
  