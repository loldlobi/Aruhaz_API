const express = require('express');
const router = express.Router();
const {protect} = require('../mwares/authMiddleware');
const {
    allTermek,
    termekRegister,
    termekDelete

} = require('../controllers/termekekController');


router.get("/alltermek", allTermek)
router.post("/createtermek",protect, termekRegister)
router.delete("/delete/:id",protect, termekDelete)

module.exports = router