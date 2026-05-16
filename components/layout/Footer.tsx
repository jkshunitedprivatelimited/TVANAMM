import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, Clock, Map } from 'lucide-react';

export interface SiteSettingsData {
  tagline?: string;
  address?: string;
  businessHours?: string;
  email?: string;
  telecallerNumbers?: string[];
  whatsappNumber?: string;
  instagramHandles?: string[];
  logo?: {
    asset: {
      url: string;
    };
  };
  defaultSeoTitle?: string;
  defaultSeoDescription?: string;
  seoKeywords?: string[];
}

interface FooterProps {
  settings?: SiteSettingsData;
}

export function Footer({ settings }: FooterProps) {
  const whatsappNumber = settings?.whatsappNumber || '919390658544';
  const email = settings?.email || 'tvanamm@gmail.com';
  const instagramHandles = settings?.instagramHandles || ['tvanammofficial'];
  const address = settings?.address || 'Floor #4, Flat No. #406, Alluri Trade Center, Near KPHB Metro (Pillar #761), Hyderabad, Telangana - 500072';
  const businessHours = settings?.businessHours || 'Mon - Sat:\n10:00 AM - 6:00 PM IST';
  const telecallers = settings?.telecallerNumbers || [];

  // Format phone number for display: +91 93906 58544
  const formattedPhone = whatsappNumber.startsWith('91')
    ? `+91 ${whatsappNumber.slice(2, 7)} ${whatsappNumber.slice(7)}`
    : `+${whatsappNumber}`;

  return (
    <footer className="bg-white text-gray-800 pt-16 pb-28 md:pb-8 border-t border-gray-100" role="contentinfo">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">

          {/* Brand & Address */}
          <div
            className="flex flex-col gap-4 lg:col-span-2 lg:pr-8"
            itemScope
            itemType="https://schema.org/LocalBusiness"
          >
            <Link href="/" className="flex items-center gap-3 transition-transform hover:scale-105 group" aria-label="T VANAMM — Go to homepage">
              <Image
                src="/images/logo_gif.gif"
                alt="T VANAMM Logo"
                width={50}
                height={50}
                className="object-contain"
                unoptimized
              />
              <div className="flex flex-col">
                <span className="font-playfair font-bold text-2xl tracking-wide text-[#006437]" itemProp="name">
                  T VANAMM
                </span>
                <span className="font-playfair italic text-[10px] text-[#006437] -mt-1 ml-4 opacity-90 group-hover:text-[#C8A96E] transition-colors">
                  &quot;A Taste of Purity&quot;
                </span>
              </div>
            </Link>

            <div className="flex flex-col gap-2 mt-2 text-sm text-gray-600">
              <p className="font-bold text-[#006437] flex items-center gap-2">
                <MapPin size={18} />
                Headquarters
              </p>
              <p
                className="pl-6 italic mb-1 text-balance leading-relaxed"
                itemProp="address"
                itemScope
                itemType="https://schema.org/PostalAddress"
              >
                <span itemProp="streetAddress">Floor #4, Flat No. #406, Alluri Trade Center, Near KPHB Metro (Pillar #761)</span>,{' '}
                <span itemProp="addressLocality">Hyderabad</span>,{' '}
                <span itemProp="addressRegion">Telangana</span> -{' '}
                <span itemProp="postalCode">500072</span>
              </p>
              <a
                href="https://maps.app.goo.gl/nKT9AUfBSQrpfqLD7"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-6 mt-2 inline-flex items-center gap-2 px-3 py-1.5 border border-[#C8A96E] text-[#C8A96E] hover:bg-[#C8A96E] hover:text-white transition-colors rounded-md font-medium text-xs self-start"
                aria-label="Open T VANAMM headquarters location in Google Maps"
              >
                <Map size={14} />
                Open in Google Maps
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="lg:ml-auto" aria-label="Footer navigation">
            <p className="font-bold mb-6 text-[#006437] text-sm uppercase tracking-wider">Quick Links</p>
            <ul className="flex flex-col gap-3">
              <li><Link href="/" className="text-gray-600 hover:text-[#C8A96E] transition-colors text-sm">Home</Link></li>
              <li><Link href="/about" className="text-gray-600 hover:text-[#C8A96E] transition-colors text-sm">About</Link></li>
              <li><Link href="/gallery" className="text-gray-600 hover:text-[#C8A96E] transition-colors text-sm">Gallery</Link></li>
              <li><Link href="/blog" className="text-gray-600 hover:text-[#C8A96E] transition-colors text-sm">Blog</Link></li>
              <li><Link href="/privacy-policy" className="text-gray-600 hover:text-[#C8A96E] transition-colors text-sm">Legal &amp; Privacy Policy</Link></li>
            </ul>
          </nav>

          {/* Contact Details */}
          <div className="lg:ml-auto">
            <p className="font-bold mb-6 text-[#006437] text-sm uppercase tracking-wider">Contact Us</p>
            <ul className="flex flex-col gap-4 text-gray-600 text-sm">
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-[#006437]" />
                <a href={`mailto:${email}`} className="hover:text-[#C8A96E] transition-colors" aria-label={`Email us at ${email}`}>{email}</a>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={16} className="text-[#006437] translate-y-1" />
                <div className="flex flex-col gap-1">
                  <a
                    href={`https://wa.me/${whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#C8A96E] transition-colors"
                    aria-label={`Message us on WhatsApp at ${formattedPhone}`}
                  >
                    {formattedPhone} (WhatsApp)
                  </a>
                  {telecallers.map((num: string) => (
                    <span key={num} className="text-xs text-gray-500">{num}</span>
                  ))}
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Clock size={16} className="text-[#006437]" />
                <span className="whitespace-pre-line">{businessHours}</span>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="lg:ml-auto">
            <p className="font-bold mb-6 text-[#006437] text-sm uppercase tracking-wider">Follow Us</p>
            <div className="flex flex-col gap-3">
              {instagramHandles.map((handle: string) => {
                const cleanHandle = handle.replace('@', '');
                return (
                  <a
                    key={handle}
                    href={`https://instagram.com/${cleanHandle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 group"
                    aria-label={`Follow @${cleanHandle} on Instagram`}
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-[#C8A96E]/10 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600 group-hover:text-[#C8A96E]" aria-hidden="true">
                        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-600 group-hover:text-[#C8A96E] transition-colors">@{cleanHandle}</span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Legal Line */}
        <div className="border-t border-gray-200 pt-8 mt-8 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-xs">
            © {new Date().getFullYear()} T VANAMM. All rights reserved. A brand of JKSH United Private Limited.
          </p>
        </div>
      </div>
    </footer>
  );
}