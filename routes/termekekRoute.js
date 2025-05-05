const express = require('express');
const router = express.Router();
const { protect } = require('../mwares/authMiddleware');

// Használjuk a 'multer' csomagot, ami tud kezelni 'multipart/form-data' tipusú body kéréseket.
// Ezt a fajta kérést a sima body kezeleő nem tudja feldolgozni, ezért kell a 'multer' csomag.
const multer = require("multer");

// Itt beállítjuk, hogy hova menti a bejövő fájlokat a 'multer' változó és, hogy hogyan nevezze el a fájlokat.
// Pontosabban a hely az 'uploads' mappa, a fájl neve pedig a 'mostani idő' + 'fájlnév'.
// ---------------------------------------------------------------------------------------
// 'req' = A kérés.
// 'file' = A fájl amit feltöltöttek.
// 'cb' = A visszatérő függvény, avagy 'callback'. Ezzel mondjuk meg a multer-nek a beállításokat amiket szeretnénk.
// A 'cb' függvényben az első paraméterrel hibát lehet visszaküldeni. Mivel itt nem kapunk semmiféle hibát, 'null' értéket küldünk vissza.
const storage = multer.diskStorage({
    // Mentési hely
    destination: function (req, file, cb) {
        // Visszaküldjük a visszatérő függvénnyel a helyet, amit be akarunk állítani.
        cb(null, "./uploads/");
    },
    // Fájlnév.
    // A 'new Date()' visszaadja a mostani időt.
    // A '.toISOString()' ISO formátummá alakítja a mostani időt.
    // A '.replace(/:/g, '-')' kicseréli a ':' karaktereket '-' karakterekkel, mivel a ':' helytelen fájlnév.
    // A '+ "_" +' szöveggel teszünk egy alsó vonalat a 'mostani idő' és a 'fájlnév' közé.
    filename: function (req, file, cb) {
        // Visszaküldjük a visszatérő függvénnyel a fájl nevet, amit be akarunk állítani.
        cb(null, new Date().toISOString().replace(/:/g, '-') + "_" + file.originalname);
    }
});

// 'req' = A kérés.
// 'file' = A fájl amit feltöltöttek.
// 'cb' = A visszatérő függvény, avagy 'callback'. Ezzel mondjuk meg a multer-nek a beállításokat amiket szeretnénk.
// A 'cb' függvényben az első paraméterrel hibát lehet visszaküldeni. Mivel itt nem kapunk semmiféle hibát, 'null' értéket küldünk vissza.
// A 'cb' függvényben a második paraméterrel visszaküldjük, hogy elfogadjuk a fájlt vagy sem.
const fileFilter = (req, file, cb) => {
    // Elfogad: cb(null, false);
    // Elutasít: cb(null, true);

    // Ellenőrizzük a 'mimetype' tulajdonságot, hogy kép-e.
    if (file.mimetype.startsWith("image/"))
        cb(null, true);
    else
        cb(null, false);
}

// Beállítjuk és inicializáljuk a 'multer' változót.
// A fájlok méretét lelimitáljuk 15 mb-ra.
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 15
    },
    fileFilter: fileFilter
});

// Kezeljük ha hibát kapunk a képfeltöltésnél. Egyenlőre feltételezzük, hogy túl nagy a kép.
const fileSizeLimitErrorHandler = (err, req, res, next) => {
    if (err)
        res.status(413).json({ message: "Túl nagy fájl." });
    else
        next();
}

const {
    allTermek,
    termekRegister,
    termekDelete
} = require('../controllers/termekekController');

router.get("/alltermek", allTermek);

// Lefutatjuk az 'upload' változón a 'single()' függvényt mielött tovább mennénk a 'termekRegister' függvénybe.
// Paraméternek megadtuk az 'image' szöveget, ami jelzi, hogy melyik kulcsot akarjuk használni a bejövő form adathalmazban.
// Több féle függvény van az 'upload' változóban, de a 'single()' függvény egyetlen egy bináris fájlt (képet) fog feldolgozni.
// Ezt a fájlt le is fogja menteni a megadott helyre, ebben az esetben az 'uploads' mappába amit megadtunk és a megadott nével együtt amit megadtunk.
// A 'fileSizeLimitErrorHandler' függvényt hívjuk ha hibát kapunk a képfeltöltésnél.
router.post("/createtermek", protect, upload.single('image'), fileSizeLimitErrorHandler, termekRegister);

router.delete("/delete/:id", protect, termekDelete);
//h
module.exports = router;