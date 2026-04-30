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

export default function LoginModal({ isOpen, onClose }: Readonly<LoginModalProps>) {
  const handleGoogleLogin = () => {
    globalThis.location.href = route('auth.google');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='bg-white sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='text-center text-2xl font-bold'>WELCOME</DialogTitle>
          <DialogDescription className='text-neutral/70 pt-4 text-center text-sm'>
            ログインすることでプライバシーポリシーに同意したことになります
          </DialogDescription>
        </DialogHeader>

        <div className='flex flex-col items-center justify-center py-6'>
          <Button
            onClick={handleGoogleLogin}
            className='text-neutral hover:bg-primary w-full cursor-pointer border border-gray-300'
            size='sm'
          >
            <FontAwesomeIcon icon={faGoogle} className='mr-3 text-lg' />
            Googleで続ける
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
