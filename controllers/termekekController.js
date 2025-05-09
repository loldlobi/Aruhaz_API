const { PrismaClient } = require("@prisma/client");
const { response } = require("express");
const fs = require('fs');
const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
    errorFormat: 'pretty'
});

const allTermek = async (req, res) => {
    try {
        const termekek = await prisma.termekek.findMany();
        res.json(termekek)
    } catch (error) {
        console.error("Hiba a termékek lekérdezése során:", error);
        res.status(500).json({
            message: "Hiba történt a termékek lekérdezése során!",
            error: error.message
        });
    }
}

const termekRegister = async (req, res) => {
    // console.log("Request body file:", req.file);
    // console.log("Request body:", req.body);

    try {
        const image = req.file;
        const { cim, description, ar } = req.body;

        // adat validáció
        if (!cim || !description || !ar || !image) {
            return res.status(400).json({
                message: "Hiányos adatok!",
                missing: {
                    cim: !cim,
                    description: !description,
                    ar: !ar,
                    image: !image
                }
            });
        }
        console.log(req.user)
        const newTermek = await prisma.termekek.create({
            data: {
                cim: cim,
                description: description,
                ar: parseInt(ar),
                kep: image.path,
                user_id: req.user.user_id
            }
        });

        res.json({
            message: "Sikeres termék regisztráció!",
            newTermek: {
                termekek_id: newTermek.termekek_id,
                cim: newTermek.cim,
                description: newTermek.description,
                ar: newTermek.ar,
                image: newTermek.kep
            }
        });
    } catch (error) {
        console.error("Hiba a termék regisztrációja során:", error);

        // Handle specific Prisma errors
        if (error.code === 'P1017') {
            return res.status(503).json({
                message: "Adatbázis kapcsolati hiba! Kérjük, próbálja újra később.",
                error: "Database connection error"
            });
        }

        res.status(500).json({
            message: "Hiba történt a termék regisztrációja során!",
            error: error.message,
            code: error.code
        });
    }
}

const anTermekSelect = async (req, res) => {
    try {
        const terekId = Number(req.params.id);
        const temek = await prisma.termekek.findUnique({
            select: {
                termekek_id: true,
                kep: true,
                cim: true,
                description: true,
                ar: true,
            },
            where: {
                termekek_id: terekId
            }

        });

        if (!temek) {
            return res.status(404).json({ message: "Termék nem található!" });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Hiba történt a termék lekérdezése során!", error: error.message });
    }
}

// const allTermek = async (req, res) => {
//     const temek = await prisma.termekek.findMany();
//     res.json(temek);
// }

const termekDelete = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!id)
            return res.status(406).json({ message: "Hiányzó adatok!" });

        const getToBeDeletedProduct = await prisma.termekek.findFirst({
            where: {
                termekek_id: id
            }
        });
        if (getToBeDeletedProduct.user_id != req.user.user_id) {
            return res.status(403).json({ message: "Nem te vagy a user aki ezt feltöltötte!" })
        }
        // Törlés végrehajtása
        // Törlés végrehajtása
        const deletedProduct = await prisma.termekek.delete({
            where: { termekek_id: id }
        });

        fs.unlink(deletedProduct.kep, (err) => {
            if (!err) {
                return res.json({
                    message: "sikeres tőrlés"
                });
            }
            else {
                return res.status(404).json({
                    message: "sikertelen törlés",
                    errmessage: err.message
                });
            }
        })
    } catch (error) {
        console.error("Törlési hiba:", error);
        res.status(500).json({
            success: false,
            error: "Szerverhiba",
            details: error.message
        });
    }
}

const termekUpdate = async (req, res) => {
    try {
        const id = Number(req.params.id);

        const image = req.file;
        const { cim, description, ar } = req.body;

        // adat validáció
        if (!cim || !description || !ar || !image) {
            return res.status(400).json({
                message: "Hiányos adatok!",
                missing: {
                    cim: !cim,
                    description: !description,
                    ar: !ar,
                    image: !image
                }
            });
        }

        if (!id)
            return res.status(406).json({ message: "Hiányzó adatok!" });

        const getToBeUpdatedProduct = await prisma.termekek.findFirst({
            where: {
                termekek_id: id
            }
        });
        
        if (getToBeUpdatedProduct.user_id != req.user.user_id) {
            return res.status(403).json({ message: "nem te vagy a felhasználó aki ezt feltöltötte???!!!!" })
        }
        // Törlés végrehajtása
        // Törlés végrehajtása
        fs.unlink(getToBeUpdatedProduct.kep, async (err) => {
            if (!err) {
                const updatedProduct = await prisma.termekek.update({
                    where: { termekek_id: id },
                    data: {
                        cim: cim,
                        ar: parseInt(ar),
                        description: description,
                        kep: image.path
                    }
                });

                return res.json({
                    message: "sikeres módosítás"
                });
            }
            else {
                return res.status(404).json({
                    message: "sikertelen törlés",
                    errmessage: err.message
                });
            }
        })
    } catch (error) {
        console.error("Módosítási hiba:", error);
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
    anTermekSelect,
    termekUpdate
}