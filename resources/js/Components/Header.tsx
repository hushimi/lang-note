import { Link } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { PageProps } from '@/types';
import { useState } from 'react';
import LoginModal from '@/Components/LoginModal';
import LogoutModal from '@/Components/LogoutModal';

interface HeaderProps {
  auth: PageProps['auth'];
}

export default function Header({ auth }: HeaderProps) {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

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
              {/* Login state is detected from session via HandleInertiaRequests middleware */}
              {auth.isLoggedIn && auth.user ? (
                <Button
                  onClick={() => setIsLogoutModalOpen(true)}
                  variant="outline"
                  size="sm"
                  className="cursor-pointer"
                  aria-label="Logout from your account"
                >
                  Logout
                </Button>
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
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
      />
    </>
  );
}
