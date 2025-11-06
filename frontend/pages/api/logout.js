import { serialize } from 'cookie';

export default function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Clear both token and jwt cookies by setting them to expire in the past
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: new Date(0), // Set expiration to the past
  };

  const cookies = [
    serialize('token', '', cookieOptions),
    serialize('jwt', '', cookieOptions),
  ];

  res.setHeader('Set-Cookie', cookies);

  return res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
}
