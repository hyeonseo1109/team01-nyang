import { api } from './client';

export async function fetchNews(category) {
  const res = await api.get('/news', { params: { category } });
  return res.data?.data ?? [];
}
