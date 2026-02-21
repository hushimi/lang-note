import { Link, router } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { PageProps } from '@/types';
import { useState } from 'react';
import LoginModal from '@/Components/LoginModal';

interface HeaderProps {
  auth: PageProps['auth'];
}

export default function Header({ auth }: HeaderProps) {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleLogout = () => {
    router.post('/logout');
  };

  return (
    <>
      <header className="border-b border-gray-200 bg-white" role="banner">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="flex h-16 items-center justify-between" aria-label="Main navigation">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-1" aria-label="Lang Note home">
              <span className="text-3xl font-bold text-brand-primary">
                L
              </span>
              <span className="text-3xl font-bold text-brand-secondary">
                n
              </span>
            </Link>

            {/* Right Side - Auth Controls */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {auth.user ? (
                <>
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    {auth.user.avatar && (
                      <img
                        src={auth.user.avatar}
                        alt={auth.user.name}
                        className="h-8 w-8 rounded-full"
                      />
                    )}
                    <span className="hidden sm:inline text-sm font-medium text-neutral">
                      {auth.user.name}
                    </span>
                  </div>
                  <Button
                    onClick={handleLogout}
                    variant="ghost"
                    size="sm"
                    className="cursor-pointer"
                    aria-label="Logout from your account"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => setIsLoginModalOpen(true)}
                  variant="outline"
                  size="sm"
                  className="cursor-pointer"
                >
                  Login
                </Button>
              )}
            </div>
          </nav>
        </div>
      </header>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
}
