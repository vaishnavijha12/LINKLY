import { nanoid } from 'nanoid';
import ShortUrl from '../models/shorturl.model.js';

const checkUrlReachability = async (url) => {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

        const response = await fetch(url, {
            method: 'HEAD', // Use HEAD to be faster/lighter
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        // If we get a response, even 403 or 401, the site exists. 
        // 404 means the specific page doesn't exist, which might be bad for a shortener.
        // Let's allow everything except strictly failed connections (caught below).
        // Optionally, we could block 404s. Let's allow 404s for now as user might want to shorten a future link, 
        // BUT user said "Reject URLs that fail DNS resolution or connection".
        // So just the try/catch block handles the "connection/DNS" part.

        return true;
    } catch (error) {
        if (error.name === 'AbortError') {
            console.error("URL Validation Timeout:", url);
            return false;
        }
        console.error("URL Validation Failed:", error.message);
        return false;
    }
};

export const createShortUrl = async (req, res) => {
    try {
        const { originalUrl, customAlias, tags } = req.body;

        // 1. Basic format validation (in case frontend is bypassed)
        try {
            const urlObj = new URL(originalUrl);
            if (!['http:', 'https:'].includes(urlObj.protocol)) {
                return res.status(400).json({ message: "URL must start with http:// or https://" });
            }
        } catch (e) {
            return res.status(400).json({ message: "Invalid URL format" });
        }

        // 2. Reachability Check
        const isReachable = await checkUrlReachability(originalUrl);
        if (!isReachable) {
            return res.status(400).json({
                message: "URL is not reachable. Please check the link and try again."
            });
        }

        // Check if user is logged in (from verifyToken middleware if applied, or optional)
        const userId = req.user ? req.user.id : null;

        let shortUrl;

        if (customAlias) {
            // Check if custom alias already exists
            const existing = await ShortUrl.findOne({ shortUrl: customAlias });
            if (existing) {
                return res.status(400).json({ message: "Alias already in use" });
            }
            shortUrl = customAlias;
        } else {
            shortUrl = nanoid(8);
        }

        const url = await ShortUrl.create({
            originalUrl,
            shortUrl,
            user: userId,
            tags: tags || []
        });

        res.status(201).json(url);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

export const getUserUrls = async (req, res) => {
    try {
        if (!req.user) return res.status(401).json({ message: "Unauthorized" });
        const urls = await ShortUrl.find({ user: req.user.id });
        res.status(200).json(urls);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

export const deleteShortUrl = async (req, res) => {
    try {
        const { id } = req.params;
        const url = await ShortUrl.findById(id);

        if (!url) {
            return res.status(404).json({ message: "URL not found" });
        }

        if (url.user && url.user.toString() !== req.user.id) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        await ShortUrl.findByIdAndDelete(id);
        res.status(200).json({ message: "URL deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

export const updateShortUrl = async (req, res) => {
    try {
        const { id } = req.params;
        const { originalUrl, tags } = req.body;

        const url = await ShortUrl.findById(id);

        if (!url) {
            return res.status(404).json({ message: "URL not found" });
        }

        if (url.user && url.user.toString() !== req.user.id) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (originalUrl) url.originalUrl = originalUrl;
        if (tags) url.tags = tags;
        if (typeof req.body.isActive !== 'undefined') url.isActive = req.body.isActive;
        if (req.body.redirectType) url.redirectType = req.body.redirectType;

        await url.save();
        res.status(200).json(url);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};
