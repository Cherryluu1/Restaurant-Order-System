const express = require("express");
const mongoose = require("mongoose");

const app = express();

// ✅ Middleware
app.use(express.json());

// ✅ MongoDB Connection (FIXED - no deprecated options)
mongoose.connect("mongodb://127.0.0.1:27017/restaurantDB")
.then(() => {
    console.log("✅ MongoDB Connected");
})
.catch((err) => {
    console.log("❌ MongoDB Connection Error:", err);
});

// ✅ Routes Import
const restaurantRoutes = require("./routes/restaurantroutes");

// ✅ Use Routes
app.use("/api", restaurantRoutes);

// ✅ Default Route (Check API)
app.get("/", (req, res) => {
    res.send("🍽️ Restaurant Backend API is Running...");
});

// ✅ Server Setup
const PORT = 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});