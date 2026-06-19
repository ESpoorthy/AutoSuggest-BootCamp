const express = require("express");

const app = express();

app.use(express.static("frontend"));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/frontend/index.html");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});