'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Phone, User, Mail, MapPin, Loader2, Download } from 'lucide-react';
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile';

const downloadSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().regex(/^(?:\+91|91)?[6-9]\d{9}$/, 'Invalid Indian phone number'),
  email: z.string().email('Invalid email address'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  turnstileToken: process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY 
    ? z.string().min(1, 'Please complete the security check')
    : z.string().optional(),
});

type DownloadFormData = z.infer<typeof downloadSchema>;

export function BrochureDownloadForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const turnstileRef = useRef<TurnstileInstance>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<DownloadFormData>({
    resolver: zodResolver(downloadSchema),
  });

  const onSubmit = async (data: DownloadFormData) => {
    setIsSubmitting(true);
    setErrorMessage('');
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...data, 
          message: '[Brochure Download Request]', 
          form_type: 'general_enquiry' 
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to request download');
      }

      setIsSuccess(true);
      reset();
      turnstileRef.current?.reset();
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Something went wrong. Please try again.';
      setErrorMessage(msg);
      turnstileRef.current?.reset();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center py-12 px-4 bg-green-50 rounded-xl border border-green-100 flex flex-col items-center">
        <div className="w-16 h-16 bg-[#006437] text-white rounded-full flex justify-center items-center mb-6">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        </div>
        <h3 className="text-2xl font-bold text-[#006437] mb-3">Almost There!</h3>
        <p className="text-gray-600 mb-8 max-w-sm mx-auto">
          Your request was successful. Click the button below to download the official T VANAMM Franchise Brochure.
        </p>
        <a 
          href="/brochure.pdf" 
          download="T_Vanamm_Franchise_Brochure.pdf"
          className="bg-[#C8A96E] text-white px-8 py-4 rounded font-semibold hover:bg-[#b0935d] transition-colors flex items-center justify-center gap-3 text-lg w-full"
        >
          <Download size={22} />
          Download Brochure (PDF)
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-gray-900">
      {errorMessage && (
        <div className="p-3 bg-red-50 text-red-600 rounded text-sm border border-red-200">
          {errorMessage}
        </div>
      )}

      <div>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            {...register('fullName')}
            type="text"
            placeholder="Full Name"
            className="w-full pl-10 pr-4 py-3 rounded-md bg-white border border-gray-200 focus:outline-none focus:border-[#C8A96E] focus:ring-1 focus:ring-[#C8A96E] transition-all"
          />
        </div>
        {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
      </div>

      <div>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            {...register('phone')}
            type="tel"
            placeholder="Phone Number"
            className="w-full pl-10 pr-4 py-3 rounded-md bg-white border border-gray-200 focus:outline-none focus:border-[#C8A96E] focus:ring-1 focus:ring-[#C8A96E] transition-all"
          />
        </div>
        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
      </div>

      <div>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            {...register('email')}
            type="email"
            placeholder="Email Address"
            className="w-full pl-10 pr-4 py-3 rounded-md bg-white border border-gray-200 focus:outline-none focus:border-[#C8A96E] focus:ring-1 focus:ring-[#C8A96E] transition-all"
          />
        </div>
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            {...register('city')}
            type="text"
            placeholder="Target City for Franchise"
            className="w-full pl-10 pr-4 py-3 rounded-md bg-white border border-gray-200 focus:outline-none focus:border-[#C8A96E] focus:ring-1 focus:ring-[#C8A96E] transition-all"
          />
        </div>
        {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
      </div>

      {process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY && (
        <div className="py-2 flex justify-center">
          <Turnstile
            ref={turnstileRef}
            siteKey={process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY}
            onSuccess={(token) => {
              setValue('turnstileToken', token);
            }}
          />
        </div>
      )}
      {errors.turnstileToken && (
        <p className="text-red-500 text-xs text-center">{errors.turnstileToken.message}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#006437] hover:bg-[#004e2a] text-white font-semibold py-4 rounded-md transition-colors flex items-center justify-center gap-2 mt-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="animate-spin" size={20} />
            Processing...
          </>
        ) : (
          <>
            <Download size={20} />
            Unlock Brochure Now
          </>
        )}
      </button>
      <p className="text-xs text-center text-gray-500 mt-4">
        Your information is 100% secure. By submitting, you agree to receive franchise updates.
      </p>
    </form>
  );
}
