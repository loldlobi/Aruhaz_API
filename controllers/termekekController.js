const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient()

const allTermek = async (req, res) => {
    const termekek = await prisma.termekek.findMany();
    res.json(termekek)
}

const termekRegister = async (req, res) => {
    const { cim, description, ar } = req.body

    // adat validáció
    if (!cim || !description || !ar) {
        return res.json({ message: "Hiányos adatok!" });
    }



    const newTermek = await prisma.termekek.create({
        data: {
            cim: cim,
            description: description,
            ar: ar
        }
    });

    res.json({
        message: "Sikeres termék regisztráció!",
        newTermek
    });
}
const termekDelete = async (req, res) => {
    try {
        const id = Number(req.params.id);

        const deletedProduct = await prisma.termekek.delete({
            where: { termekek_id: id }
        });

        res.json({
            message: "sikeres termék törlés"
        });

    } catch (error) {
        console.error("Törlési hiba:", error);
        res.status(500).json({
            message: error.message
        });
    }
}

const Termek = async (req, res) => {
    const termekek_id = Number(req.params.id)
    const termekek = await prisma.termekek.findUnique({
        where: {
            termekek_id: termekek_id
        }
    });
    res.json(termekek)
}

module.exports = {
    allTermek,
    termekRegister,
    termekDelete,
    Termek

}