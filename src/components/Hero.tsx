import React from 'react';
import { Github, Linkedin, Mail, FileText, ExternalLink, Folder } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero = () => {
    const socialLinks = [
    { icon: Github, href: 'https://github.com/Shotbylu', label: 'GitHub' },
    { icon: Linkedin, href: 'https://www.linkedin.com/in/lungelo-sibisi-6745aa21b', label: 'LinkedIn' },
    { icon: Mail, href: 'mailto:lsibisi@icloud.com', label: 'Email' },
  ];

  const scrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Updated download functions with better error handling and MIME type specification

const downloadCV = async () => {
  try {
    // First, try to fetch the file to check if it exists
    const response = await fetch('/assets/documents/Lungelo_Sibisi_CV.pdf');
    
    if (!response.ok) {
      console.error('CV file not found');
      alert('CV file not found. Please contact the administrator.');
      return;
    }
    
    // Create blob with explicit PDF MIME type
    const blob = await response.blob();
    const pdfBlob = new Blob([blob], { type: 'application/pdf' });
    
    // Create download link
    const link = document.createElement('a');
    link.href = URL.createObjectURL(pdfBlob);
    link.download = 'Lungelo_Sibisi_CV.pdf';
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the URL object
    URL.revokeObjectURL(link.href);
  } catch (error) {
    console.error('Error downloading CV:', error);
    // Fallback: open in new tab
    window.open('/assets/documents/Lungelo_Sibisi_CV.pdf', '_blank');
  }
};

const downloadPortfolio = async () => {
  try {
    // First, try to fetch the file to check if it exists
    const response = await fetch('/assets/documents/Lungelo_Sibisi_Portfolio.pdf');
    
    if (!response.ok) {
      console.error('Portfolio file not found');
      alert('Portfolio file not found. Please contact the administrator.');
      return;
    }
    
    // Create blob with explicit PDF MIME type
    const blob = await response.blob();
    const pdfBlob = new Blob([blob], { type: 'application/pdf' });
    
    // Create download link
    const link = document.createElement('a');
    link.href = URL.createObjectURL(pdfBlob);
    link.download = 'Lungelo_Sibisi_Portfolio.pdf';
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the URL object
    URL.revokeObjectURL(link.href);
  } catch (error) {
    console.error('Error downloading Portfolio:', error);
    // Fallback: open in new tab
    window.open('/assets/documents/Lungelo_Sibisi_Portfolio.pdf', '_blank');
  }
};
  
  return (
    <section id="reception" className="min-h-screen bg-gradient-to-br from-gray-50 to-white relative overflow-hidden pt-20">
      {/* Background Code Hints */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-20 left-10 text-4xl sm:text-6xl font-mono text-gray-400">&lt;html&gt;</div>
        <div className="absolute top-40 right-20 text-2xl sm:text-4xl font-mono text-gray-400">&lt;body&gt;</div>
        <div className="absolute bottom-40 left-20 text-3xl sm:text-5xl font-mono text-gray-400">&lt;/html&gt;</div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-6 sm:space-y-8">
            {/* Name & Role */}
            <motion.div 
              className="space-y-3 sm:space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Lungelo Sibisi<span className="text-orange-500">.</span>
              </h1>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-700">
                Marketing Analytics & Communications Specialist
              </h2>
            </motion.div>

            {/* Availability Badge */}
            <motion.div 
              className="inline-flex items-center px-3 sm:px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              Available for new projects
            </motion.div>

            {/* Bio */}
            <motion.p 
              className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Hey there stranger, I'm Lungelo, a marketing, analytics, and communications specialist who loves coding and building tools to make everything I do easier. With a background in sales and three years in marketing and data analysis, I create campaigns that are both creative and measurable. I design visuals in Adobe, handle data with Python and SQL on Azure and AWS, and build dashboards in Power BI so stakeholders actually understand the story. CRMs (Zoho, HubSpot, Salesforce) are always on autopilot. Currently based in Johannesburg, if you want a marketer who's creative, data-driven, and a little technical, check out my portfolio and let's chat!
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4"
            >
              <button
                onClick={scrollToProjects}
                className="px-4 sm:px-6 py-3 bg-[#FF6B00] text-white rounded-2xl font-semibold hover:bg-orange-600 transition-all duration-200 hover:scale-105 text-sm sm:text-base"
              >
                See my projects
              </button>
              <button
                onClick={scrollToContact}
                className="px-4 sm:px-6 py-3 border border-gray-300 text-gray-700 rounded-2xl font-semibold hover:bg-gray-50 transition-all duration-200 hover:scale-105 text-sm sm:text-base"
              >
                Contact me
              </button>
              <button 
                onClick={downloadCV}
                className="px-4 sm:px-6 py-3 bg-[#0f1a2b] text-white rounded-2xl font-semibold hover:bg-gray-800 transition-all duration-200 hover:scale-105 flex items-center justify-center space-x-2 text-sm sm:text-base"
              >
                <FileText size={18} className="sm:w-5 sm:h-5" />
                <span>Download CV</span>
              </button>
              <button 
                onClick={downloadPortfolio}
                className="px-4 sm:px-6 py-3 border border-gray-300 text-gray-700 rounded-2xl font-semibold hover:bg-gray-50 transition-all duration-200 hover:scale-105 flex items-center justify-center space-x-2 text-sm sm:text-base"
              >
                <Folder size={18} className="sm:w-5 sm:h-5" />
                <span>Download Portfolio</span>
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex space-x-4"
            >
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    aria-label={social.label}
                  >
                    <social.icon size={20} className="sm:w-6 sm:h-6" />
                  </a>
                ))}
            </motion.div>
          </div>

          {/* Right Column - Code Block */}
          <motion.div 
            className="lg:pl-8 mt-8 lg:mt-0"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="bg-gray-900 rounded-xl p-4 sm:p-6 shadow-2xl border border-gray-800 relative overflow-hidden">
              {/* Terminal Header */}
              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-700">
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="text-gray-400 text-xs sm:text-sm font-mono ml-4">profile.js</div>
              </div>

              {/* Code Content */}
              <div className="font-mono text-xs sm:text-sm space-y-2">
                <div className="text-purple-400">const <span className="text-yellow-300">Lungelo Sibisi</span> = {`{`}</div>
                <div className="ml-4 text-blue-300">Expertise: <span className="text-green-300">[</span></div>
                <div className="ml-8 text-orange-300">"Marketing & Communications",</div>
                <div className="ml-8 text-orange-300">"Data Analysis & Cloud (Azure • AWS)",</div>
                <div className="ml-8 text-orange-300">"Graphic design & Web Development"</div>
                <div className="ml-4 text-green-300">],</div>
                <div className="ml-4">
                  <span className="text-blue-300">location:</span> <span className="text-orange-300">"Johannesburg, South Africa"</span>,
                </div>
                <div className="ml-4 text-blue-300">technologies: <span className="text-green-300">[</span></div>
                <div className="ml-8 text-orange-300">"Python", "Power BI", "Adobe Creative Suite",</div>
                <div className="ml-8 text-orange-300">"CRM Tools", "Azure & AWS Data Services"</div>
                <div className="ml-4 text-green-300">],</div>
                <div className="ml-4">
                  <span className="text-blue-300">available:</span> <span className="text-green-400">true</span>
                </div>
                <div className="text-purple-400">{`};`}</div>
              </div>

              {/* Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/20 to-blue-500/20 rounded-xl blur opacity-75"></div>
            </div>
          </motion.div>
        </div>

        {/* Profile Image Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex justify-center mt-12 sm:mt-16 lg:mt-20"
        >
          <div className="relative">
            {/* Background Circle */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-blue-500/20 rounded-full blur-xl scale-110"></div>
            
            {/* Profile Image Container */}
            <div className="relative bg-gradient-to-br from-orange-500 to-blue-500 p-1 rounded-full shadow-2xl">
              <div className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 rounded-full overflow-hidden border-4 border-white shadow-lg">
                                 <img
                   src="/assets/documents/Lungelo_DP.png"
                   alt="Lungelo Sibisi - Marketing Analytics & Communications Specialist"
                   className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to a gradient background if image fails to load
                    e.currentTarget.style.background = 'linear-gradient(135deg, #FF6B00, #0f1a2b)';
                    e.currentTarget.style.display = 'flex';
                    e.currentTarget.style.alignItems = 'center';
                    e.currentTarget.style.justifyContent = 'center';
                    e.currentTarget.style.color = 'white';
                    e.currentTarget.style.fontSize = '2rem';
                    e.currentTarget.style.fontWeight = 'bold';
                    e.currentTarget.textContent = 'LS';
                  }}
                />
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-orange-500/20 rounded-full blur-sm animate-pulse"></div>
            <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-blue-500/20 rounded-full blur-sm animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 -right-8 w-4 h-4 bg-orange-500/30 rounded-full blur-sm animate-pulse delay-500"></div>
            <div className="absolute top-1/2 -left-8 w-5 h-5 bg-blue-500/30 rounded-full blur-sm animate-pulse delay-1500"></div>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="flex justify-center mt-8 sm:mt-12"
        >
          <div className="flex flex-col items-center space-y-2">
            <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="w-1 h-3 bg-gray-400 rounded-full mt-2"
              ></motion.div>
            </div>
            <span className="text-xs text-gray-500 font-medium">Scroll to explore</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
