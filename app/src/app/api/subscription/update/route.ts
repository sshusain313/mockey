import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { updateUserSubscription } from '@/lib/downloadService';

export async function POST(req: NextRequest) {
  try {
    // Get the current user session
    const session = await getServerSession();
    
    // If no user is logged in, they can't update subscription
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }
    
    // Get the subscription type from the request body
    const { subscriptionType } = await req.json();
    
    // Validate subscription type
    if (!subscriptionType || !['free', 'pro', 'lifetime'].includes(subscriptionType)) {
      return NextResponse.json(
        { error: 'Invalid subscription type' },
        { status: 400 }
      );
    }
    
    // Update the user's subscription
    const result = await updateUserSubscription(
      session.user.email,
      subscriptionType as 'free' | 'pro' | 'lifetime'
    );
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating subscription:', error);
    return NextResponse.json(
      { error: 'An error occurred while updating subscription' },
      { status: 500 }
    );
  }
}
