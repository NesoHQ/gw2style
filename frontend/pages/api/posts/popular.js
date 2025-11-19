export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { timeframe = 'all', limit = 100 } = req.query;

    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    const url = new URL('/api/v1/posts/popular', backendUrl);
    
    // Add query parameters
    if (timeframe) {
      url.searchParams.append('timeframe', timeframe);
    }
    if (limit) {
      url.searchParams.append('limit', limit);
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching popular posts:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch popular posts',
      message: error.message 
    });
  }
}
