const jwt = require('jsonwebtoken')
const argon2 = require('argon2');
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient()

const generateToken = (id) => {
    return jwt.sign({id}, "szupertitkostitok", {expiresIn: "1d"});
}

const register = async (req, res) => {
    const {email, username, password} = req.body

    // adat validáció
    if(!email || !username || !password){
        return res.json({message: "Hiányos adatok!"});
    }

    const user = await prisma.user.findFirst({
        where: {
            email: email
        }
    });

    if(user){
        return res.json({message: "Email-cím már használatban!"});
    }

    // password hash --> titkosítjuk a jelszót
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
        newUser
    });
}

const login = async (req, res) => {
    const {email, password} = req.body
    // procedurális email validálás
    if(!email || !password){
        return res.json({
            message: "Hiányzó adatok!"
        });
    }
    const user = await prisma.user.findFirst({
        where: {
            email: email
        }
    });


    //if(!user) return res.json({message: "Nem létező fiók!"});

    if(!user){
        return res.json({
            message: "Nem létező fiók!"
        });
    }


    //passMatch ? res.json({message: "Sikeres bejelentkezés!"}): res.json({message: "Helytelen jelszó!"})
    const passMatch = await argon2.verify(user.password, password);

    if(passMatch){
        // token --> hitelesítő eszköz --> kulcs
        const token = generateToken(user.id)
        return res.json({
            message: "Sikeres bejelentkezés!",
            username: user.username,
            token
        })
    } else {
        return res.json({
            message: "Helytelen jelszó!"
        });
    }
}

const getAllUser = async (req, res) => {
    const users = await prisma.user.findMany();
    res.json(users)
}

const getAllUserTermek = async (req, res) => {
    const usertermekek = await prisma.user.findMany();
    res.json(users)
}

module.exports = {
    register,
    login,
    getAllUser,
    getAllUserTermek
}