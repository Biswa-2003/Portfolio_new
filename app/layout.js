import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css';
import dynamic from 'next/dynamic';
import ScrollProgress from './components/ScrollProgress';
import CustomCursor from './components/CustomCursor';
import Preloader from './components/Preloader';
import SmoothScroll from './lib/SmoothScroll';
import { Plus_Jakarta_Sans, Space_Grotesk } from 'next/font/google';

const AuroraScene = dynamic(() => import('./components/three/AuroraScene'), { ssr: false });

const inter = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const outfit = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
});

export const viewport = {
  themeColor: '#030014',
  width: 'device-width',
  initialScale: 1,
};

export const metadata = {
  title: 'Biswajit Panda | Full Stack Developer & AI Engineer',
  description:
    'Portfolio of Biswajit Panda — Full Stack Developer & AI Engineer specializing in Next.js, Node.js, PostgreSQL, Docker, and Applied Autonomous AI Systems.',
  keywords: [
    'Biswajit Panda',
    'Full Stack Developer',
    'AI Engineer',
    'Next.js',
    'React',
    'Node.js',
    'PostgreSQL',
    'TypeScript',
    'Portfolio',
    'Software Engineer',
  ],
  authors: [{ name: 'Biswajit Panda' }],
  creator: 'Biswajit Panda',
  icons: { icon: '/favicon.ico' },
  openGraph: {
    title: 'Biswajit Panda | Full Stack Developer & AI Engineer',
    description:
      'Explore high-performance architectures, applied AI integrations, and full-stack engineering deployments by Biswajit Panda.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Biswajit Panda Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Biswajit Panda | Full Stack Developer & AI Engineer',
    description:
      'High-performance architectures, applied AI systems, and scalable full-stack engineering deployments.',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark" className={`${inter.variable} ${outfit.variable}`}>
      <head />
      <body className={inter.className}>
        <Preloader />
        <CustomCursor />
        <ScrollProgress />
        <SmoothScroll />
        <AuroraScene />
        <div className="aurora-grain" aria-hidden="true" />
        <div className="page-content">{children}</div>
      </body>
    </html>
  );
}
