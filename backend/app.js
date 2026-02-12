import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { nanoid } from 'nanoid';

import connectDB from './src/config/mongoose.config.js';
import urlSchema from './src/models/shorturl.model.js';
import shortUrlRoute from './src/routes/shortUrl.route.js';
import authRoute from './src/routes/auth.route.js';


dotenv.config();

const app = express();   // ✅ app defined FIRST

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB(); // connect DB once

// Routes
app.use("/api/auth", authRoute);
app.use("/api/create", shortUrlRoute);

//redirection
app.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const url = await urlSchema.findOne({ shortUrl: id });

    if (!url) {
      return res.status(404).json({ error: "URL not found" });
    }

    if (url.isActive === false) {
      return res.status(404).json({ error: "Link is paused" });
    }

    await urlSchema.findByIdAndUpdate(url._id, { $inc: { clicks: 1 } });

    const status = parseInt(url.redirectType) || 302;
    res.redirect(status, url.originalUrl);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


//postman is used for backend testing 