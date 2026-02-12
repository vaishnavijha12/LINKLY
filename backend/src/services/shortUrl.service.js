import { generateNanoId } from "../utils/helper.js";
import ShortUrl from "../models/shorturl.model.js";

export const createshortUrlService = async (url) => {
    const shortUrl = generateNanoId(7);
    
    return shortUrl;
};