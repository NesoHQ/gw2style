// pages/api/search.js
export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader(
    'Access-Control-Allow-Origin',
    process.env.NEXT_PUBLIC_FRONTEND_URL || '*'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get the API URL from environment variable
    const apiUrl = 'http://localhost:8080';
    const { q, tag, author, limit, page } = req.query;

    // Build search URL
    const searchParams = new URLSearchParams();
    if (q) searchParams.append('q', q);
    if (tag) searchParams.append('tag', tag);
    if (author) searchParams.append('author', author);
    if (limit) searchParams.append('limit', limit);
    if (page) searchParams.append('page', page);

    // Call the backend API
    const response = await fetch(
      `${apiUrl}/api/v1/posts/search?${searchParams}`
    );

    // Get the raw text first
    const text = await response.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      console.error('Failed to parse JSON:', parseError);
      return res.status(500).json({
        success: false,
        error: 'Invalid JSON response from backend',
        debug: text.slice(0, 100), // First 100 chars of response for debugging
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Error searching posts:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to search posts',
    });
  }
}
