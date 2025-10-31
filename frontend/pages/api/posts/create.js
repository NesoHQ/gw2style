import * as cookie from 'cookie';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Log the incoming request data
    console.log('Request body:', req.body);
    console.log('Request cookies:', req.headers.cookie);

    // Parse the token from the cookie
    const cookies = req.headers.cookie ? cookie.parse(req.headers.cookie) : {};
    const token = cookies.token;

    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const response = await fetch('http://localhost:8080/api/v1/posts/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Send token as JWT cookie
        Cookie: `jwt=${token}`,
      },
      body: JSON.stringify(req.body),
      credentials: 'include',
    });

    // Log the raw response for debugging
    console.log('Backend response status:', response.status);
    console.log('Backend response headers:', response.headers);

    let data;
    try {
      // Read the response body once and store it
      data = await response.json();
      console.log('Backend response data:', data);

      if (!response.ok) {
        // Log more details about the error
        console.error('Backend error:', {
          status: response.status,
          data: data,
          url: response.url,
        });
        return res.status(response.status).json({
          error:
            data.error ||
            data.message ||
            `Failed to create post: ${response.status}`,
        });
      }

      // Log successful response
      console.log('Successfully created post:', data);
      return res.status(200).json({
        success: true,
        ...data,
      });
    } catch (parseError) {
      console.error('Error parsing response:', parseError);
      return res.status(500).json({
        error: 'Failed to parse server response',
        details: parseError.message,
      });
    }
  } catch (error) {
    // Enhanced error logging
    console.error('Error creating post:', {
      error: error.message,
      stack: error.stack,
      requestBody: req.body,
      cookies: req.headers.cookie ? 'Present' : 'Missing',
    });

    // Send a more detailed error response
    res.status(500).json({
      error: error.message,
      details:
        'Server error while creating post. Check server logs for more details.',
    });
  }
}
