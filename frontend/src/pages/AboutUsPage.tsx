import React from 'react';
import CountUp from 'react-countup';

const AboutUsPage: React.FC = () => {
  return (
    <div className="container mx-auto max-w-5xl animate-fade-in">
      <h1 className="text-4xl font-bold text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">About THIRDEYE</h1>
      <p className="text-center text-gray-400 mb-12">Your specialist inspection partner for vehicles and rental properties in KwaZulu-Natal.</p>

      <div className="glass p-10 space-y-8 text-lg mb-16">
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
      <section className="glass p-8">
        <h2 className="text-3xl font-bold text-center mb-8">Our Track Record</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <h3 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              <CountUp end={1500} duration={3} separator="," />+
            </h3>
            <p className="text-xl font-bold mt-2">Inspections Completed</p>
          </div>
          <div>
            <h3 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              <CountUp end={10} duration={3} />+
            </h3>
            <p className="text-xl font-bold mt-2">Years in KZN</p>
          </div>
          <div>
            <h3 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              <CountUp end={99} duration={3} />%
            </h3>
            <p className="text-xl font-bold mt-2">Client Satisfaction</p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default AboutUsPage;
