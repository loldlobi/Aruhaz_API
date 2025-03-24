const express = require('express');
const router = express.Router();
const {protect} = require('../mwares/authMiddleware');
const {
    register,
    login,
    getAllUser,
    getAllUserTermek
} = require('../controllers/userController');

router.post("/regisztracio", register);
router.post("/login", login);
router.get("/usertermekek", getAllUserTermek);
//debughoz
router.get("/alluser", getAllUser);

module.exports = router