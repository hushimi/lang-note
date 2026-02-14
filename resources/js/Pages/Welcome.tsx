import { Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';

export default function Welcome({ auth }: PageProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 p-4 dark:from-gray-900 dark:to-gray-800">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Lang Note</CardTitle>
          <CardDescription>Your language learning companion</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {auth.user ? (
            <div className="space-y-4">
              <p className="text-muted-foreground text-center">Welcome back, {auth.user.name}!</p>
              <Link href="/dashboard">
                <Button className="w-full" size="lg">
                  Go to Dashboard
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-muted-foreground text-center">
                Sign in to get started with your language learning journey
              </p>
              <a href="/auth/google">
                <Button className="w-full" size="lg" variant="outline">
                  <FontAwesomeIcon icon={faGoogle} className="mr-2" />
                  Continue with Google
                </Button>
              </a>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
