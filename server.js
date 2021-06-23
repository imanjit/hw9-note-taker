const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

require("./routes/api-routes")(app);
require("./routes/html-routes")(app);

app.listen(PORT, () => console.log("App listening on PORT" + PORT));