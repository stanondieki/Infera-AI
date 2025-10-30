'use client';

import Image from 'next/image';
import { useState } from 'react';

export function Testimonials() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  
  const featuredTestimonials = [
    {
      id: 1,
      name: "Sarah Chen",
      role: "Software Engineer",
      location: "San Francisco, CA",
      image: "/images/testimonials/sarah.jpg", // You'll need to add this image
      rating: 5,
      score: 99,
      totalEarnings: "$12,450",
      projectsCompleted: 156,
      quote: "Infera AI has been incredible for supplementing my income. I work on code review projects during evenings and weekends, and the flexibility is unmatched."
    },
    {
      id: 2,
      name: "Marcus Johnson",
      role: "Data Scientist",
      location: "New York, NY",
      image: "/images/testimonials/marcus.jpg",
      rating: 5,
      score: 97,
      totalEarnings: "$18,900",
      projectsCompleted: 203,
      quote: "The quality of projects and the support from the Infera AI team is outstanding. I've grown my skills significantly while earning great income."
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "Content Writer",
      location: "Austin, TX",
      image: "/images/testimonials/emily.jpg",
      rating: 5,
      score: 98,
      totalEarnings: "$9,750",
      projectsCompleted: 124,
      quote: "I've been with Infera AI for 6 months and it's been amazing. The platform is easy to use and payments are always on time."
    }
  ];

  const testimonialCards = [
    {
      name: "Sarah Chen",
      role: "Software Engineer",
      avatar: "/images/avatars/sarah.jpg",
      rating: 5,
      quote: "Infera AI has been incredible for supplementing my income. I work on code review projects during evenings and weekends, and the flexibility is unmatched."
    },
    {
      name: "Marcus Johnson", 
      role: "Data Scientist",
      avatar: "/images/avatars/marcus.jpg",
      rating: 5,
      quote: "The quality of projects and the support from the Infera AI team is outstanding. I've grown my skills significantly while earning great income."
    },
    {
      name: "Emily Rodriguez",
      role: "Content Writer", 
      avatar: "/images/avatars/emily.jpg",
      rating: 5,
      quote: "I've been with Infera AI for 6 months and it's been amazing. The platform is easy to use and payments are always on time."
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-xl ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
        ⭐
      </span>
    ));
  };

  return (
    <>
      {/* Creative Section Divider */}
      <div className="relative">
        {/* Wavy Transition */}
        <div className="absolute inset-0 overflow-hidden">
          <svg
            className="absolute bottom-0 w-full h-24 text-white"
            preserveAspectRatio="none"
            viewBox="0 0 1200 120"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
              opacity=".25"
              className="fill-current"
            ></path>
            <path
              d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
              opacity=".5"
              className="fill-current"
            ></path>
            <path
              d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
              className="fill-current"
            ></path>
          </svg>
        </div>
        
        {/* Floating Elements */}
        <div className="relative py-16 bg-gradient-to-br from-gray-50 to-white">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-10 left-10 w-20 h-20 bg-purple-200/30 rounded-full animate-pulse"></div>
            <div className="absolute top-1/2 right-20 w-16 h-16 bg-pink-200/30 rounded-full animate-bounce"></div>
            <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-blue-200/30 rounded-full animate-ping"></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <div className="inline-flex items-center space-x-4 bg-white/80 backdrop-blur-sm rounded-full px-8 py-4 shadow-lg">
              <span className="text-2xl">🎉</span>
              <span className="text-gray-600 font-medium">Ready to join our success stories?</span>
              <span className="text-2xl">🚀</span>
            </div>
          </div>
        </div>
      </div>

      <section id="testimonials" className="py-20 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-40 h-40 bg-purple-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-60 h-60 bg-pink-500 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="bg-purple-100 text-purple-600 px-4 py-2 rounded-full text-sm font-normal inline-flex items-center mb-6">
            <span className="mr-2">💜</span>
            Testimonials
          </div>
          <h2 className="text-3xl lg:text-4xl font-normal text-gray-800 mb-4">
            Loved by <span className="bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent font-medium">Thousands</span>
          </h2>
          <p className="text-base text-gray-500 max-w-2xl mx-auto font-light">
            Join thousands of satisfied contributors earning with Infera AI
          </p>
        </div>

        {/* Featured Testimonial */}
        <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-lg mb-12 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
            <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 rounded-full transform rotate-12"></div>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* User Image and Stats */}
            <div className="relative">
              {/* Placeholder for user image - replace with actual image */}
              <div className="w-80 h-80 bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl mx-auto relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-4xl font-bold">
                      {featuredTestimonials[currentTestimonial].name.charAt(0)}
                    </span>
                  </div>
                </div>
                
                {/* Stats Overlay */}
                <div className="absolute bottom-6 left-6 right-6 grid grid-cols-2 gap-4">
                  <div className="bg-black/70 backdrop-blur-sm rounded-2xl p-4 text-white">
                    <div className="text-2xl font-bold">{featuredTestimonials[currentTestimonial].totalEarnings}</div>
                    <div className="text-sm opacity-80">Total Earnings</div>
                  </div>
                  <div className="bg-black/70 backdrop-blur-sm rounded-2xl p-4 text-white">
                    <div className="text-2xl font-bold">{featuredTestimonials[currentTestimonial].projectsCompleted}</div>
                    <div className="text-sm opacity-80">Projects</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial Content */}
            <div className="space-y-6">
              {/* Score Badge */}
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold">
                {featuredTestimonials[currentTestimonial].score}
              </div>

              {/* Rating */}
              <div className="flex space-x-1">
                {renderStars(featuredTestimonials[currentTestimonial].rating)}
              </div>

              {/* Quote */}
              <blockquote className="text-xl text-gray-600 font-light leading-relaxed italic">
                "{featuredTestimonials[currentTestimonial].quote}"
              </blockquote>

              {/* User Info */}
              <div className="space-y-2">
                <div className="text-xl font-medium text-gray-800">
                  {featuredTestimonials[currentTestimonial].name}
                </div>
                <div className="flex items-center space-x-4 text-gray-500">
                  <span className="flex items-center space-x-1">
                    <span>💼</span>
                    <span className="text-sm">{featuredTestimonials[currentTestimonial].role}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <span>📍</span>
                    <span className="text-sm">{featuredTestimonials[currentTestimonial].location}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Carousel Dots */}
          <div className="flex justify-center space-x-2 mt-8">
            {featuredTestimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentTestimonial 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 w-8' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Testimonial Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonialCards.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              {/* User Info */}
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="font-medium text-gray-800">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                </div>
              </div>

              {/* Rating */}
              <div className="flex space-x-1 mb-4">
                {renderStars(testimonial.rating)}
              </div>

              {/* Quote */}
              <p className="text-gray-600 text-sm leading-relaxed font-light">
                "{testimonial.quote}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
    </>
  );
}