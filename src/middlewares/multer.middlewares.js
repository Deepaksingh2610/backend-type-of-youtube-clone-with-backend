import multer from "multer"
import os from "os"

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, os.tmpdir())
  },
  filename: function (req, file, cb) {
    // Add timestamp to prevent overwriting files with the same name
    cb(null, Date.now() + '-' + file.originalname)
  }
})

export const upload = multer({ 
    storage: storage
})