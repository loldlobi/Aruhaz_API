const express = require('express');
const router = express.Router();
const {protect} = require('../mwares/authMiddleware');
const {
    register,
    login,
    getAllUser,
    getAllUserTermek,
    userProfil
} = require('../controllers/userController');

router.post("/regisztracio", register);
router.post("/login", login);
router.get("/usertermekek", protect, getAllUserTermek);
router.get("/profil/:id", protect, userProfil);
//debughoz
router.get("/alluser", protect, getAllUser);

//h
module.exports = router
