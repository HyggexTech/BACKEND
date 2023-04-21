import Subject from "../models/subject.js";

export const getAllSubject = async (req, res, next) => {
    try {
      const sub = await Subject.find({});
      const subjects = sub.map((subject) => ({
        id: subject._id,
        subject: subject.name,
        status: subject.status,
      }));
      res.json({ success: true, subjects });
    } catch (error) {
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };
  
