import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

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
  const instagramHandles = settings?.instagramHandles || ['tvanamm.info', 'tvanamm.official'];
  const address = settings?.address || 'Plot No. 12, Rd Number 8, Gayatri Nagar, Vivekananda Nagar, Kukatpally, Hyderabad, Telangana 500072';
  const businessHours = settings?.businessHours || 'Mon – Sat: 10:00 AM – 6:00 PM IST';
  const telecallers = settings?.telecallerNumbers?.length ? settings.telecallerNumbers : [
    '+91 95420 44456',
    '+91 99859 49456',
    '+91 99850 10145',
    '+91 99851 44456'
  ];

  return (
    <footer className="bg-white text-gray-800 pt-20 pb-8 border-t border-gray-100/50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand & Address */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="transition-transform duration-300 group-hover:scale-105">
                <Image 
                  src="/images/logo.png" 
                  alt="T Vanamm Logo" 
                  width={55} 
                  height={55} 
                  className="object-contain drop-shadow-sm" 
                />
              </div>
              <div className="flex flex-col">
                <span className="font-playfair font-bold text-2xl tracking-wide text-primary">
                  T Vanamm
                </span>
                <span className="font-playfair italic text-[11px] text-accent -mt-1 ml-4 transition-colors font-medium">
                  &quot;A Taste of Purity&quot;
                </span>
              </div>
            </Link>
            <div className="flex flex-col gap-2 mt-2 max-w-xs text-sm text-gray-600">
              <h5 className="font-bold text-primary flex items-center gap-2">
                <MapPin size={18} />
                Corporate Office
              </h5>
              <p className="pl-6 leading-relaxed italic">{address}</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="lg:ml-auto">
            <h4 className="font-bold mb-6 text-primary tracking-wide">Quick Links</h4>
            <ul className="flex flex-col gap-4">
              <li><Link href="/" className="text-gray-600 hover:text-accent transition-colors text-sm font-medium">Home</Link></li>
              <li><Link href="/about" className="text-gray-600 hover:text-accent transition-colors text-sm font-medium">About</Link></li>
              <li><Link href="/gallery" className="text-gray-600 hover:text-accent transition-colors text-sm font-medium">Gallery</Link></li>
              <li><Link href="/blog" className="text-gray-600 hover:text-accent transition-colors text-sm font-medium">Blog</Link></li>
              <li><Link href="/privacy-policy" className="text-gray-600 hover:text-accent transition-colors text-sm font-medium">Legal & Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="lg:ml-auto">
            <h4 className="font-bold mb-6 text-primary tracking-wide">Contact Us</h4>
            <ul className="flex flex-col gap-5 text-gray-600 text-sm">
              <li className="flex items-center gap-3">
                <div className="p-2 bg-primary/5 rounded-full text-primary">
                  <Mail size={16} />
                </div>
                <a href={`mailto:${email}`} className="hover:text-accent transition-colors font-medium">{email}</a>
              </li>
              <li className="flex items-start gap-3">
                <div className="p-2 bg-primary/5 rounded-full text-primary">
                  <Phone size={16} />
                </div>
                <div className="flex flex-col gap-1.5 mt-1">
                  <a href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors font-medium">
                    +{whatsappNumber} (WhatsApp)
                  </a>
                  {telecallers.map((num: string) => (
                    <a key={num} href={`tel:${num}`} className="text-gray-500 hover:text-accent transition-colors">{num}</a>
                  ))}
                </div>
              </li>
              <li className="flex items-center gap-3">
                <div className="p-2 bg-primary/5 rounded-full text-primary">
                  <Clock size={16} />
                </div>
                <span className="font-medium">{businessHours}</span>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="lg:ml-auto">
            <h4 className="font-bold mb-6 text-primary tracking-wide">Follow Us</h4>
            <div className="flex flex-col gap-4">
              {instagramHandles.map((handle: string) => (
                <a 
                  key={handle}
                  href={`https://instagram.com/${handle.replace('@', '')}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-3 group"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-accent/10 transition-colors shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600 group-hover:text-accent transition-colors">
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-600 group-hover:text-accent transition-colors">@{handle.replace('@', '')}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Legal Line */}
        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p className="text-gray-500 text-sm font-medium">
            © {new Date().getFullYear()} TVANAMM. All rights reserved. A unit of JKSH United Pvt Ltd.
          </p>
        </div>
      </div>
    </footer>
  );
}
