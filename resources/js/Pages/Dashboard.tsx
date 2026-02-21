import { router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faBook, faChartLine, faCog } from '@fortawesome/free-solid-svg-icons';

export default function Dashboard({ auth }: PageProps) {
  const handleLogout = () => {
    router.post('/logout');
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <nav className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Lang Note</h1>
            </div>
            <div className="flex items-center space-x-4">
              {auth.user && (
                <>
                  <div className="flex items-center space-x-3">
                    {auth.user.avatar && (
                      <img
                        src={auth.user.avatar}
                        alt={auth.user.name}
                        className="h-8 w-8 rounded-full"
                      />
                    )}
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {auth.user.name}
                    </span>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                    Logout
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome, {auth.user?.name}!
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Start your language learning journey today
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="transition-shadow hover:shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FontAwesomeIcon icon={faBook} className="mr-2 text-blue-500" />
                My Lessons
              </CardTitle>
              <CardDescription>Continue where you left off</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                No lessons yet. Start learning a new language!
              </p>
            </CardContent>
          </Card>

          <Card className="transition-shadow hover:shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FontAwesomeIcon icon={faChartLine} className="mr-2 text-green-500" />
                Progress
              </CardTitle>
              <CardDescription>Track your learning progress</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Your progress will appear here as you learn
              </p>
            </CardContent>
          </Card>

          <Card className="transition-shadow hover:shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FontAwesomeIcon icon={faCog} className="mr-2 text-gray-500" />
                Settings
              </CardTitle>
              <CardDescription>Customize your experience</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">Manage your account and preferences</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
