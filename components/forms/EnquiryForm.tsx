'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Phone, User, Mail, MapPin, Loader2 } from 'lucide-react';
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile';

const contactSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().regex(/^(?:\+91|91)?[6-9]\d{9}$/, 'Invalid Indian phone number'),
  email: z.string().email('Invalid email address'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  message: z.string().optional(),
  turnstileToken: process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY 
    ? z.string().min(1, 'Please complete the security check')
    : z.string().optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

export function EnquiryForm({ hideHeadline = false }: { hideHeadline?: boolean }) {
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
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setErrorMessage('');
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, form_type: 'general_enquiry' }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit form');
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
        <h3 className="text-2xl font-bold text-[#006437] mb-3">Thank You!</h3>
        <p className="text-gray-600 mb-6">
          Your enquiry has been received successfully. Our team will call you within 24 hours.
        </p>
        <button 
          onClick={() => window.open("https://wa.me/919390658544?text=Hi,%20I%20just%20submitted%20a%20franchise%20enquiry", "_blank")}
          className="bg-[#25D366] text-white px-6 py-3 rounded font-medium hover:bg-[#1ebd5a] transition-colors"
        >
          Chat on WhatsApp now
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 md:space-y-5">
      {!hideHeadline && (
        <h3 className="text-xl md:text-2xl font-bold font-playfair mb-4 md:mb-6 text-[#006437]">
          Send an Enquiry
        </h3>
      )}

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
            className="w-full pl-10 pr-4 py-2.5 md:py-3 rounded-md bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#C8A96E] focus:ring-1 focus:ring-[#C8A96E] transition-all text-sm md:text-base"
          />
        </div>
        {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5">
        <div>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              {...register('phone')}
              type="tel"
              placeholder="Phone Number"
              className="w-full pl-10 pr-4 py-2.5 md:py-3 rounded-md bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#C8A96E] focus:ring-1 focus:ring-[#C8A96E] transition-all text-sm md:text-base"
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
              className="w-full pl-10 pr-4 py-2.5 md:py-3 rounded-md bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#C8A96E] focus:ring-1 focus:ring-[#C8A96E] transition-all text-sm md:text-base"
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
              className="w-full pl-10 pr-4 py-2.5 md:py-3 rounded-md bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#C8A96E] focus:ring-1 focus:ring-[#C8A96E] transition-all text-sm md:text-base"
            />
          </div>
          {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
        </div>

      <div>
        <textarea
          {...register('message')}
          placeholder="Message (Optional)"
          rows={2}
          className="w-full px-4 py-2.5 md:py-3 rounded-md bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#C8A96E] focus:ring-1 focus:ring-[#C8A96E] transition-all text-sm md:text-base resize-none"
        />
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
        className="w-full bg-[#006437] hover:bg-[#004e2a] text-white font-semibold py-3 md:py-4 rounded-md transition-colors flex items-center justify-center gap-2 text-sm md:text-base mt-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="animate-spin" size={20} />
            Submitting...
          </>
        ) : (
          'Submit Enquiry'
        )}
      </button>
    </form>
  );
}
