import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useDownloadRestriction } from '@/hooks/useDownloadRestriction';
import { useRouter } from 'next/navigation';
import { UpgradeSubscriptionDialog } from './UpgradeSubscriptionDialog';

interface DownloadButtonProps {
  onDownload: () => void;
  className?: string;
  children?: React.ReactNode;
}

export function DownloadButton({ onDownload, className, children }: DownloadButtonProps) {
  const router = useRouter();
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const { 
    isLoading, 
    eligibility, 
    handleDownload 
  } = useDownloadRestriction();

  const handleClick = async () => {
    try {
      // If we already know the user can't download, show upgrade dialog
      if (eligibility && !eligibility.canDownload) {
        setShowUpgradeDialog(true);
        return;
      }

      // Otherwise, attempt the download which will handle restrictions
      await handleDownload(() => {
        onDownload();
      });
    } catch (error) {
      console.error('Error in download button click handler:', error);
      // Show a user-friendly error message
      alert('There was an issue processing your download. Please try again or contact support if the problem persists.');
    }
  };

  return (
    <>
      <Button 
        onClick={handleClick} 
        disabled={isLoading} 
        className={className}
      >
        {isLoading ? 'Loading...' : (
          <>
            <Download className="mr-2 h-4 w-4" />
            {children || 'Download'}
            {eligibility && eligibility.subscription !== 'lifetime' && (
              <span className="ml-2 text-xs">
                ({eligibility.downloadsRemaining}/{eligibility.totalAllowed})
              </span>
            )}
          </>
        )}
      </Button>

      <UpgradeSubscriptionDialog
        open={showUpgradeDialog}
        onOpenChange={setShowUpgradeDialog}
        subscription={eligibility?.subscription || 'free'}
        downloadsRemaining={eligibility?.downloadsRemaining || 0}
        totalAllowed={eligibility?.totalAllowed || 0}
      />
    </>
  );
}
