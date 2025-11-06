import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// ✅ Environment Validation Logging (hide secrets in logs)
console.log("⚙️ Cloudinary ENV Check:", {
  cloud_name: process.env.CLOUD_NAME || "❌ Missing!",
  api_key: process.env.CLOUD_KEY ? "✅ Loaded" : "❌ Missing",
  api_secret: process.env.CLOUD_SECRET ? "✅ Loaded" : "❌ Missing",
});

if (!process.env.CLOUD_NAME || !process.env.CLOUD_KEY || !process.env.CLOUD_SECRET) {
  console.error("❌ Missing Cloudinary ENV values!");
}

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    if (!allowedTypes.includes(file.mimetype)) {
      throw new Error("Only JPG, JPEG & PNG files allowed!");
    }
    return {
      folder: "bookswap",
      public_id: `${Date.now()}-${file.originalname.split(".")[0]}`,
    };
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    allowedTypes.includes(file.mimetype)
      ? cb(null, true)
      : cb(new Error("Invalid file type. Allowed: JPG, PNG"), false);
  },
});

// ✅ Single Upload Middleware Wrapper
export const uploadSingle = (fieldName) => (req, res, next) => {
  upload.single(fieldName)(req, res, (err) => {
    if (err) {
      console.error("❌ Upload Error:", err.message);
      return res.status(400).json({ error: err.message });
    }
    next();
  });
};

export default upload;
