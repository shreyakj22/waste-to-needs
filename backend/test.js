import express from "express";
const app = express();
app.get("/test", (req, res) => res.send("ok"));
app.listen(5000, () => console.log("Server running on port 5000"));