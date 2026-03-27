import { useState, useEffect } from 'react';
import slide1 from '../assets/slide1_lg.png';
import slide2 from '../assets/slide2_lg.png';
import slide3 from '../assets/slide3_lg.png';
import slide4 from '../assets/slide4_lg.png';
import slide5 from '../assets/slide5_lg.png';

const slides = [
  {
    id: 1,
    src: slide1,
    alt: 'Your Health, Simplified - Clusta Diagnostics',
  },
  {
    id: 2,
    src: slide2,
    alt: 'Take Control of Your Health - Clusta Diagnostics',
  },
  {
    id: 3,
    src: slide3,
    alt: 'Lab in a Box - Clusta Diagnostics',
  },
  {
    id: 4,
    src: slide4,
    alt: 'Comprehensive Testing Solutions - Clusta Diagnostics',
  },
  {
    id: 5,
    src: slide5,
    alt: 'Advanced Diagnostics - Clusta Diagnostics',
  },
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="relative overflow-hidden">
      {/* Slider Container */}
      <div className="relative aspect-[16/9] lg:aspect-[21/9] bg-[#d9dde2]">
        {/* Slide Images */}
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
            aria-hidden={index !== currentSlide}
          >
            <img
              src={slide.src}
              alt={slide.alt}
              className="h-full w-full object-cover"
              loading={index === 0 ? 'eager' : 'lazy'}
              decoding="async"
            />
          </div>
        ))}
      </div>

      {/* Slider Dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentSlide 
                ? 'bg-white w-8' 
                : 'bg-white/50 w-2 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;
