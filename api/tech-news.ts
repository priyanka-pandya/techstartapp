import type { VercelRequest, VercelResponse } from '@vercel/node';
import { fetchTechNews } from '../server/newsService.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { status, body } = await fetchTechNews(req.query.date, req.query.refresh);
  res.status(status).json(body);
}
