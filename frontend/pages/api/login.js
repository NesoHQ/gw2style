import * as cookie from 'cookie';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'POST')
    return res.status(405).json({ error: 'Method not allowed' });

  const { apiKey } = req.body || {};
  if (!apiKey) return res.status(400).json({ error: 'apiKey is required' });

  try {
    const backendRes = await fetch('http://localhost:8080/api/v1/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey }),
    });

    // Always expect JSON response from SendJson/SendError
    const responseText = await backendRes.text();
    let responseData;

    try {
      responseData = JSON.parse(responseText);
      console.log('Parsed response:', responseData);

      if (!backendRes.ok) {
        console.log('Response not OK, status:', backendRes.status);

        // Extract the actual error message from the nested format
        let errorMessage = responseData.message;

        // If the message contains a JSON string with text field, extract it
        if (errorMessage && errorMessage.includes('text')) {
          const match = errorMessage.match(/{\s*"text":\s*"([^"]+)"/);
          if (match) {
            errorMessage = match[1];
          }
        }

        return res.status(backendRes.status).json({
          error: errorMessage || 'Login failed',
        });
      }
    } catch (parseError) {
      console.error('Failed to parse response:', parseError);
      return res.status(500).json({
        error: 'Server response was not in the expected format',
      });
    }

    try {
      responseData = JSON.parse(responseText);
    } catch (parseError) {
      // If it's not JSON, treat it as a token
      responseData = responseText.trim();
    }

    // Get the token (either from JSON response or direct text)
    const token =
      typeof responseData === 'string' ? responseData : responseData.token;

    // Clean up token if needed
    const cleanToken =
      token.startsWith('"') && token.endsWith('"') ? token.slice(1, -1) : token;

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    };

    // Set HttpOnly cookie with name 'jwt' to match backend expectation
    res.setHeader(
      'Set-Cookie',
      cookie.serialize('jwt', token, cookieOptions)
    );

    // Decode token here and return user info to frontend
    const decoded = jwt.decode(cleanToken);

    if (!decoded) {
      // If token exists but can't be decoded, it's likely malformed
      console.error('Invalid token received from backend');
      return res.status(500).json({
        error: 'The server returned an invalid authentication token',
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: decoded.sub,
        username: decoded.username,
      },
    });
  } catch (err) {
    console.error('Error proxying login:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
