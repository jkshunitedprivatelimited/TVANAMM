

export const metadata = {
  title: 'Legal & Privacy Policy | T Vanamm',
};

export default function LegalPolicyPage() {
  return (
    <div className="bg-gray-50 min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-4 max-w-4xl bg-white p-8 md:p-16 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-4xl font-playfair font-bold text-[#006437] mb-8">Legal & Privacy Policy</h1>
        
        <div className="prose prose-green max-w-none text-gray-700 space-y-12">
          {/* Privacy Policy Section */}
          <section id="privacy-policy">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">1. Privacy Policy</h2>
            <p><strong>Last updated: 2025</strong></p>
            <p>Welcome to T Vanamm, a brand of JKSH United Private Limited. This privacy policy outlines how we collect, use, and protect your information when you visit our franchise enquiry website.</p>
            
            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-2">1.1 Information We Collect</h3>
            <p>When you submit a franchise enquiry or contact form, we collect: Full Name, Phone Number, Email Address, City, and IP Address.</p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-2">1.2 Data Storage and Security</h3>
            <p>Your data is securely stored in Supabase (secured by row-level security). We absolutely do not sell, trade, or rent your personal data to third parties.</p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-2">1.3 Cookie Policy</h3>
            <p>We use analytical cookies (Google Analytics 4, GTM, Microsoft Clarity) solely to improve user experience. You can opt out via your browser settings.</p>
          </section>

          {/* Terms & Conditions Section */}
          <section id="terms-and-conditions">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">2. Terms & Conditions</h2>
            <p>By accessing this website, you agree to comply with these terms. This website is intended solely for facilitating franchise inquiries.</p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-2">2.1 Franchise Enquiry Disclaimer</h3>
            <p>Submitting an enquiry does <strong>not</strong> constitute a binding agreement or a guarantee of franchise allotment. Allotments are subject to internal company approval.</p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-2">2.2 Intellectual Property</h3>
            <p>The &quot;T Vanamm&quot; name, logos, taglines (&quot;A Taste of Purity&quot;), and all related design materials are the intellectual property of JKSH United Private Limited.</p>
          </section>

          {/* Refund & Cancellation Section */}
          <section id="refund-policy">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">3. Refund & Cancellation Policy</h2>
            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-2">3.1 No Online Payments</h3>
            <p>The T Vanamm website is strictly for informational and enquiry purposes. <strong>No payments are processed, requested, or collected directly through this website.</strong></p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-2">3.2 Offline Transactions</h3>
            <p>Specific refund and cancellation terms for franchise fees will be clearly outlined in your physical Franchise Agreement document during the offline onboarding process.</p>
          </section>

          {/* Contact Section */}
          <section id="contact-legal">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">4. Contact Information</h2>
            <p>For any legal or privacy-related queries, please contact us at:</p>
            <p className="font-semibold text-[#006437]">
              Email: <a href="mailto:tvanamm@gmail.com" className="hover:underline">tvanamm@gmail.com</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
