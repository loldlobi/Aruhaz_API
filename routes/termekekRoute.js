const express = require('express');
const router = express.Router();
const {protect} = require('../mwares/authMiddleware');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 15 * 1024 * 1024 // 15MB limit
    }
});

const {
    allTermek,
    termekRegister,
    termekDelete
} = require('../controllers/termekekController');

router.get("/alltermek", allTermek)
router.post("/createtermek", protect, upload.any(), termekRegister)
router.delete("/delete/:id", protect, termekDelete)

module.exports = router