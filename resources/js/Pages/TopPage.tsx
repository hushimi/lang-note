import { PageProps } from '@/types';
import { Card, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';
import LoginModal from '@/Components/LoginModal';
import topImage from '@/images/top.jpg';
import { useState } from 'react';

export default function TopPage({ auth }: PageProps) {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-page-bg flex flex-col">
      <Header auth={auth} />
      <main>
        {/* Hero Section */}
        <section className="relative h-[70vh] min-h-[500px] w-full overflow-hidden" aria-label="Hero section">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${topImage})` }}
          >
            {/* Overlay for better text readability */}
            <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/30 to-black/50" />
          </div>

          {/* Hero Text */}
          <div className="relative flex h-full items-center justify-center px-4">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white drop-shadow-2xl md:text-5xl lg:text-6xl">
                学んだ表現を保存
                <br />
                いつでも見返せる
                <br />
                何度も復習して自分のものにしよう
              </h1>
            </div>
          </div>
        </section>

        {/* Language Selection Cards */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8" aria-label="Language selection">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-neutral">学習する言語を選択</h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3" role="list">
            {/* English Card */}
            <Card className="cursor-pointer transition-all hover:scale-105 hover:shadow-xl" role="listitem" tabIndex={0} aria-label="Learn English">
              <CardHeader>
                <CardTitle className="text-2xl text-neutral">English</CardTitle>
                <CardDescription className="text-base">英語</CardDescription>
              </CardHeader>
            </Card>

            {/* Thai Card */}
            <Card className="cursor-pointer transition-all hover:scale-105 hover:shadow-xl" role="listitem" tabIndex={0} aria-label="Learn Thai">
              <CardHeader>
                <CardTitle className="text-2xl text-neutral">ภาษาไทย</CardTitle>
                <CardDescription className="text-base">タイ語</CardDescription>
              </CardHeader>
            </Card>

            {/* Korean Card */}
            <Card className="cursor-pointer transition-all hover:scale-105 hover:shadow-xl" role="listitem" tabIndex={0} aria-label="Learn Korean">
              <CardHeader>
                <CardTitle className="text-2xl text-neutral">한국어</CardTitle>
                <CardDescription className="text-base">韓国語</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>
      </main>

      <Footer />

      {/* Modals */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  );
}
