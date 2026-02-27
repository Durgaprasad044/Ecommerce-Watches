// 'use strict';

// const multer = require('multer');
// const AppError = require('../utils/AppError');
// const { MAX_FILE_SIZE, ALLOWED_IMAGE_TYPES } = require('../config/constants');

// // Use memory storage — files are forwarded to Supabase Storage in the service layer
// const storage = multer.memoryStorage();

// const fileFilter = (req, file, cb) => {
//   if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(
//       new AppError(
//         `Invalid file type. Allowed types: ${ALLOWED_IMAGE_TYPES.join(', ')}.`,
//         400
//       ),
//       false
//     );
//   }
// };

// const multerConfig = {
//   storage,
//   fileFilter,
//   limits: {
//     fileSize: MAX_FILE_SIZE,
//   },
// };

// const uploader = multer(multerConfig);

// /**
//  * Uploads a single file from the given field name.
//  * @param {string} fieldName
//  */
// const uploadSingle = (fieldName) => uploader.single(fieldName);

// /**
//  * Uploads multiple files from the given field name.
//  * @param {string} fieldName
//  * @param {number} maxCount
//  */
// const uploadMultiple = (fieldName, maxCount = 5) => uploader.array(fieldName, maxCount);

// module.exports = { uploadSingle, uploadMultiple };
const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = upload;