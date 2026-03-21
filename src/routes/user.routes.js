import {Router} from "express";
import { registerUser } from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";


const router = Router()




// router.get("/register", (req,res)=>{
//     res.json({message:"route working"})
// })

router.route("/register").post(
    upload.fields([
       {name:"avatar",
        maxCount: 1
       },
       {
        name:"coverImage",
        maxCount:1
       }
    ]),
    registerUser)


export default router