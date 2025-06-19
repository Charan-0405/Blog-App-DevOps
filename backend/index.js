// backend/index.js
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = 5000;
const MONGO_URI = "mongodb+srv://charanmoigari2000:Cherry0405@cluster0.mteyjhg.mongodb.net/"

app.use(express.json());

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.log("❌ Mongo Error:", err));

app.get('/', (req, res) => {
  res.send('🚀 Blog Backend is working!');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
