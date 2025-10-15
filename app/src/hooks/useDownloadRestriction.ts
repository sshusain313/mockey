import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface DownloadEligibility {
  canDownload: boolean;
  message: string;
  subscription: string;
  downloadsRemaining: number;
  totalAllowed: number;
}

interface DownloadResult {
  success: boolean;
  message: string;
  downloadsRemaining?: number;
  totalAllowed?: number;
  downloadCount?: number;
}

export function useDownloadRestriction() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [eligibility, setEligibility] = useState<DownloadEligibility | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check if the user is eligible to download
  const checkEligibility = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/downloads/check');
      
      if (!response.ok) {
        throw new Error('Failed to check download eligibility');
      }
      
      const data = await response.json();
      setEligibility(data);
      return data;
    } catch (err) {
      setError('Error checking download eligibility');
      console.error('Error checking download eligibility:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Increment the download count
  const incrementDownloadCount = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/downloads/increment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to increment download count');
      }
      
      const data: DownloadResult = await response.json();
      
      // Refresh eligibility data after incrementing
      await checkEligibility();
      
      return data;
    } catch (err) {
      setError('Error incrementing download count');
      console.error('Error incrementing download count:', err);
      return { success: false, message: 'Error incrementing download count' };
    } finally {
      setIsLoading(false);
    }
  };

  // Handle download with restriction checks
  const handleDownload = async (downloadCallback: () => void) => {
    try {
      if (status === 'unauthenticated') {
        console.log('User not authenticated, redirecting to sign in');
        // Redirect to sign in page if not authenticated
        router.push('/auth/signin');
        return;
      }

      if (status === 'loading') {
        console.log('Session loading, please wait...');
        return;
      }

      console.log('Checking download eligibility...');
      // Check eligibility first
      const eligibilityData = await checkEligibility();
      console.log('Eligibility data:', eligibilityData);
      
      if (!eligibilityData) {
        console.error('No eligibility data returned');
        setError('Could not verify download eligibility. Please try again.');
        return;
      }
      
      if (!eligibilityData.canDownload) {
        console.log('User cannot download, showing upgrade dialog');
        // Show upgrade prompt if user can't download
        if (eligibilityData?.subscription === 'free' || eligibilityData?.subscription === 'pro') {
          // Set state to show upgrade dialog instead of immediate redirect
          setError(eligibilityData.message);
          return;
        }
        return;
      }

      console.log('User can download, proceeding with download');
      // Proceed with download
      downloadCallback();
      
      console.log('Incrementing download count...');
      // Increment download count after successful download
      const result = await incrementDownloadCount();
      console.log('Increment result:', result);
      
      if (!result.success) {
        console.error('Failed to increment download count:', result.message);
      }
    } catch (error) {
      console.error('Error in handleDownload:', error);
      setError('An error occurred while processing your download. Please try again.');
      throw error; // Re-throw to allow the button component to handle it
    }
  };

  // Initialize by checking eligibility when session changes
  useEffect(() => {
    if (status === 'authenticated') {
      checkEligibility();
    }
  }, [status]);

  return {
    isLoading,
    eligibility,
    error,
    checkEligibility,
    incrementDownloadCount,
    handleDownload,
  };
}
