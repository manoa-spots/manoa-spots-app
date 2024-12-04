import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions'; // Your auth options
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Get the session data using getServerSession
  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  const userEmail = session.user.email;

  if (!userEmail) {
    return res.status(400).json({ message: 'Email is required' });
  }

  const profile = await prisma.profile.findUnique({
    where: { email: userEmail },
  });

  if (!profile) {
    return res.status(404).json({ message: 'Profile not found' });
  }

  return res.status(200).json(profile);
}
