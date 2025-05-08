const jwt = require('jsonwebtoken')
const argon2 = require('argon2');
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient()
var isValidEmail = require('is-valid-email');

const generateToken = (id) => {
    return jwt.sign({ id }, "szupertitkostitok", { expiresIn: "1d" });
}

const register = async (req, res) => {
    const { email, username, password } = req.body

    if (!email || !username || !password) {
        return res.status(404).json({ message: "Hiányos adatok!" });
    }

    if (!isValidEmail(email))
        return res.status(406).json({ message: "Nem helyes email cím!" });

    const user = await prisma.user.findFirst({
        where: {
            email: email
        }
    });

    if (user) {
        return res.status(401).json({ message: "Email-cím már használatban!" });
    }

    const hash = await argon2.hash(password);

    const newUser = await prisma.user.create({
        data: {
            email: email,
            username: username,
            password: hash
        }
    });

    res.json({
        message: "Sikeres regisztráció!",
        newUser: newUser
    });
}

const login = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(406).json({
            message: "Hiányzó adatok!"
        });
    }
    const user = await prisma.user.findFirst({
        where: {
            email: email
        }
    });



    if (!user) {
        return res.status(404).json({
            message: "Nem létező fiók!"
        });
    }


    const passMatch = await argon2.verify(user.password, password);

    if (passMatch) {
        const token = generateToken(user.user_id)
        return res.json({
            message: "Sikeres bejelentkezés!",
            username: user.username,
            token
        })
    } else {
        return res.status(401).json({
            message: "Helytelen jelszó!"
        });
    }
}

const getAllUser = async (req, res) => {
    const users = await prisma.user.findMany();
    res.json(users)
}

const getAllUserTermek = async (req, res) => {

    console.log(req.user)
    const usertermekek = await prisma.termekek.findMany({
        where: {
            user_id:
                req.user.user_id
        }
    })
    res.json(usertermekek)
}

const userProfil = async (req, res) => {
    try {
        const userId = Number(req.params.id);
        const user = await prisma.user.findUnique({
            select: {
                user_id: true,
                email: true,
                username: true,
            },
            where: {
                user_id: userId
            }

        });

        if (!user) {
            return res.status(404).json({ message: "Felhasználó nem található!" });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Hiba történt a profil lekérdezése során!", error: error.message });
    }
}

module.exports = {
    register,
    login,
    getAllUser,
    getAllUserTermek,
    userProfil
}