import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import ReactPlayer from 'react-player';
import { ExternalLink, Github, Play, X, Database, BarChart3, Palette, Code, TrendingUp, Users } from 'lucide-react';

const Projects = () => {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const projects = [
    {
      id: 1,
      title: 'Visual Lab',
      description: 'A comprehensive Data Science SaaS platform that empowers data scientists with intuitive tools for dataset exploration, real-time analysis, and machine learning model training, all without the complexity. The platform simplifies end-to-end workflows by leveraging powerful algorithms and automation to turn raw data into actionable insights.',
      category: 'Data Science Platform',
      techStack: ['Python', 'React', 'Machine Learning', 'API Integration', 'Cloud Services'],
      videoUrl: '#',
      githubUrl: '#',
      liveUrl: '#',
      year: '2024',
      status: 'Completed',
      highlights: ['ML Model Training', 'Dataset Analysis', 'User-Friendly Interface', 'Cloud Integration']
    },
    {
      id: 2,
      title: 'Motion-Controlled Ping Pong Game',
      description: 'A fully interactive game using only raw computer vision logic. No machine learning shortcuts, just OpenCV, creative problem-solving, and a webcam. It’s fast, fun, and a great testbed for real-time CV applications. Designed from scratch to explore computer vision & image processing.',
      category: 'Software Development',
      techStack: ['OpenCV', 'Python', 'Anaconda', 'NumPy'],
      videoUrl: '/assets/documents/Ping-pong video.mp4',
      githubUrl: '#',
      liveUrl: '#',
      year: '2025',
      status: 'Completed',
      highlights: ['motion detection algorithms', 'computer vision', 'Webcam integration', 'image processing']
    },
    {
      id: 3,
      title: 'SEMO Growth Marketing',
      description: 'Strategic digital marketing campaign focused on boosting SME online presence through data-driven approaches and modern digital marketing tools.',
      category: 'Digital Marketing',
      techStack: ['HubSpot', 'Google Analytics', 'Social Media APIs', 'SEO Tools', 'Content Management'],
      videoUrl: '/videos/semo-campaign-demo.mp4', // Placeholder
      githubUrl: '#',
      liveUrl: '#',
      year: '2024',
      status: 'Completed',
      highlights: ['Lead Generation', 'Brand Awareness', 'Digital Strategy', 'Performance Metrics']
    }
  ];

  const getTechIcon = (tech: string) => {
    const iconMap: { [key: string]: any } = {
      'Python': Code,
      'React': Code,
      'Power BI': BarChart3,
      'SQL': Database,
      'Machine Learning': TrendingUp,
      'HubSpot': Users,
      'Google Analytics': BarChart3,
      'Azure': Database,
      'Data Visualization': BarChart3,
      'API Integration': Code,
      'Cloud Services': Database,
      'Excel': BarChart3,
      'SEO Tools': TrendingUp,
      'Social Media APIs': Users,
      'Content Management': Palette
    };
    
    const IconComponent = iconMap[tech] || Code;
    return <IconComponent size={16} />;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section id="projects" className="py-12 sm:py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Featured Projects
          </h2>
          <div className="w-20 sm:w-24 h-1 bg-gradient-to-r from-orange-500 to-blue-500 mx-auto mb-4 sm:mb-6 rounded-full"></div>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Discover my latest work combining data science, marketing analytics, and creative problem-solving
          </p>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16"
        >
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              variants={cardVariants}
              className="group relative"
            >
              {/* Project Card */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 h-full hover:shadow-xl transition-all duration-500 hover:scale-105">
                {/* Status Badge */}
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs sm:text-sm font-medium text-gray-500">{project.year}</span>
                  <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                    project.status === 'Active' 
                      ? 'bg-green-100 text-green-700 border border-green-200' 
                      : 'bg-blue-100 text-blue-700 border border-blue-200'
                  }`}>
                    {project.status}
                  </span>
                </div>

                {/* Video Thumbnail */}
                <div className="relative mb-4 rounded-xl overflow-hidden bg-gray-100 aspect-video">
                                     {/* Thumbnail Image for Motion-Controlled Ping Pong Game */}
                   {project.id === 2 && (
                     <img 
                       src="/assets/documents/ping-pong-thumbnail.png" 
                       alt="Motion-Controlled Ping Pong Game" 
                       className="absolute inset-0 w-full h-full object-cover"
                       onError={(e) => {
                         // Fallback to gray background if image fails to load
                         e.currentTarget.style.display = 'none';
                       }}
                     />
                   )}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button
                      onClick={() => setSelectedVideo(project.videoUrl)}
                      className="w-12 h-12 sm:w-16 sm:h-16 bg-orange-500 rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors group-hover:scale-110 transition-transform duration-300"
                    >
                      <Play size={20} className="text-white ml-1 sm:w-6 sm:h-6" />
                    </button>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 to-transparent"></div>
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{project.title}</h3>
                    <p className="text-sm text-orange-600 font-medium mb-2">{project.category}</p>
                    <p className="text-gray-600 leading-relaxed text-sm line-clamp-3">{project.description}</p>
                  </div>

                  {/* Highlights */}
                  <div className="space-y-2">
                    <h4 className="text-xs sm:text-sm font-semibold text-gray-800">Key Features:</h4>
                    <div className="flex flex-wrap gap-1">
                      {project.highlights.slice(0, 3).map((highlight, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-orange-50 text-orange-700 text-xs rounded-lg border border-orange-200"
                        >
                          {highlight}
                        </span>
                      ))}
                      {project.highlights.length > 3 && (
                        <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-lg border border-gray-200">
                          +{project.highlights.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Tech Stack */}
                  <div className="space-y-2">
                    <h4 className="text-xs sm:text-sm font-semibold text-gray-800">Tech Stack:</h4>
                    <div className="flex flex-wrap gap-1">
                      {project.techStack.slice(0, 4).map((tech, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-200"
                        >
                          {getTechIcon(tech)}
                          <span>{tech}</span>
                        </div>
                      ))}
                      {project.techStack.length > 4 && (
                        <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-full border border-gray-200">
                          +{project.techStack.length - 4}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-3">
                    <a
                      href={project.githubUrl}
                      className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-xs sm:text-sm font-medium"
                    >
                      <Github size={14} className="sm:w-4 sm:h-4" />
                      Code
                    </a>
                    <a
                      href={project.liveUrl}
                      className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors text-xs sm:text-sm font-medium"
                    >
                      <ExternalLink size={14} className="sm:w-4 sm:h-4" />
                      Live Demo
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Video Modal */}
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4"
            onClick={() => setSelectedVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-w-4xl w-full aspect-video"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedVideo(null)}
                className="absolute -top-8 sm:-top-12 right-0 text-white hover:text-gray-300 transition-colors"
              >
                <X size={24} className="sm:w-8 sm:h-8" />
              </button>
              <div className="w-full h-full bg-gray-900 rounded-xl overflow-hidden">
                <ReactPlayer
                  url={selectedVideo}
                  width="100%"
                  height="100%"
                  controls
                  playing
                  fallback={
                    <div className="w-full h-full flex items-center justify-center text-white">
                      <p>Video demo coming soon...</p>
                    </div>
                  }
                />
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center"
        >
          <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
            Interested in collaborating or learning more about my work?
          </p>
          <button className="bg-gradient-to-r from-orange-500 to-blue-500 hover:from-orange-600 hover:to-blue-600 text-white px-6 sm:px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg text-sm sm:text-base">
            Let's Work Together
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
