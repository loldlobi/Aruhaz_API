const express = require('express');
const router = express.Router();
const {
    allTermek,
    termekRegister,
    termekDelete

} = require('../controllers/termekekController');


router.get("/alltermek", allTermek)
router.post("/createtermek",termekRegister)
router.delete("/delete/:id",termekDelete)

module.exports = router