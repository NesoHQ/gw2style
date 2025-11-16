// pages/api/posts/search.js
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
    // Get the backend API URL from environment variable
    const apiUrl = process.env.BACKEND_API_URL || 'http://localhost:3000';

    // Forward all query parameters (tags, q, author, page, limit, etc.)
    const queryParams = new URLSearchParams(req.query).toString();
    const url = `${apiUrl}/api/v1/posts/search${queryParams ? `?${queryParams}` : ''}`;

    console.log('Calling backend:', url);

    // Call the backend API
    const response = await fetch(url);
    const text = await response.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      console.error('Failed to parse JSON:', parseError);
      console.error('Response text:', text.slice(0, 200));
      return res.status(500).json({
        success: false,
        error: 'Invalid JSON response from backend',
        debug: text.slice(0, 100),
      });
    }

    // Return the backend response as-is (it already has the correct format)
    return res.status(response.ok ? 200 : response.status).json(data);
  } catch (error) {
    console.error('Error searching posts:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to search posts',
      message: error.message,
    });
  }
}
