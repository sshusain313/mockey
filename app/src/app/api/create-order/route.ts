import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

// Helper function to get Razorpay credentials based on environment
function getRazorpayCredentials() {
  // Check if we're in test mode
  const isTestMode = process.env.RAZORPAY_ENV === 'test' || true; // Default to test mode for safety
  
  // Use hardcoded test credentials for now
  return {
    key_id: 'rzp_test_uEEEREXlcrVyzx',
    key_secret: 'C8ol7Ovs9NhoGjkmpjwGgOaM',
    isTestMode,
  };
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { amount, currency = 'INR', receipt, notes } = body;

    if (!amount) {
      return NextResponse.json(
        { error: 'Amount is required' },
        { status: 400 }
      );
    }

    // Validate amount (must be a number and greater than 0)
    const parsedAmount = Number(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    // Get Razorpay credentials based on environment
    const { key_id, key_secret, isTestMode } = getRazorpayCredentials();

    // Log for debugging
    console.log(`Using Razorpay in ${isTestMode ? 'TEST' : 'PRODUCTION'} mode with key: ${key_id?.substring(0, 8)}...`);

    // Initialize Razorpay instance
    const razorpay = new Razorpay({
      key_id: key_id as string,
      key_secret: key_secret as string,
    });

    // Create order
    const order = await razorpay.orders.create({
      amount: parsedAmount,
      currency,
      receipt,
      notes: {
        ...notes,
        isTestMode: isTestMode ? 'true' : 'false',
      },
    });

    // Return order details and key_id for the client
    return NextResponse.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      key_id: key_id,
    });
  } catch (error: any) {
    console.error('Error creating Razorpay order:', error);

    // Handle specific Razorpay errors
    if (error.statusCode) {
      return NextResponse.json(
        { error: error.error.description || 'Razorpay error' },
        { status: error.statusCode }
      );
    }

    // Handle general errors
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
