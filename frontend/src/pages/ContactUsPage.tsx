import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';

const ContactUsPage: React.FC = () => {
  const form = useRef<HTMLFormElement>(null);
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.current) return;

    setIsSending(true);
    setError(null);
    setIsSent(false);

    // Replace with your actual EmailJS credentials
    emailjs.sendForm('service_tsft4m6', 'template_q9nhqnt', form.current, '8rZgkbkbrRscKrSKK')
      .then((result) => {
          console.log(result.text);
          setIsSent(true);
          form.current?.reset();
      }, (error) => {
          console.log(error.text);
          setError('Failed to send message. Please try again later.');
      })
      .finally(() => {
        setIsSending(false);
      });
  };
  return (
    <div className="container mx-auto max-w-6xl animate-fade-in">
      <h1 className="text-4xl font-bold text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Contact Us</h1>
      <p className="text-center text-xl text-gray-200 mb-12 font-medium">
        Have a question or need to book an inspection? <span className="text-accent font-semibold">We're here to help.</span>
      </p>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div className="glass p-8 animate-fade-in-up">
          <h2 className="text-2xl font-bold mb-6">Request More Info or Book an Inspection</h2>
          <form ref={form} onSubmit={sendEmail} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
              <input type="text" id="name" name="user_name" placeholder="Your Name" className="input-field" required />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
              <input type="email" id="email" name="user_email" placeholder="your.email@example.com" className="input-field" required />
            </div>
            <div>
              <label htmlFor="service" className="block text-sm font-medium text-gray-300 mb-1">Service of Interest</label>
              <select id="service" name="service_interest" className="input-field" required>
                <option>Vehicle Inspection</option>
                <option>Rental Property Inspection</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">Message</label>
              <textarea id="message" name="message" rows={5} placeholder="How can we help you?" className="input-field" required></textarea>
            </div>
            <button type="submit" className="btn-primary w-full" disabled={isSending}>
              {isSending ? 'Sending...' : 'Submit Request'}
            </button>
            {isSent && <p className="text-green-500 mt-4">Your message has been sent successfully!</p>}
            {error && <p className="text-red-500 mt-4">{error}</p>}
          </form>
        </div>

        {/* Contact Details */}
        <div className="space-y-8 animate-fade-in-up" style={{ animationDelay: '150ms' }}>
          <div className="glass p-8">
            <h2 className="text-2xl font-bold mb-6">Our Details</h2>
            <div className="space-y-4 text-lg text-gray-300">
              <p><strong>Phone:</strong> <a href="tel:+27821234567" className="hover:text-accent">+27 82 123 4567</a></p>
              <p><strong>Email:</strong> <a href="mailto:info@thirdeye.co.za" className="hover:text-accent">info@thirdeye.co.za</a></p>
              <div className="pt-4">
                <h3 className="font-bold text-xl mb-2">Office Hours:</h3>
                <p>Mon - Fri: 8:00 AM - 5:00 PM</p>
                <p>Sat: 9:00 AM - 1:00 PM</p>
                <p>Sun & Public Holidays: Closed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;
