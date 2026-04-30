import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/Components/ui/dialog';
import { Button } from '@/Components/ui/button';
import { router } from '@inertiajs/react';
import { route } from 'ziggy-js';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LogoutModal({ isOpen, onClose }: Readonly<LogoutModalProps>) {
  const handleLogout = () => {
    router.post(
      route('logout'),
      {},
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='bg-white sm:max-w-sm'>
        <DialogHeader>
          <DialogTitle className='text-center text-2xl font-bold'>ログアウト</DialogTitle>
          <DialogDescription className='text-neutral/70 pt-4 text-center text-sm'>
            ログアウトしてもよろしいですか？
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className='flex flex-col gap-2 sm:flex-row sm:gap-0'>
          <Button
            onClick={handleLogout}
            variant='outline'
            className='text-neutral hover:bg-accent w-full cursor-pointer sm:w-auto'
          >
            ログアウト
          </Button>
          <Button
            onClick={onClose}
            variant='outline'
            className='text-neutral w-full cursor-pointer hover:bg-gray-200 sm:w-auto'
          >
            キャンセル
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
