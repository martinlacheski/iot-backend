const multer = require("multer");

// Configuración de Multer para la subida de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/"); // Directorio donde se guardarán los archivos subidos
  },
  filename: (req, file, cb) => {
    const fileNameUpperCase = file.originalname.toUpperCase();
    cb(null, Date.now() + "-" + fileNameUpperCase); // Nombre del archivo
  },
});

const upload = multer({ storage: storage });

module.exports = { upload };
