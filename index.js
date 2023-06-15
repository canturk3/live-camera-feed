const express = require("express"); //Express is for building the Rest apis
const app = express();
const path = require("path");

// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// set port, listen for requests
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'public/camera.html'));
});
