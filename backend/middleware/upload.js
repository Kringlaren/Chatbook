import multer from "multer";
import path from "path";

// Sparar destination och namn för alla filer som laddas upp
const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, "./uploads/");
    },
    filename: (req, file, callBack) => {
        callBack(null, Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, callBack) => {
    if (file.mimetype.startsWith("image/")) {
        callBack(null, true);
    } else {
        callBack(new Error("Endast bildfiler är tillåtna!", false));
    }
};

const upload = multer({ storage, fileFilter });

export default upload;