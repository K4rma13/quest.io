import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createProxyMiddleware } from "http-proxy-middleware";
import dotenv from "dotenv";


// Fix __dirname in ES modules / TS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({path: '.env-local'});

const app = express();
const PORT = process.env.PORT || 4173;

const BACKHOST = process.env.BACKHOST
const BACKPORT = process.env.BACKPORT

app.use(
    "/api",
    createProxyMiddleware({
        target: `http://${BACKHOST}:${BACKPORT}/api/`, // your backend server
        changeOrigin: true,
        pathRewrite: {
        '/api': '/api' 
        } 
    })
);

app.use(express.static(path.join(__dirname, "dist")));


app.get(/^\/(?!api).*$/, (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(PORT, () => {
    console.log(`React app running on http://localhost:${PORT}`);
});