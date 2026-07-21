import Logo from './Logo';
import Container from './Container';
import { LogoFacebook, LogoGithub, LogoLinkedin } from '@gravity-ui/icons';

export default function Footer() {
  return (
    <footer className="border-t bg-background mt-16">
      <Container className="py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <Logo />

        <p className="text-sm text-muted-foreground text-center">
          Empowering creators and causes through community-driven crowdfunding.
        </p>

        <div className="flex items-center gap-4">
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <LogoLinkedin className="w-5 h-5 hover:text-primary transition-colors" />
          </a>

          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
          >
            <LogoFacebook className="w-5 h-5 hover:text-primary transition-colors" />
          </a>

          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <LogoGithub className="w-5 h-5 hover:text-primary transition-colors" />
          </a>
        </div>
      </Container>
    </footer>
  );
}
