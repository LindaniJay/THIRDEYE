import React, { useRef, useState, ChangeEvent } from 'react';
import axios from 'axios';
import emailjs from '@emailjs/browser';

type ServiceType = 'property' | 'vehicle' | '';

const ContactUsPage: React.FC = () => {
  const form = useRef<HTMLFormElement>(null);
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [serviceType, setServiceType] = useState<ServiceType>('');

  const sendEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.current) return;

    setIsSending(true);
    setError(null);
    setIsSent(false);

    try {
      // First, send the email
      const emailResult = await emailjs.sendForm(
        'service_tsft4m6',
        'template_q9nhqnt',
        form.current,
        '8rZgkbkbrRscKrSKK'
      );
      
      console.log(emailResult.text);
      
      // Then, increment the inspection count
      try {
        await axios.post('http://localhost:5000/api/inspections/increment');
        console.log('Inspection count incremented');
      } catch (incrementError) {
        console.error('Error incrementing inspection count:', incrementError);
        // Don't fail the whole operation if this fails
      }
      
      setIsSent(true);
      form.current?.reset();
    } catch (error: any) {
      console.error('Error sending email:', error);
      setError(error.text || 'Failed to send message. Please try again later.');
    } finally {
      setIsSending(false);
    }
  };
  const handleServiceTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setServiceType(e.target.value as ServiceType);
  };

  return (
    <div className="container mx-auto max-w-6xl animate-fade-in">
      <h1 className="text-4xl font-bold text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Service Request Form</h1>
      <p className="text-center text-xl text-gray-200 mb-12 font-medium">
        Let us know what you need and we'll get back to you with a quote. <span className="text-accent font-semibold">We're here to help.</span>
      </p>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div className="glass p-8 animate-fade-in-up">
          <h2 className="text-2xl font-bold mb-6">Request More Info or Book an Inspection</h2>
          <form ref={form} onSubmit={sendEmail} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Full Name *</label>
                <input type="text" id="name" name="user_name" placeholder="Your Name" className="input-field w-full" required />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email Address *</label>
                <input type="email" id="email" name="user_email" placeholder="your.email@example.com" className="input-field w-full" required />
              </div>
            </div>

            <div>
              <label htmlFor="serviceType" className="block text-sm font-medium text-gray-300 mb-1">Service Type *</label>
              <select 
                id="serviceType" 
                name="service_type" 
                className="input-field w-full" 
                value={serviceType}
                onChange={handleServiceTypeChange}
                required
              >
                <option value="">Select a service type</option>
                <option value="property">Property Services</option>
                <option value="vehicle">Vehicle Services</option>
              </select>
            </div>

            {serviceType === 'property' && (
              <div className="space-y-4 p-4 bg-gray-800/50 rounded-lg">
                <h3 className="font-medium text-accent">Property Details</h3>
                <div>
                  <label htmlFor="propertyType" className="block text-sm font-medium text-gray-300 mb-1">Property Type *</label>
                  <select id="propertyType" name="property_type" className="input-field w-full" required>
                    <option value="">Select property type</option>
                    <option value="house">House</option>
                    <option value="apartment">Apartment</option>
                    <option value="commercial">Commercial Property</option>
                    <option value="land">Land</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-1">Location *</label>
                  <select id="location" name="location" className="input-field w-full" required>
                    <option value="">Select location</option>
                    <option value="coast">Coastal Area</option>
                    <option value="cbd">City Center (CBD)</option>
                    <option value="suburb">Suburban Area</option>
                    <option value="rural">Rural Area</option>
                  </select>
                </div>
              </div>
            )}

            {serviceType === 'vehicle' && (
              <div className="space-y-4 p-4 bg-gray-800/50 rounded-lg">
                <h3 className="font-medium text-accent">Vehicle Details</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="make" className="block text-sm font-medium text-gray-300 mb-1">Make *</label>
                    <input type="text" id="make" name="vehicle_make" placeholder="e.g., Toyota" className="input-field w-full" required />
                  </div>
                  <div>
                    <label htmlFor="model" className="block text-sm font-medium text-gray-300 mb-1">Model *</label>
                    <input type="text" id="model" name="vehicle_model" placeholder="e.g., Corolla" className="input-field w-full" required />
                  </div>
                  <div>
                    <label htmlFor="year" className="block text-sm font-medium text-gray-300 mb-1">Year</label>
                    <input type="number" id="year" name="vehicle_year" min="1900" max={new Date().getFullYear() + 1} className="input-field w-full" />
                  </div>
                  <div>
                    <label htmlFor="mileage" className="block text-sm font-medium text-gray-300 mb-1">Mileage (km)</label>
                    <input type="number" id="mileage" name="vehicle_mileage" className="input-field w-full" />
                  </div>
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="budget" className="block text-sm font-medium text-gray-300 mb-1">Your Budget (ZAR) *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">R</span>
                  <input 
                    type="number" 
                    id="budget" 
                    name="budget" 
                    min="0" 
                    step="1000" 
                    placeholder="e.g. 50000" 
                    className="input-field w-full pl-8" 
                    required 
                  />
                </div>
              </div>
              <div>
                <label htmlFor="serviceDate" className="block text-sm font-medium text-gray-300 mb-1">When do you need the service? *</label>
                <input 
                  type="date" 
                  id="serviceDate" 
                  name="service_date" 
                  min={new Date().toISOString().split('T')[0]} 
                  className="input-field w-full" 
                  required 
                />
              </div>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">Additional Details</label>
              <textarea 
                id="message" 
                name="message" 
                rows={4} 
                placeholder="Please provide any additional information about your service request..." 
                className="input-field w-full"
              ></textarea>
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
