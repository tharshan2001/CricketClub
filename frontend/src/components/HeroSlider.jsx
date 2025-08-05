import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const HeroSlider = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Cricket club slider data
  const sliderImages = [
    {
      id: 1,
      url: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80',
      alt: 'Cricket Team Celebration',
      title: 'Welcome to Our Cricket Club',
      description: 'Join our passionate community of cricket enthusiasts and players of all skill levels.',
      cta: 'Join Now',
      link: '/membership'
    },
    {
      id: 2,
      url: 'https://i.pinimg.com/736x/11/4a/87/114a87e284917ee095c31695ff8cbd4a.jpg',
      alt: 'Cricket Match Action',
      title: 'Competitive Matches',
      description: 'Participate in exciting matches and tournaments throughout the season.',
      cta: 'View Fixtures',
      link: '/fixtures'
    },
    {
      id: 3,
      url: 'https://i.pinimg.com/1200x/ff/fb/17/fffb173c45430cd532c3447c35f53129.jpg',
      alt: 'Cricket Training',
      title: 'Professional Coaching',
      description: 'Improve your skills with our experienced coaches and training programs.',
      cta: 'Learn More',
      link: '/coaching'
    },
    {
      id: 4,
      url: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80',
      alt: 'Cricket Academy',
      title: 'Junior Development Program',
      description: 'Nurturing young talent with our specialized youth cricket programs.',
      cta: 'Register',
      link: '/academy'
    }
  ];

  // Auto-rotate slides every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [sliderImages.length]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + sliderImages.length) % sliderImages.length);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const handleSlideClick = (link) => {
    navigate(link);
  };

  return (
    <div className="relative w-full h-[70vh] max-h-[800px] min-h-[500px] overflow-hidden bg-gray-900 mt-16">
      {/* Slides container */}
      <div 
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {sliderImages.map((slide) => (
          <div 
            key={slide.id}
            className="w-full flex-shrink-0 relative h-full"
          >
            {/* Image with black overlay */}
            <div className="absolute inset-0 bg-black/60 z-10"></div>
            <img
              src={slide.url}
              alt={slide.alt}
              className="w-full h-full object-cover"
            />
            
            {/* Content overlay */}
            <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-center px-6 sm:px-12 md:px-24 lg:px-32 text-white">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white">
                {slide.title}
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl mb-8 max-w-3xl">
                {slide.description}
              </p>
              <button
                onClick={() => handleSlideClick(slide.link)}
                className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-8 rounded-md text-lg transition-colors duration-300"
              >
                {slide.cta}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      <button 
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors duration-300"
        aria-label="Previous slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button 
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors duration-300"
        aria-label="Next slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Slide indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex space-x-2">
        {sliderImages.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${currentSlide === index ? 'bg-amber-500 w-6' : 'bg-white/50'}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

    </div>
  );
};

export default HeroSlider;