const express = require("express");
const cors = require("cors");
const app = express();
//h
// Increase payload size limit
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

app.use("/userapi", require('./routes/userRoutes'));
app.use("/termekapi",require('./routes/termekekRoute'))

app.listen(8000, () => {
    console.log("Fut a szerver")
});

app.get("/", (req, res) => {
    res.json({message: "Felhasznalok projekt"});
});
