import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoute from "./routes/auth.js"
import userRoute from "./routes/user.js"
import questionRoute from "./routes/question.js"
import testRoute from "./routes/test.js"
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import path from 'path';

const app = express();

const PORT = process.env.PORT || 8000

dotenv.config();
const connect = async () => {
  try {
    await mongoose.connect(process.env.DATABASE, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      writeConcern: {
        w: "majority"
      }
    });
    console.log("connected to mongodb");
  } catch (error) {
    throw error;
  }
};

//middlewares
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:3001", "http://localhost:3000", "https://hyggexx.onrender.com","https://hyggex-backend.onrender.com" ],
    credentials: true,
    allowedHeaders: ["Authorization", "Content-Type"],
    optionsSuccessStatus: 200,
    exposedHeaders: ["Authorization"],
    methods: ["GET", "PUT", "POST", "DELETE"],

  })
);

app.use(morgan("dev"));
app.use(express.json());

app.use("/api/test", testRoute);
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/question", questionRoute);

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something Went Wrong";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}


app.listen(PORT, () => {
  connect();
  console.log("SERVER STARTED");
});
