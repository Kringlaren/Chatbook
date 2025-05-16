import rateLimit from "express-rate-limit";

// En kontroll från express-rate-limit om man gör för många inloggningsförsök, max 10 försök varje 5 minuter
export const loginRateLimit = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minuter
    max: 10, // Max 10 försök innan man stoppas
    message: { message: "För många inloggningsförsök. Försök igen om en stund" },
    keyGenerator: (req) => `${req.ip}_${req.body.username || ''}`, // Begränsar inloggningsförsök även från samma IP
});