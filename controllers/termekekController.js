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
                
                // Check if image is too large (e.g., > 20MB)
                if (rawBuffer.length > 20 * 1024 * 1024) {
                    // Get image format
                    const metadata = await sharp(rawBuffer).metadata();
                    const format = metadata.format;

                    // Handle different image formats
                    switch (format) {
                        case 'jpeg':
                        case 'jpg':
                            imageBuffer = await sharp(rawBuffer)
                                .jpeg({ quality: 100 })
                                .toBuffer();
                            break;
                        case 'png':
                            imageBuffer = await sharp(rawBuffer)
                                .png({ quality: 100 })
                                .toBuffer();
                            break;
                        case 'svg':
                            // For SVG, we'll convert it to PNG since SVG is vector-based
                            imageBuffer = await sharp(rawBuffer)
                                .png({ quality: 100 })
                                .toBuffer();
                            break;
                        default:
                            // For any other format, convert to JPEG
                            imageBuffer = await sharp(rawBuffer)
                                .jpeg({ quality: 100 })
                                .toBuffer();
                    }
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