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

export default function LogoutModal({ isOpen, onClose }: LogoutModalProps) {
  const handleLogout = () => {
    router.post(route('logout'), {}, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            ログアウト
          </DialogTitle>
          <DialogDescription className="text-center text-sm text-neutral/70 pt-4">
            ログアウトしてもよろしいですか？
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full sm:w-auto cursor-pointer text-error"
          >
            ログアウト
          </Button>
          <Button
            onClick={onClose}
            variant="outline"
            className="w-full sm:w-auto cursor-pointer"
          >
            キャンセル
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
