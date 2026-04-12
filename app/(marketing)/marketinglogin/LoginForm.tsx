'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginForm({ action }: { action: (formData: FormData) => Promise<{ error?: string } | void> }) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    setError(null);
    const result = await action(formData);
    if (result?.error) {
      setError(result.error);
    }
    setIsPending(false);
  }

  return (
    <form action={handleSubmit} className="mt-8 space-y-6">
      <div className="space-y-4 rounded-md shadow-sm">
        <div className="relative group">
          <label htmlFor="email" className="sr-only">
            Marketing Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-3 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-green-800 focus:outline-none focus:ring-green-800 sm:text-sm transition-all"
            placeholder="Marketing Email"
          />
        </div>
        <div className="relative group">
          <label htmlFor="password" className="sr-only">
            Admin Password
          </label>
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            required
            className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-3 pr-10 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-green-800 focus:outline-none focus:ring-green-800 sm:text-sm transition-all"
            placeholder="Admin Password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-800 transition-colors focus:outline-none"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="text-center text-sm font-medium text-red-600">
          {error}
        </div>
      )}

      <div>
        <button
          type="submit"
          disabled={isPending}
          className="group relative flex w-full justify-center rounded-md border border-transparent bg-green-800 px-4 py-3 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-800 focus:ring-offset-2 disabled:bg-green-600"
        >
          {isPending ? 'Signing in...' : 'Sign in'}
        </button>
      </div>
    </form>
  );
}
