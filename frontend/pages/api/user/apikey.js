// pages/api/user/apikey.js
export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get the API URL from environment variable
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

    // Get all cookies from the request
    const cookies = req.headers.cookie || '';
    
    console.log('Forwarding cookies:', cookies);

    // Forward the request to the backend with cookies
    const response = await fetch(`${apiUrl}/api/v1/user/apikey`, {
      method: 'GET',
      headers: {
        'Cookie': cookies,
        'Content-Type': 'application/json',
      },
    });

    console.log('Backend response status:', response.status);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      console.error('Backend error:', error);
      return res.status(response.status).json({ 
        error: 'Failed to fetch API key',
        details: error 
      });
    }

    const data = await response.json();
    console.log('Backend response data:', data);
    
    // Backend returns { data: { apiKey: "..." }, success: true }
    // or just { apiKey: "..." }
    const apiKey = data.data?.apiKey || data.apiKey;
    
    return res.status(200).json({ 
      api_key: apiKey,
      apiKey: apiKey 
    });
  } catch (error) {
    console.error('Error fetching API key:', error);
    return res.status(500).json({
      error: 'Failed to fetch API key',
      message: error.message,
    });
  }
}
