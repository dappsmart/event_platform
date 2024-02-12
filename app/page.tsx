import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
 
export default function Page() {
  const { sessionClaims } = auth();
 
  const userId = sessionClaims?.userId;
 
  const primaryEmail = sessionClaims?.primaryEmail;
 
  return NextResponse.json({ userId, primaryEmail })
}