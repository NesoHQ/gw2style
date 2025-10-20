// pages/api/me.js
import { parse } from 'cookie';
import jwt from 'jsonwebtoken';

export default function handler(req, res) {
  // Add CORS headers for development, should be configured per environment
  const isDev = process.env.NODE_ENV === 'development';
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader(
    'Access-Control-Allow-Origin', '*'
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

  // If no cookie header, return unauthorized
  if (!req.headers.cookie) {
    return res.status(401).json({
      success: false,
      error: 'Not logged in',
    });
  }

  try {
    const cookies = parse(req.headers.cookie);
    const token = cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Not logged in',
      });
    }

    const decoded = jwt.decode(token);

    if (!decoded || !decoded.sub || !decoded.username) {
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
    console.error('Error validating token:', err);
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired token',
    });
  }
}
