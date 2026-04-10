'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Phone, User, Mail, MapPin, Loader2, Download } from 'lucide-react';
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile';

const brochureSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().regex(/^(?:\+91|91)?[6-9]\d{9}$/, 'Invalid Indian phone number'),
  email: z.string().email('Invalid email address'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  message: z.string().optional(),
  turnstileToken: process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY 
    ? z.string().min(1, 'Please complete the security check')
    : z.string().optional(),
});

type BrochureFormData = z.infer<typeof brochureSchema>;

export function BrochureDLForm() {
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
  } = useForm<BrochureFormData>({
    resolver: zodResolver(brochureSchema),
  });

  const onSubmit = async (data: BrochureFormData) => {
    setIsSubmitting(true);
    setErrorMessage('');
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, form_type: 'franchise_enquiry' }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit request');
      }

      setIsSuccess(true);
      reset();
      turnstileRef.current?.reset();
      
      // Trigger download immediately
      const link = document.createElement('a');
      link.href = '/Franchiser_Brochure.pdf';
      link.download = 'TVanamm_Franchise_Brochure.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
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
          <Download className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold text-[#006437] mb-3">Download Started!</h3>
        <p className="text-gray-600 mb-6">
          Your brochure download should begin automatically. Our franchise team has received your details and will be in touch shortly.
        </p>
        <button 
          onClick={() => {
            const link = document.createElement('a');
            link.href = '/Franchiser_Brochure.pdf';
            link.download = 'TVanamm_Franchise_Brochure.pdf';
            link.click();
          }}
          className="bg-[#006437] text-white px-6 py-3 rounded font-medium hover:bg-[#004e2a] transition-colors shadow-md"
        >
          Click here if it didn't download
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <h3 className="text-2xl font-bold font-playfair mb-6 text-[#006437]">
        Download the Franchise Brochure
      </h3>

      {errorMessage && (
        <div className="p-3 bg-red-50 text-red-600 rounded text-sm border border-red-200">
          {errorMessage}
        </div>
      )}

      <div>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            {...register('fullName')}
            type="text"
            placeholder="Full Name"
            className="w-full pl-10 pr-4 py-3 rounded-md bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#C8A96E] focus:ring-1 focus:ring-[#C8A96E] transition-all"
          />
        </div>
        {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              {...register('phone')}
              type="tel"
              placeholder="Phone Number"
              className="w-full pl-10 pr-4 py-3 rounded-md bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#C8A96E] focus:ring-1 focus:ring-[#C8A96E] transition-all"
            />
          </div>
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
        </div>

        <div>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              {...register('email')}
              type="email"
              placeholder="Email"
              className="w-full pl-10 pr-4 py-3 rounded-md bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#C8A96E] focus:ring-1 focus:ring-[#C8A96E] transition-all"
            />
          </div>
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>
      </div>

      <div>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            {...register('city')}
            type="text"
            placeholder="City"
            className="w-full pl-10 pr-4 py-3 rounded-md bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#C8A96E] focus:ring-1 focus:ring-[#C8A96E] transition-all"
          />
        </div>
        {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
      </div>

      {process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY && (
        <div className="py-2">
          <Turnstile
            ref={turnstileRef}
            siteKey={process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY}
            onSuccess={(token) => {
              setValue('turnstileToken', token);
            }}
          />
          {errors.turnstileToken && (
            <p className="text-red-500 text-xs mt-1">{errors.turnstileToken.message}</p>
          )}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#006437] hover:bg-[#004e2a] text-white font-semibold py-4 rounded-md transition-colors flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="animate-spin" size={20} />
            Generating Download...
          </>
        ) : (
          <>
            <Download size={20} />
            Download Brochure
          </>
        )}
      </button>
    </form>
  );
}
