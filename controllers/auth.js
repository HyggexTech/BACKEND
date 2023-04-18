import User from "../models/user.js"
import bcrypt from "bcrypt";
import createError from "../utill/error.js";
const saltRounds = 10;
import  jwt from "jsonwebtoken";

export const register= async (req, res, next) => {
  try {
    const existingUser = await User.findOne({
      $or: [
        { username: req.body.username },
        { email: req.body.email },
      ],
    });
    if (existingUser) {
      return next(createError(409, "Username or email already exists"));
    }

    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(req.body.password, salt);
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hash,
      usertype: 'STUDENT'
    });
    

    await newUser.save();
    res.status(200).send("Profile Registered");
  } catch (err) {
    next(err);
  }
};
export const login= async (req, res, next) => {
    try {
      
     const user= await User.findOne({username:req.body.username})
     if(!user) return next(createError(404,"User Not Found!"));

     const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password)
     if(!isPasswordCorrect) return next(createError(400,"Wrong Username or Password!"))       
     
     const token= jwt.sign({id:user._id, usertype:user.usertype }, process.env.JWT);

     const {password, ...otherDetails}= user._doc; 
     res.cookie("access_token",token,{
        httpOnly: true
     }).status(200).json({...otherDetails, access_token: token});
    } catch (err) {
      next(err);
    }
  };

