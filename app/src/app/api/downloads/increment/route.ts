import { NextRequest, NextResponse } from 'next/server';
import { incrementDownloadCount } from '@/lib/downloadService';

export async function POST(req: NextRequest) {
  try {
    console.log('Incrementing download count...');
    const result = await incrementDownloadCount();
    console.log('Increment result:', result);
    
    if (!result.success) {
      console.log('Increment failed:', result.message);
      return NextResponse.json(
        { error: result.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error incrementing download count:', error);
    return NextResponse.json(
      { 
        error: 'An error occurred while incrementing download count',
        message: error instanceof Error ? error.message : 'Unknown error',
        success: false 
      },
      { status: 500 }
    );
  }
}
