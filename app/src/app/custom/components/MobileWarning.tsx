'use client';

import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const MobileWarning = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Run on mount and when window resizes
    const checkMobile = () => {
      const isMobileDevice = window.innerWidth < 768;
      setOpen(isMobileDevice);
    };

    // Initial check
    checkMobile();

    // Add resize listener
    window.addEventListener('resize', checkMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []); // Empty dependency array means this runs once on mount

  const handleRedirect = () => {
    router.push('/');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen} modal={true}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">Mobile Device Detected</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-4 py-4">
          <p className="text-center text-gray-600">
            The custom mockup feature isn&apos;t supported on mobile devices. Please use a desktop device to access this experience.
          </p>
          <Button onClick={handleRedirect} className="w-full bg-primary hover:bg-primary/90">
            Return to Home
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MobileWarning;
