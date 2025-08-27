import React from 'react';
import Slider from 'react-slick';

const testimonials = [
  {
    quote: 'THIRDEYE provided an incredibly detailed report that saved me from buying a car with hidden issues. Their professionalism is unmatched.',
    author: 'John Doe, Johannesburg',
  },
  {
    quote: 'The property evaluation was thorough and identified critical issues we had missed. Essential service for any homebuyer.',
    author: 'Jane Smith, Cape Town',
  },
  {
    quote: 'As a collector, I rely on their expertise for high-value item assessments. Their appraisals are always accurate and well-researched.',
    author: 'Richard Roe, Durban',
  },
];

const Testimonials: React.FC = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    cssEase: 'linear',
    arrows: false,
  };

  return (
    <section className="glass p-8">
      <h2 className="text-3xl font-bold text-center mb-8">What Our Clients Say</h2>
      <Slider {...settings}>
        {testimonials.map((testimonial, index) => (
          <div key={index} className="glass p-6 m-4 rounded-lg">
            <p className="text-lg italic text-gray-300 mb-4">"{testimonial.quote}"</p>
            <p className="font-bold text-primary">- {testimonial.author}</p>
          </div>
        ))}
      </Slider>
    </section>
  );
};

export default Testimonials;
