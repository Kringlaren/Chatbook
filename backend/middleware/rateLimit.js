import rateLimit from "express-rate-limit";
import codes from "../httpCodes.js";

// En kontroll från express-rate-limit om man gör för många inloggningsförsök, max 10 försök varje 5 minuter
export const loginRateLimit = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 10,
    message: { message: "För många inloggningsförsök. Försök igen om en stund" }, // Fallback
    keyGenerator: (req) => `${req.ip}_${req.body.username || ''}`, // Begränsar inloggningsförsök även från samma IP
});