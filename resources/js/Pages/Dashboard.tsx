import { PageProps } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faChartLine, faCog } from '@fortawesome/free-solid-svg-icons';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';

export default function Dashboard({ auth }: PageProps) {
  return (
    <div className="min-h-screen bg-page-bg flex flex-col">
      <Header auth={auth} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome{auth.user?.name ? `, ${auth.user.name}` : ''}!
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

      <Footer />
    </div>
  );
}
