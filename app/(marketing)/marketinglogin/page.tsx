import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import LoginForm from '@/app/(marketing)/marketinglogin/LoginForm';

export const metadata = {
  title: 'T VANAMM Marketing Dashboard | Sign In',
};

export default function MarketingLoginPage() {
  async function handleLogin(formData: FormData) {
    'use server';
    const email = formData.get('email');
    const password = formData.get('password');
    
    const adminEmail = process.env.MARKETING_ADMIN_EMAIL || 'digitalmarketing@tvanamm.com';
    const adminPassword = process.env.MARKETING_ADMIN_PASSWORD || 'tvanamm2026';

    if (email === adminEmail && password === adminPassword) {
      // Set simple auth cookie
      cookies().set('marketing_auth_token', process.env.MARKETING_ADMIN_TOKEN || 'admin-dashboard-access-key', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });
      redirect('/marketingdashboard');
    } else {
      return { error: 'Invalid email or password' };
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-10 shadow-2xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight text-gray-900">
            T VANAMM<br />
            <span className="text-[#C8A96E] font-playfair font-bold text-2xl uppercase tracking-widest leading-loose">Marketing Dashboard</span>
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to manage blogs and SEO
          </p>
        </div>
        <LoginForm action={handleLogin} />
      </div>
    </div>
  );
}
