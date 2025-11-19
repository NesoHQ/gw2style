// API proxy for fetching user's liked posts
export default async function handler(req, res) {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Forward the request to backend
    const response = await fetch(`${backendUrl}/api/v1/user/liked-posts`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Forward cookies for JWT authentication
        'Cookie': req.headers.cookie || '',
      },
    });

    const data = await response.json();

    // Return the response
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Error fetching liked posts:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch liked posts',
    });
  }
}
