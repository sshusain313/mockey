import { NextRequest, NextResponse } from 'next/server';
import { checkDownloadEligibility } from '@/lib/downloadService';

export async function GET(req: NextRequest) {
  try {
    console.log('Checking download eligibility...');
    const eligibility = await checkDownloadEligibility();
    console.log('Eligibility result:', eligibility);
    
    return NextResponse.json(eligibility);
  } catch (error) {
    console.error('Error checking download eligibility:', error);
    return NextResponse.json(
      { 
        error: 'An error occurred while checking download eligibility',
        message: error instanceof Error ? error.message : 'Unknown error',
        canDownload: false,
        subscription: 'unknown',
        downloadsRemaining: 0,
        totalAllowed: 0
      },
      { status: 500 }
    );
  }
}
