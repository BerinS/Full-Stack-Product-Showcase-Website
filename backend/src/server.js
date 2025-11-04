import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";

import { connectDB } from "./config/db.js";
import productsRoutes from "./routes/productsRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import rateLimiter from "./middleware/rateLimitter.js";
import htmlRedirect from "./middleware/htmlRedirect.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

// middeware
app.use(express.json());
//app.use(rateLimiter);

// User this cors policy in development only
if (process.env.NODE_ENV === 'development'){
  app.use(cors({
      origin: 'http://localhost'
    })
  );  
}

// Rate limitter for API routes
app.use("/api/", rateLimiter);

app.use((req, res, next) => {
   console.log(`Req method is ${req.method} & Req URL is ${req.url}`);
   next();
 });

app.use("/api/products", productsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Serve frontend static files in production
if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '../frontend');

  app.use(htmlRedirect);

  // Serve static files
  app.use(express.static(frontendPath));

  const pages = ['/', '/contact', '/robusto', '/intenso', '/espresso', '/detergent', '/shine', '/sign_in', '/dashboard']

  // Redirect subfolder to clean singular /dashboard
  app.get('/dashboard/dashboard', (req, res) => {
    res.redirect(301, '/dashboard');
  });


  pages.forEach((page) => {
    let file;

    if (page === '/') {
      file = 'index.html';
    } 
    else if (page === '/dashboard') {
      file = path.join('dashboard', 'dashboard.html');
    }
    else {
      file = page.substring(1) + '.html';
    }

    app.get(page, (req, res) => {
      res.sendFile(path.join(frontendPath, file));
    });
  });
}

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, '../frontend/404.html'));
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server started on PORT:", PORT);
  });
});



