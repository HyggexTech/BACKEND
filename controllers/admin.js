import Subject from "../models/subject.js";

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

