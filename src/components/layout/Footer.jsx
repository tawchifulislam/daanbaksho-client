import Link from 'next/link';
import { LogoLinkedin, LogoFacebook, LogoGithub } from '@gravity-ui/icons';

export default function Footer() {
  return (
    <footer className="border-t bg-background mt-16">
      <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <Link href="/" className="text-xl font-bold">
          DaanBaksho
        </Link>

        <p className="text-sm text-muted-foreground text-center">
          Empowering creators and causes through community-driven crowdfunding.
        </p>

        <div className="flex items-center gap-4">
          <a
            href="https://linkedin.com/in/YOUR_USERNAME"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <LogoLinkedin className="w-5 h-5 hover:text-primary transition-colors" />
          </a>

          <a
            href="https://facebook.com/YOUR_USERNAME"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
          >
            <LogoFacebook className="w-5 h-5 hover:text-primary transition-colors" />
          </a>

          <a
            href="https://github.com/YOUR_USERNAME"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <LogoGithub className="w-5 h-5 hover:text-primary transition-colors" />
          </a>
        </div>
      </div>
    </footer>
  );
}
