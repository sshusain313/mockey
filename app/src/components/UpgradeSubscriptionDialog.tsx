import React from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface UpgradeSubscriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subscription: string;
  downloadsRemaining: number;
  totalAllowed: number;
}

export function UpgradeSubscriptionDialog({
  open,
  onOpenChange,
  subscription,
  downloadsRemaining,
  totalAllowed,
}: UpgradeSubscriptionDialogProps) {
  const router = useRouter();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Download Limit Reached</DialogTitle>
          <DialogDescription>
            {subscription === 'free' ? (
              <>
                You have used {totalAllowed - downloadsRemaining} of your {totalAllowed} free downloads.
                Upgrade to continue downloading mockups.
              </>
            ) : subscription === 'pro' ? (
              <>
                You have used {totalAllowed - downloadsRemaining} of your {totalAllowed} Pro downloads.
                Upgrade to Lifetime Pro for unlimited downloads.
              </>
            ) : (
              <>
                There was an issue checking your download eligibility.
                Please contact support if this problem persists.
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <h3 className="font-medium mb-2">Available Plans:</h3>
          <div className="space-y-3">
            <div className="p-3 border rounded-md bg-gray-50">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">Free</h4>
                  <p className="text-sm text-gray-500">10 downloads</p>
                </div>
                <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  Current
                </span>
              </div>
            </div>
            
            <div className="p-3 border rounded-md bg-white hover:bg-gray-50 cursor-pointer"
                 onClick={() => {
                   onOpenChange(false);
                   router.push('/pricing');
                 }}>
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">Pro</h4>
                  <p className="text-sm text-gray-500">100 downloads</p>
                </div>
                <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                  $4.1/mo
                </span>
              </div>
            </div>
            
            <div className="p-3 border rounded-md bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 cursor-pointer"
                 onClick={() => {
                   onOpenChange(false);
                   router.push('/pricing');
                 }}>
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">Lifetime Pro</h4>
                  <p className="text-sm text-gray-500">Unlimited downloads</p>
                </div>
                <span className="text-sm bg-indigo-100 text-indigo-800 px-2 py-1 rounded">
                  $199 one-time
                </span>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className="sm:justify-between">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              onOpenChange(false);
              router.push('/pricing');
            }}
          >
            View All Plans
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
