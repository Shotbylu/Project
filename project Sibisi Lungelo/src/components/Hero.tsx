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
  
  return (
    <section id="reception" className="min-h-screen bg-gradient-to-br from-gray-50 to-white relative overflow-hidden pt-20">
      {/* Background Code Hints */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-20 left-10 text-6xl font-mono text-gray-400">&lt;html&gt;</div>
        <div className="absolute top-40 right-20 text-4xl font-mono text-gray-400">&lt;body&gt;</div>
        <div className="absolute bottom-40 left-20 text-5xl font-mono text-gray-400">&lt;/html&gt;</div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">
            {/* Name & Role */}
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Lungelo Sibisi<span className="text-orange-500">.</span>
              </h1>
              <h2 className="text-2xl lg:text-3xl font-bold text-blue-700">
                Communications & Marketing Analytics Specialist
              </h2>
            </motion.div>

            {/* Availability Badge */}
            <motion.div 
              className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              Available for new projects
            </motion.div>

            {/* Bio */}
            <motion.p 
              className="text-lg text-gray-600 leading-relaxed max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Hi, I'm Lungelo, a Communications & Marketing Analytics Specialist who loves mixing creativity with data. With three years in marketing and five years in sales, I build campaigns grounded in insights and designed to connect. I create visuals in Adobe Creative Suite, analyse trends using Python and SQL on Azure, and bring reports to life in Power BI and Excel. I keep everything running smoothly in Zoho, Salesforce, and HubSpot, and automate reports with Power Automate so you always have the latest numbers. Get to know me by exploring my portfolio website!
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-4"
            >
              <button
                onClick={scrollToProjects}
                className="px-6 py-3 bg-[#FF6B00] text-white rounded-2xl font-semibold hover:bg-orange-600 transition-all duration-200 hover:scale-105"
              >
                See my projects
              </button>
              <button
                onClick={scrollToContact}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-2xl font-semibold hover:bg-gray-50 transition-all duration-200 hover:scale-105"
              >
                Contact me
              </button>
              <button className="px-6 py-3 bg-[#0f1a2b] text-white rounded-2xl font-semibold hover:bg-gray-800 transition-all duration-200 hover:scale-105 flex items-center space-x-2">
                <FileText size={20} />
                <span>See my CV</span>
              </button>
              <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-2xl font-semibold hover:bg-gray-50 transition-all duration-200 hover:scale-105 flex items-center space-x-2">
                <Folder size={20} />
                <span>See my portfolio</span>
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
                    <social.icon size={24} />
                  </a>
                ))}
            </motion.div>
          </div>

          {/* Right Column - Code Block */}
          <motion.div 
            className="lg:pl-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="bg-gray-900 rounded-xl p-6 shadow-2xl border border-gray-800 relative overflow-hidden">
              {/* Terminal Header */}
              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-700">
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="text-gray-400 text-sm font-mono ml-4">profile.js</div>
              </div>

              {/* Code Content */}
              <div className="font-mono text-sm space-y-2">
                <div className="text-purple-400">const <span className="text-yellow-300">Lungelo</span> = {`{`}</div>
                <div className="ml-4 text-blue-300">Expertise: <span className="text-green-300">[</span></div>
                <div className="ml-8 text-orange-300">"Communications & Marketing Analytics",</div>
                <div className="ml-8 text-orange-300">"Data Analysis & Visualization",</div>
                <div className="ml-8 text-orange-300">"B2B Marketing & Campaign Management"</div>
                <div className="ml-4 text-green-300">],</div>
                <div className="ml-4">
                  <span className="text-blue-300">location:</span> <span className="text-orange-300">"Sandton, South Africa"</span>,
                </div>
                <div className="ml-4 text-blue-300">technologies: <span className="text-green-300">[</span></div>
                <div className="ml-8 text-orange-300">"Python", "Power BI", "Adobe Creative Suite",</div>
                <div className="ml-8 text-orange-300">"CRM Tools", "Azure Data Services"</div>
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
      </div>
    </section>
  );
};

export default Hero;