// pages/api/me.js
import cookie from 'cookie';
import jwt from 'jsonwebtoken';

export default function handler(req, res) {
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

  const cookies = cookie.parse(req.headers.cookie || '');
  const token = cookies.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Not logged in',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');

    if (!decoded.sub || !decoded.username) {
      throw new Error('Invalid token payload');
    }

    return res.status(200).json({
      success: true,
      data: {
        id: decoded.sub,
        username: decoded.username,
      },
    });
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired token',
    });
  }
}
