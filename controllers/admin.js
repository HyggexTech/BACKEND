import Subject from "../models/subject.js";
import Course from "../models/course.js";
import createError from "../utill/error.js";

export const addSubject = async (req, res, next) =>{
try {
  const subject = await Subject.findOne({'name': req.body.name});
  
  if(subject){
    res.json({
        success: false,
        message: 'Subject already esists'
    })

  }else{
    const newSubject = new Subject({
        name: req.body.name,
        status:true
    });
     newSubject.save(); 
     
     res.json({
        success: true,
        message: 'Subject created successfully!'
     })
  }

    
} catch (err) {
    console.log(err);
    res.status(500).json({
        success: false,
        message: "Unable to add Subject"
    })
}   
}

export const addCourse =  async(req, res ,next) =>{
try {

  const course = await Course.findOne({name: req.body.name});
  if(course) return next(createError(404,"Course Already Exists"));

  const newCourse = new Course({
    name: req.body.name,
    body: req.body.body
  });
  
  await newCourse.save();
  res.status(200).send("Course Created")

  
} catch (err) {
  next(err);
}
  
}



