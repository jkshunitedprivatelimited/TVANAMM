import { Metadata } from 'next';
import { AboutClient } from './AboutClient';

export const metadata: Metadata = {
  title: 'About Us | Our Story & Vision',
  description: 'Building India\'s most trusted Premium Tea Franchise. Learn about our founder Mrs. Josnnsri, our core values, and our journey from startup to 500+ customers.',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return <AboutClient />;
}
