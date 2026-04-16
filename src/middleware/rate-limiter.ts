import rateLimit from "express-rate-limit";

const rateLimiter = rateLimit({
  windowMs: 2 * 60 * 1000,
  max: 45,
  message: {
    success: false,
    message: "Too many requests, try again later.",
  },
});

export default rateLimiter;
