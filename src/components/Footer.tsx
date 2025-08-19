import React from 'react';
import { Heart, Github, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">
              Lungelo<span className="text-orange-500">.</span>
            </h3>
            <p className="text-gray-400 leading-relaxed">
              Creative storyteller + marketing analyst, measurable campaigns, clear insights.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <div className="space-y-2">
              <a href="#reception" className="block text-gray-400 hover:text-white transition-colors">
                Home
              </a>
              <a href="#skills" className="block text-gray-400 hover:text-white transition-colors">
                Skills
              </a>
              <a href="#background" className="block text-gray-400 hover:text-white transition-colors">
                Background
              </a>
              <a href="#contact" className="block text-gray-400 hover:text-white transition-colors">
                Contact
              </a>
            </div>
          </div>

          {/* Contact & Social */}
<div className="space-y-4">
  <h4 className="text-lg font-semibold">Get In Touch</h4>
  <p className="text-gray-400">lsibisi@icloud.com</p>
  <p className="text-gray-400">Johannesburg, South Africa</p>
  
  <div className="flex gap-4 pt-2">
    <a
      href="https://github.com/Shotbylu"
      target="_blank"
      rel="noopener noreferrer"
      className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
      aria-label="GitHub"
    >
      <Github size={20} />
    </a>
    <a
      href="https://www.linkedin.com/in/lungelo-sibisi-6745aa21b"
      target="_blank"
      rel="noopener noreferrer"
      className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
      aria-label="LinkedIn"
    >
      <Linkedin size={20} />
    </a>
    <a
      href="mailto:lsibisi@icloud.com"
      className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
      aria-label="Email"
    >
      <Mail size={20} />
    </a>
  </div>
</div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2025 Lungelo Sibisi. All rights reserved.
            </p>
            <p className="text-gray-400 text-sm flex items-center gap-1">
              Made with <Heart size={16} className="text-red-500" /> in South Africa
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
