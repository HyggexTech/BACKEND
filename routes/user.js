import express from "express";
import { verifyTeacher, verifyToken } from "../utill/verifytoken.js";
const router= express.Router();


router.get("/checkauthentication", verifyToken, (req,res,next)=>{
   res.send("You are Logged in")
})
router.get("/checkteacher/:id", verifyTeacher, (req,res,next)=>{
   res.send("You are Logged in as Teacher")
})


export default router;
