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
// restaurant.js//
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    customerName: {
        type: String,
        required: true
    },
    tableNumber: {
        type: Number,
        required: true
    },
    items: {
        type: [String],
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["Pending", "Preparing", "Served"],
        default: "Pending"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Order", orderSchema);
//restaurantroutes.js//
const express = require("express");
const router = express.Router();
const Order = require("../models/restaurant");

// ✅ CREATE ORDER
router.post("/orders", async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ✅ GET ALL ORDERS
router.get("/orders", async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ✅ GET SINGLE ORDER
router.get("/orders/:id", async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: "Order not found" });
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ✅ UPDATE ORDER
router.put("/orders/:id", async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ✅ DELETE ORDER
router.delete("/orders/:id", async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.json({ message: "Order deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
