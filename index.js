const express = require("express");
const cors = require("cors");
const app = express();
//h
// Increase payload size limit
app.use(express.json());
app.use(cors());

// Az 'uploads' mappát publikussá tesszük.
// A '/uploads' szöveggel kezdjük, mert a publikus mappák a törzs-től (root-tól) kezdődnek.
// PÉLDA:
// HA app.use(express.static("uploads"));
//      'http://localhost:8000/kep.png'
// HA app.use('/uploads', express.static("uploads"));
//      'http://localhost:8000/uploads/kep.png'
app.use('/uploads', express.static("uploads"));

app.use("/userapi", require('./routes/userRoutes'));
app.use("/termekapi",require('./routes/termekekRoute'));

app.listen(8000, () => {
    console.log("Fut a szerver")
});

app.get("/", (req, res) => {
    res.json({message: "Felhasznalok projekt"});
});
