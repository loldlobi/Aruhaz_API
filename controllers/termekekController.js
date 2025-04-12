const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient()
const multer = require('multer');

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const allTermek = async (req, res) => {
    const termekek = await prisma.termekek.findMany();
    res.json(termekek)
}

const termekRegister = async (req, res) => {
    try {
        const { cim, description, ar } = req.body;
        const imageBuffer = req.file ? req.file.buffer : null;

        // adat validáció
        if (!cim || !description || !ar) {
            return res.json({ message: "Hiányos adatok!" });
        }

        const newTermek = await prisma.termekek.create({
            data: {
                cim: cim,
                description: description,
                ar: parseInt(ar),
                kep: imageBuffer
            }
        });

        res.json({
            message: "Sikeres termék regisztráció!",
            newTermek
        });
    } catch (error) {
        console.error("Hiba a termék regisztrációja során:", error);
        res.status(500).json({
            message: "Hiba történt a termék regisztrációja során!",
            error: error.message
        });
    }
}

const termekDelete = async (req, res) => {
    try {
        const id = Number(req.params.id);

        // Törlés végrehajtása
        const deletedProduct = await prisma.termekek.delete({
            where: { termekek_id: id }
        });

        res.json({
            message: "sikeres termék törlés"
        });

    } catch (error) {
        console.error("Törlési hiba:", error);
        res.status(500).json({
            success: false,
            error: "Szerverhiba",
            details: error.message
        });
    }
}

module.exports = {
    allTermek,
    termekRegister,
    termekDelete,

}