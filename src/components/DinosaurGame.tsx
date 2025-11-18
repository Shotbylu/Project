import React, { useState, useEffect } from 'react';

interface CarouselItem {
  id: number;
  image: string;
  title: string;
  description?: string; // Made optional since not all items have it
}

const Carousel3D: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  // FIXED: Added closing brace '}' to the last item
  const items: CarouselItem[] = [
    {
      id: 1,
      image: '/assets/BTS/IMG_1.jpg',
      title: 'Campaign Strategy Session',
    },
    {
      id: 2,
      image: '/assets/BTS/IMG_2.jpg',
      title: 'Team Collaboration',
    },
    {
      id: 3,
      image: '/assets/BTS/IMG_3.jpg',
      title: 'Data Analysis',
    },
    {
      id: 4,
      image: '/assets/BTS/IMG_4.jpg',
      title: 'Client Presentations',
    },
    {
      id: 5,
      image: '/assets/BTS/IMG_5.jpg',
      title: 'Creative Development',
    },
    {
      id: 6,
      image: '/assets/BTS/IMG_6.jpg',
      title: 'Creative Development',
    },
    {
      id: 7,
      image: '/assets/BTS/IMG_7.jpg',
      title: 'Creative Development',
    },
    {
      id: 8,
      image: '/assets/BTS/IMG_8.jpg',
      title: 'Creative Development',
    },
    {
      id: 9,
      image: '/assets/BTS/IMG_9.jpg',
      title: 'Creative Development',
    },
    {
      id: 10,
      image: '/assets/BTS/IMG_10.jpg',
      title: 'Creative Development',
    } // <--- Missing bracket fixed here
  ];

  const rotateCarousel = (direction: 'next' | 'prev'): void => {
    if (isAnimating) return;

    setIsAnimating(true);

    if (direction === 'next') {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    } else {
      setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
    }

    setTimeout(() => setIsAnimating(false), 600);
  };

  const getCardStyle = (index: number): React.CSSProperties => {
    const diff = (index - currentIndex + items.length) % items.length;
    const isCurrent = diff === 0;
    const isNext = diff === 1;
    const isPrev = diff === items.length - 1;

    if (isCurrent) {
      return {
        transform: 'translateX(0) translateZ(200px) rotateY(0deg) scale(1.2)',
        opacity: 1,
        zIndex: 50,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      };
    } else if (isNext) {
      return {
        transform: 'translateX(280px) translateZ(0px) rotateY(-45deg) scale(0.85)',
        opacity: 0.6,
        zIndex: 40
      };
    } else if (isPrev) {
      return {
        transform: 'translateX(-280px) translateZ(0px) rotateY(45deg) scale(0.85)',
        opacity: 0.6,
        zIndex: 40
      };
    } else if (diff === 2) {
      return {
        transform: 'translateX(400px) translateZ(-100px) rotateY(-55deg) scale(0.7)',
        opacity: 0.3,
        zIndex: 30
      };
    } else {
      return {
        transform: 'translateX(-400px) translateZ(-100px) rotateY(55deg) scale(0.7)',
        opacity: 0.3,
        zIndex: 30
      };
    }
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent): void => {
      if (e.key === 'ArrowLeft') rotateCarousel('prev');
      if (e.key === 'ArrowRight') rotateCarousel('next');
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isAnimating]);

  const currentItem = items[currentIndex];

  return (
    <div className="relative min-h-screen bg-white flex items-center justify-center overflow-hidden py-20">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white via-white to-white" aria-hidden="true"></div>

      <div className="relative w-full max-w-7xl mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-12 relative z-10">
          <span className="inline-block px-4 py-1.5 bg-orange-100 text-orange-600 text-sm font-medium rounded-full mb-3">
            BEHIND THE SCENES
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            A Day in <span className="text-orange-500">My Work</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-12">
            From strategy sessions to campaign execution, here's a glimpse into my daily work environment
          </p>
        </div>

        {/* Carousel Section */}
        <div className="relative h-[500px] flex items-center justify-center mb-8" style={{ perspective: '2000px' }}>
          <div className="relative w-full h-full flex items-center justify-center preserve-3d">
            {items.map((item, index) => (
              <div
                key={item.id}
                className="absolute w-80 h-96 rounded-xl overflow-hidden shadow-xl transition-all duration-700 ease-out cursor-pointer bg-white"
                style={{
                  ...getCardStyle(index),
                  transformStyle: 'preserve-3d',
                  backfaceVisibility: 'hidden'
                }}
                onClick={() => {
                  const diff = (index - currentIndex + items.length) % items.length;
                  if (diff === 1) rotateCarousel('next');
                  else if (diff === items.length - 1) rotateCarousel('prev');
                }}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/400x600?text=Image+Not+Found';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent"></div>
                <div className="absolute inset-0 border border-gray-200 rounded-xl pointer-events-none"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Current Item Info */}
        <div className="text-center mb-8 px-4 transition-all duration-500">
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">{currentItem?.title}</h3>
          <p className="text-gray-600 max-w-xl mx-auto">{currentItem?.description || ''}</p>
        </div>

        {/* Controls */}
        <div className="flex justify-center items-center gap-6">
          <button
            onClick={() => rotateCarousel('prev')}
            disabled={isAnimating}
            aria-label="Previous image"
            className="group relative w-12 h-12 rounded-full bg-white border border-gray-200 hover:border-orange-500 hover:bg-orange-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
          >
            <svg className="w-5 h-5 text-gray-700 group-hover:text-orange-600 mx-auto transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="flex gap-2">
            {items.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (!isAnimating) {
                    setIsAnimating(true);
                    setCurrentIndex(index);
                    setTimeout(() => setIsAnimating(false), 600);
                  }
                }}
                aria-label={`Go to image ${index + 1}`}
                className={`transition-all duration-300 rounded-full ${
                  index === currentIndex
                    ? 'w-8 h-2 bg-orange-500'
                    : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => rotateCarousel('next')}
            disabled={isAnimating}
            aria-label="Next image"
            className="group relative w-12 h-12 rounded-full bg-white border border-gray-200 hover:border-orange-500 hover:bg-orange-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
          >
            <svg className="w-5 h-5 text-gray-700 group-hover:text-orange-600 mx-auto transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="text-center mt-6 text-gray-400 text-sm">
          Use arrow keys or click to navigate • {currentIndex + 1} of {items.length}
        </div>
      </div>
    </div>
  );
};

export default Carousel3D;
