import React, { useState, useEffect, useMemo, useRef } from 'react';
import axios from 'axios';
import CountUp from 'react-countup';

const AboutUsPage: React.FC = () => {
  const [inspectionCount, setInspectionCount] = useState(1);

  const [isVisible, setIsVisible] = useState(false);
  const counterRef = useRef<HTMLDivElement>(null);

  // Fetch inspection count on component mount
  useEffect(() => {
    const fetchInspectionCount = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/inspections');
        setInspectionCount(response.data.count);
      } catch (error) {
        console.error('Error fetching inspection count:', error);
      }
    };

    fetchInspectionCount();

    // Intersection Observer for scroll animation
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = counterRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  // Calculate months since business started (August 2025)
  const monthsInBusiness = useMemo(() => {
    const startDate = new Date('2025-08-01');
    const currentDate = new Date();
    const months = (currentDate.getFullYear() - startDate.getFullYear()) * 12;
    return Math.max(1, months + currentDate.getMonth() - startDate.getMonth() + 1);
  }, []);

  // Calculate dynamic satisfaction percentage
  const satisfactionRate = useMemo(() => {
    // Base satisfaction (can be adjusted)
    let satisfaction = 95; // Starting from 95%
    
    // Get current date components
    const now = new Date();
    const day = now.getDate();
    
    // Add some variation based on day of month (just for demo)
    // In a real app, this would come from your database/API
    satisfaction += (day % 5); // 0-4% variation based on day of month
    satisfaction = Math.min(99, Math.max(90, satisfaction)); // Keep between 90-99%
    
    return satisfaction;
  }, []);
  return (
    <div className="container mx-auto max-w-5xl animate-fade-in">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-6 text-gray-900 dark:text-white">
        Your specialist inspection partner
      </h1>
      <p className="text-xl text-center text-gray-700 dark:text-gray-200 mb-12 max-w-3xl mx-auto font-medium">
        for vehicles and rental properties in KwaZulu-Natal.
      </p>

      <div className="backdrop-blur-md bg-white/70 dark:bg-gray-900/80 p-10 space-y-8 text-lg mb-16 rounded-xl shadow-xl">
        <div>
          <h2 className="text-3xl font-bold text-primary mb-4">Who We Are</h2>
          <p className="leading-relaxed">
            THIRDEYE is a specialized inspection firm based in KwaZulu-Natal, dedicated to providing clear, unbiased, and expert evaluations for vehicles and rental properties. Founded on principles of integrity and meticulous attention to detail, we serve clients throughout KZN who require trustworthy assessments. Our team is composed of certified professionals with years of local experience, ensuring you receive the highest standard of service.
          </p>
        </div>

        <div>
          <h2 className="text-3xl font-bold text-primary mb-4">Our Expertise</h2>
          <p className="leading-relaxed">
            Our strength lies in our specialized knowledge of the KZN market. We provide comprehensive insights that empower you to make confident decisions, whether you're buying a car or renting a new home. From complex vehicle diagnostics to the critical details of a rental property's condition, our local expertise is your advantage.
          </p>
        </div>

        <div>
          <h2 className="text-3xl font-bold text-primary mb-4">What Makes Us Reliable</h2>
          <p className="leading-relaxed">
            Reliability is the cornerstone of our business. As a fully independent third party, our assessments are always objective. We prioritize clear communication and delivering comprehensive reports on time. Our deep roots in KwaZulu-Natal mean we provide expert, localized service you can depend on. At THIRDEYE, your peace of mind is our ultimate measure of success.
          </p>
        </div>
      </div>

      {/* Animated Counters Section */}
      <section 
        ref={counterRef}
        className={`backdrop-blur-md bg-white/70 dark:bg-gray-900/80 p-8 rounded-xl shadow-xl transform transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <h2 className="text-3xl font-bold text-center mb-8">Our Track Record</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <h3 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              <div className="relative inline-block">
                <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-accent rounded-full animate-pulse">
                  New!
                </span>
                <CountUp 
                  start={0}
                  end={inspectionCount}
                  duration={3} 
                  separator=","
                  useEasing={true}
                  className="relative text-gray-900 dark:text-white"
                />+
              </div>
            </h3>
            <p className="text-xl font-bold mt-2">Inspections Completed</p>
          </div>
          <div>
            <h3 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              <CountUp 
                start={0}
                end={monthsInBusiness}
                duration={3}
                suffix="+"
                useEasing={true}
                className="text-gray-900 dark:text-white"
              />
            </h3>
            <p className="text-xl font-bold mt-2">Months in Business</p>
          </div>
          <div>
            <h3 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              <CountUp 
                start={0}
                end={satisfactionRate}
                duration={3}
                suffix="%"
                useEasing={true}
                className="text-gray-900 dark:text-white"
              />
            </h3>
            <p className="text-xl font-bold mt-2">Client Satisfaction</p>
          </div>
        </div>
      </section>


    </div>
  );
};

export default AboutUsPage;
