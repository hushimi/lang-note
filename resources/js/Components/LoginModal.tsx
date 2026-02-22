import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/Components/ui/dialog';
import { Button } from '@/Components/ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { route } from 'ziggy-js';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const handleGoogleLogin = () => {
    // OAuth redirect requires full page navigation (not SPA)
    window.location.href = route('auth.google');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Lang Noteへようこそ
          </DialogTitle>
          <DialogDescription className="text-center text-sm text-neutral/70 pt-4">
            ログインすることでプライバシーポリシーに同意したことになります
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center py-6">
          <Button
            onClick={handleGoogleLogin}
            className="w-full bg-white hover:bg-gray-50 text-neutral border border-gray-300 shadow-sm cursor-pointer"
            size="lg"
          >
            <FontAwesomeIcon icon={faGoogle} className="mr-3 text-lg" />
            Googleで続ける
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
