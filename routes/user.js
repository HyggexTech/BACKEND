import express from "express";

const router= express.Router();
 
router.get("/", (req,res)=>{
    res.send("Hello This is USER endpoint")
})

router.post("/",async(req,res)=>{
    try {
        
    } catch (error) {
        res.status(500).json(error)
    }
})

export default router;
