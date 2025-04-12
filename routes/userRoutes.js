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
//debughoz
router.get("/alluser", getAllUser);
router.get("/profil/:id", protect, userProfil);

module.exports = router
