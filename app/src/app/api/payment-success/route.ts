import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import crypto from 'crypto';

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

// Simplified version without PDF generation and email sending for now
async function logPaymentSuccess(data: any) {
  console.log('Payment successful:', data);
  return {
    success: true,
    message: 'Payment logged successfully'
  };
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { 
      paymentId, 
      orderId, 
      signature,
      planName,
      amount,
      isLifetime,
      customerName,
      customerEmail
    } = body;
    
    // Validate required fields
    if (!paymentId || !orderId || !signature) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Get Razorpay credentials based on environment
    const { key_id, key_secret, isTestMode } = getRazorpayCredentials();
    
    console.log(`Using Razorpay in ${isTestMode ? 'TEST' : 'PRODUCTION'} mode with key: ${key_id?.substring(0, 8)}...`);
    
    // Initialize Razorpay instance
    const razorpay = new Razorpay({
      key_id: key_id as string,
      key_secret: key_secret as string,
    });
    
    // Verify payment signature
    const generatedSignature = crypto
      .createHmac('sha256', key_secret as string)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');
    
    const isSignatureValid = generatedSignature === signature;
    
    if (!isSignatureValid) {
      return NextResponse.json(
        { error: 'Invalid payment signature' },
        { status: 400 }
      );
    }
    
    // Fetch payment details from Razorpay
    const payment = await razorpay.payments.fetch(paymentId);
    
    // Verify payment status
    if (payment.status !== 'captured') {
      return NextResponse.json(
        { error: 'Payment not captured' },
        { status: 400 }
      );
    }
    
    // Prepare data for logging
    const paymentData = {
      paymentId,
      orderId,
      planName,
      amount,
      isLifetime,
      customerName,
      customerEmail,
    };
    
    // Log payment success (simplified version without PDF and email)
    await logPaymentSuccess(paymentData);
    
    // Return success response
    return NextResponse.json({
      success: true,
      payment: {
        id: payment.id,
        amount: payment.amount,
        status: payment.status,
      },
    });
  } catch (error: any) {
    console.error('Error processing payment:', error);
    
    // Handle specific Razorpay errors
    if (error.statusCode) {
      return NextResponse.json(
        { error: error.error.description || 'Razorpay error' },
        { status: error.statusCode }
      );
    }
    
    // Handle general errors
    return NextResponse.json(
      { error: 'Failed to process payment' },
      { status: 500 }
    );
  }
}
