import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createProxyMiddleware } from "http-proxy-middleware";

// Fix __dirname in ES modules / TS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 4173;

app.use(
    "/api",
    createProxyMiddleware({
        target: "http://backnode:3000/api/", // your backend server
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