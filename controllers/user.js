import Course from "../models/course.js";
import courseRegistration from "../models/courseRegistration.js";
import createError from "../utill/error.js";

export const courseReg = async (req, res, next) => {
    try {
      const courseRegFind = await courseRegistration.findOne({
        user: req.user.id,
        course: req.body.courseid
      });
      if (courseRegFind) {
        return res.status(404).json({
          success: false,
          message: "Already registered for this course"
        });
      }
      const tempdata = new courseRegistration({
        course: req.body.courseid,
        user: req.user.id
      });
      await tempdata.save();
      res.status(200).json({
        success: true,
        message: "Course registration successful"
      });
    } catch (err) {
      console.log(err);
      next(err);
    }
  };
  
export const registerdCourseForUser= async (req, res, next) => {
  try {
    const courses = await courseRegistration.find({user: req.user.id}).populate('course').select('course');
    if(!courses) return createError(404, "No courses Found")
    res.status(200).json({
      success: true,
      courses
    })
    
  } catch (err) {
    next(err);
    
  }
}



export const getAllCourseWithStudentRegisterCheck = async (req, res, next) => {
    try {
  
      const courses = await Course.find();
      const courselist = new Array(courses.length);
      const registeredList = await courseRegistration.find(
        { user: req.user.id },
        { course: 1 }
      );
      if(!registeredList) createError(404, "Not Registered")
  
      for (const x in courses) {
        const isReg = registeredList.find(
          (course, index) =>
            course.course.toString() === courses[x]._id.toString()
        );
        courselist[x] = {
          _id: courses[x]._id,
          name: courses[x].name,
          isRegistered: isReg !== undefined,
        };
      }
  
      return res.json({
        success: true,
        courselist
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  };
   