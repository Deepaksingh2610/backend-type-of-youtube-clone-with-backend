import multer from "multer"

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp")
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)    // we should change there name using multer because same name many file can overwrite them self on server
  }
})

export const upload = multer({ 
    storage: storage
 })