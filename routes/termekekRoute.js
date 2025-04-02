const express = require('express');
const router = express.Router();
const {
    allTermek,
    termekRegister,
    termekDelete,
    Termek

} = require('../controllers/termekekController');


router.get("/alltermek", allTermek)
router.post("/createtermek",termekRegister)
router.delete("/delete/:id",termekDelete)
router.get("/termek/:id", Termek)

module.exports = router