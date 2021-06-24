const express = require("express");
const apiRoutes = require("./routes/api-routes");
const htmlRoutes = require("./routes/html-routes");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use ("/api", apiRoutes);
app.use("/", htmlRoutes);


app.listen(PORT, () => console.log("App listening on PORT" + PORT));