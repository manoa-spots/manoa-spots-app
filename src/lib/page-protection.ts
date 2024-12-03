// src/app/lib/page-protection.ts
import { redirect } from 'next/navigation';
import { Role } from '@prisma/client';

export type Session = {
  user: {
    email: string;
    id: string;
    role: Role;
  };
} | null;

export const loggedInProtectedPage = (session: Session) => {
  if (!session?.user) {
    redirect('/auth/signin');
  }
};

export const adminProtectedPage = (session: Session) => {
  if (!session?.user) {
    redirect('/auth/signin');
  }
  if (session.user.role !== 'ADMIN') {
    redirect('/not-authorized');
  }
};
