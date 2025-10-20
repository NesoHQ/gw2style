import { serialize } from 'cookie';

export default function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Clear the token cookie by setting it to expire in the past
  const cookie = serialize('token', '', {
    httpOnly: true,
    secure: 'production',
    sameSite: 'lax',
    path: '/',
    expires: new Date(0), // Set expiration to the past
  });

  res.setHeader('Set-Cookie', cookie);

  return res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
}
