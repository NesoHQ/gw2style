// pages/api/posts.js
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

    // Forward query parameters (page, limit, etc.)
    const queryParams = new URLSearchParams(req.query).toString();
    const url = `${apiUrl}/api/v1/posts${queryParams ? `?${queryParams}` : ''}`;

    // Call the backend API
    const response = await fetch(url);
    const text = await response.text(); // Get raw response text
    //console.log('Backend response:', text); // Log the raw response

    let posts;
    try {
      posts = JSON.parse(text);
    } catch (parseError) {
      console.error('Failed to parse JSON:', parseError);
      return res.status(500).json({
        success: false,
        error: 'Invalid JSON response from backend',
        debug: text.slice(0, 100), // First 100 chars of response for debugging
      });
    }

    // Since the backend already returns { success: true, data: [...] }
    // We need to pass it through as is
    if (posts && typeof posts === 'object') {
      return res.status(200).json(posts);
    }

    // If we don't get the expected structure, wrap it in our standard format
    return res.status(200).json({
      success: true,
      data: Array.isArray(posts) ? posts : [],
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch posts',
    });
  }
}
