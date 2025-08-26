import cors from "cors";
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import productRoutes from './routes/productRoutes.js';
import { sql } from "./config/db.js";
import { aj } from "./lib/arcjet.js";



dotenv.config();
const app = express();
const PORT = process.env.PORT ;
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());


//apply arcjet rate limit to all routes

app.use(async (req, res, next) => {
  try {
    const decision = await aj.protect(req, {
      requested: 1, // specifies that each request consumes 1 token
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        res.status(429).json({ error: "Too Many Requests" });
      } else if (decision.reason.isBot()) {
        res.status(403).json({ error: "Bot access denied" });
      } else {
        res.status(403).json({ error: "Forbidden" });
      }
      return;
    }

    // check for spoofed bots
    if (decision.results.some((result) => result.reason.isBot() && result.reason.isSpoofed())) {
      res.status(403).json({ error: "Spoofed bot detected" });
      return;
    }

    next();
  } catch (error) {
    console.log("Arcjet error", error);
    next(error);
  }
});

app.use('/api/products', productRoutes);

async function initDB() {
  try {
    // Simulate database connection initialization
    await sql `
    CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name  VARCHAR(100) NOT NULL,
    image VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )


    `;

  }
  catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
  
}

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
