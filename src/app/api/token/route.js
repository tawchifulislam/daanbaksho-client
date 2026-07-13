import { auth } from '@/lib/auth';
import jwt from 'jsonwebtoken';
import { headers } from 'next/headers';

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.email) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const token = jwt.sign(
    { email: session.user.email },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '7d' },
  );

  return Response.json({ token });
}
