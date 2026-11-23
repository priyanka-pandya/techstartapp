import type { VercelRequest, VercelResponse } from '@vercel/node';
import { fetchGeminiTechNews } from '../../server/newsService.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { status, body } = await fetchGeminiTechNews(req.query.lang);
  res.status(status).json(body);
}
