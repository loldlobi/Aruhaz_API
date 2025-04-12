const { PrismaClient } = require("@prisma/client");
const multer = require('multer');

// Create a single Prisma client instance
const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
    errorFormat: 'pretty'
});

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 15 * 1024 * 1024 // 15MB limit
    }
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
    let prismaClient;
    try {
        console.log("Request body:", req.body);
        console.log("Request files:", req.files);

        const { cim, description, ar } = req.body;
        const imageBuffer = req.files && req.files[0] ? req.files[0].buffer : null;

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

        // Create a new Prisma client for this request
        prismaClient = new PrismaClient();
        await prismaClient.$connect();

        const newTermek = await prismaClient.termekek.create({
            data: {
                cim: cim,
                description: description,
                ar: parseInt(ar),
                kep: imageBuffer ? Buffer.from(imageBuffer) : null
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
    } finally {
        // Always disconnect the Prisma client
        if (prismaClient) {
            await prismaClient.$disconnect().catch(console.error);
        }
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