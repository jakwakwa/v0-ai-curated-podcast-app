import { SignIn } from '@clerk/nextjs';

export default function Login() {
  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'hsl(var(--background))'
    }}>
      <SignIn 
        afterSignInUrl="/dashboard"
        afterSignUpUrl="/dashboard"
      />
    </div>
  );
}
