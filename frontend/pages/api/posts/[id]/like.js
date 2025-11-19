// API proxy for like/unlike operations
export default async function handler(req, res) {
  const { id } = req.query;
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';

  try {
    // Forward the request to backend
    const response = await fetch(`${backendUrl}/api/v1/posts/${id}/like`, {
      method: req.method,
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
    console.error('Error proxying like request:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process like request',
    });
  }
}
