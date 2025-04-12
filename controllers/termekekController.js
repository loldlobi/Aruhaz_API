const { PrismaClient } = require("@prisma/client");
const sharp = require('sharp');
const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
    errorFormat: 'pretty'
});

const allTermek = async (req, res) => {
    try {
        const termekek = await prisma.termekek.findMany({
            select: {
                termekek_id: true,
                cim: true,
                description: true,
                ar: true
            }
        });
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
    try {
        console.log("Request body:", req.body);

        const { cim, description, ar, image } = req.body;

        // adat validáció
        if (!cim || !description || !ar) {
            return res.status(400).json({ 
                message: "Hiányos adatok!",
                missing: {
                    cim: !cim,
                    description: !description,
                    ar: !ar
                }
            });
        }

        // Convert base64 to buffer if image exists
        let imageBuffer = null;
        if (image) {
            try {
                // Remove the data URL prefix if present
                const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
                const rawBuffer = Buffer.from(base64Data, 'base64');
                
                // Check if image is too large (e.g., > 15MB)
                if (rawBuffer.length > 15 * 1024 * 1024) {
                    // Compress the image without resizing
                    imageBuffer = await sharp(rawBuffer)
                        .jpeg({ quality: 100 }) // Convert to JPEG with 100% quality
                        .toBuffer();
                } else {
                    imageBuffer = rawBuffer;
                }
            } catch (error) {
                console.error("Hiba a kép konvertálása során:", error);
                return res.status(400).json({
                    message: "Érvénytelen kép formátum!",
                    error: error.message
                });
            }
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
            newTermek: {
                termekek_id: newTermek.termekek_id,
                cim: newTermek.cim,
                description: newTermek.description,
                ar: newTermek.ar,
                hasImage: !!imageBuffer
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