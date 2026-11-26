import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { fetchGeminiTechNews, fetchTechNews } from './server/newsService';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env.local') });
dotenv.config();
const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
  const app = express();

  app.get('/api/gemini/tech-news', async (req, res) => {
    const { status, body } = await fetchGeminiTechNews(req.query.lang);
    res.status(status).json(body);
  });

  app.get('/api/tech-news', async (req, res) => {
    const { status, body } = await fetchTechNews(req.query.date, req.query.refresh);
    res.status(status).json(body);
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`TechStart India server running at http://localhost:${PORT}`);
  });
}

startServer();
