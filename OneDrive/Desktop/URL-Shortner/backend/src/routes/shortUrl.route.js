import express from 'express';
import { createShortUrl, getUserUrls, deleteShortUrl, updateShortUrl } from '../controller/shortUrl.controller.js';
import { verifyToken } from '../utils/verifyToken.js';
import { checkAuth } from '../utils/checkAuth.js';

const router = express.Router();

router.post("/", checkAuth, createShortUrl);
router.get("/my-urls", verifyToken, getUserUrls);
router.delete("/:id", verifyToken, deleteShortUrl);
router.patch("/:id", verifyToken, updateShortUrl);

export default router;
