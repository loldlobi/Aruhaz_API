const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors())
app.use(express.json())

app.use("/userapi", require('./routes/userRoutes'));
app.use("/termekapi",require('./routes/termekekRoute'))

app.listen(8000, () => {
    console.log("Fut a szerver")
});

app.get("/", (req, res) => {
    res.json({message: "Felhasznalok projekt"});
});
