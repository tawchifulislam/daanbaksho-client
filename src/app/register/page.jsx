import RegisterForm from '@/components/auth/RegisterForm';
import Container from '@/components/layout/Container';

export default function RegisterPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-muted/30 px-4 py-10">
      <RegisterForm />
    </div>
  );
}
