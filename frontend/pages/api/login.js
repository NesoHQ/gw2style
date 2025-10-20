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

    // Read token as text
    let token = await backendRes.text();
    token = token.trim();

    // Remove quotes if present
    if (token.startsWith('"') && token.endsWith('"')) {
      token = token.slice(1, -1);
    }

    console.log('Clean token:', token);

    const cookieOptions = {
      httpOnly: true,
      secure:  process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    };

    // Set HttpOnly cookie
    res.setHeader(
      'Set-Cookie',
      cookie.serialize('token', token, cookieOptions)
    );

    // Decode token here and return user info to frontend
    const decoded = jwt.decode(token);

    if (!decoded) {
      return res.status(500).json({ error: 'Failed to decode JWT' });
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
