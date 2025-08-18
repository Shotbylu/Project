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
      videoUrl: '/videos/visual-lab-demo.mp4', // Placeholder
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
      videoUrl: '/videos/solar-dashboard-demo.mp4', // Placeholder
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
    <section id="projects" className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-10">
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
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold text-white mb-4">
            Featured Projects
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-blue-500 mx-auto mb-6 rounded-full"></div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover my latest work combining data science, marketing analytics, and creative problem-solving
          </p>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16"
        >
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              variants={cardVariants}
              className="group relative"
            >
              {/* Glassmorphism Card */}
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 h-full hover:bg-white/15 transition-all duration-500 hover:scale-105 hover:shadow-2xl">
                {/* Status Badge */}
                <div className="flex justify-between items-start mb-4">
                  <span className="text-sm font-medium text-gray-300">{project.year}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    project.status === 'Active' 
                      ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                      : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                  }`}>
                    {project.status}
                  </span>
                </div>

                {/* Video Thumbnail */}
                <div className="relative mb-6 rounded-xl overflow-hidden bg-gray-800/50 aspect-video">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button
                      onClick={() => setSelectedVideo(project.videoUrl)}
                      className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors group-hover:scale-110 transition-transform duration-300"
                    >
                      <Play size={24} className="text-white ml-1" />
                    </button>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">{project.title}</h3>
                    <p className="text-sm text-orange-400 font-medium mb-3">{project.category}</p>
                    <p className="text-gray-300 leading-relaxed">{project.description}</p>
                  </div>

                  {/* Highlights */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-white">Key Features:</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.highlights.map((highlight, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-white/10 text-gray-300 text-xs rounded-lg border border-white/20"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Tech Stack */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-white">Tech Stack:</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.techStack.map((tech, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-1 px-3 py-1 bg-gray-800/50 text-gray-300 text-xs rounded-full border border-gray-700"
                        >
                          {getTechIcon(tech)}
                          <span>{tech}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <a
                      href={project.githubUrl}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm font-medium"
                    >
                      <Github size={16} />
                      Code
                    </a>
                    <a
                      href={project.liveUrl}
                      className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors text-sm font-medium"
                    >
                      <ExternalLink size={16} />
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
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
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
                className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
              >
                <X size={32} />
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
          <p className="text-gray-300 mb-6">
            Interested in collaborating or learning more about my work?
          </p>
          <button className="bg-gradient-to-r from-orange-500 to-blue-500 hover:from-orange-600 hover:to-blue-600 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg">
            Let's Work Together
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;