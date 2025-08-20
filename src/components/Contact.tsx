import React, { useState, useEffect } from 'react';
import { Mail, MapPin, Linkedin, Github, FileText, Send, Eye, CheckCircle, AlertCircle, Calendar, Code, Activity, Star } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    subject: 'Inquiry',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [emailJSLoaded, setEmailJSLoaded] = useState(false);
  const [githubData, setGithubData] = useState(null);
  const [githubLoading, setGithubLoading] = useState(true);

  // Load EmailJS script
  useEffect(() => {
    if (window.emailjs) {
      setEmailJSLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
    script.async = true;
    
    script.onload = () => {
      window.emailjs.init('M6P-QvPnvJyyNU6fn');
      setEmailJSLoaded(true);
    };
    
    script.onerror = () => {
      console.error('Failed to load EmailJS');
    };
    
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  // Fetch GitHub data (without token for security)
  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        const response = await fetch('https://api.github.com/users/Shotbylu');
        const data = await response.json();
        setGithubData(data);
      } catch (error) {
        console.error('Failed to fetch GitHub data:', error);
      } finally {
        setGithubLoading(false);
      }
    };

    fetchGitHubData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!emailJSLoaded) {
      setSubmitStatus('error');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const serviceID = 'service_bx7vrfe';
      const templateID = 'template_gcdk229';
      const publicKey = 'M6P-QvPnvJyyNU6fn';

      const templateParams = {
        from_name: formData.fullName,
        from_email: formData.email,
        subject: formData.subject,
        message: formData.message,
        to_name: 'Your Name',
      };

      const response = await window.emailjs.send(
        serviceID,
        templateID,
        templateParams,
        publicKey
      );

      console.log('Email sent successfully:', response);
      setSubmitStatus('success');
      
      setFormData({
        fullName: '',
        email: '',
        subject: 'Inquiry',
        message: ''
      });

    } catch (error) {
      console.error('Email sending failed:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      
      setTimeout(() => {
        setSubmitStatus(null);
      }, 5000);
    }
  };

  return (
    <section id="contact" className="py-12 sm:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-orange-500 mb-4">
            Get in Touch
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            I'd love to hear about your ideas or opportunities!
          </p>
        </div>

        {/* GitHub Activity Section */}
        <div className="mb-12 sm:mb-16">
          <div className="text-center mb-6 sm:mb-8">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2 sm:gap-3">
              <Code className="text-orange-500" size={24} className="sm:w-7 sm:h-7" />
              GitHub Activity
            </h3>
            <p className="text-gray-600 text-sm sm:text-base">My coding journey and contributions</p>
          </div>
          
          <div className="bg-gradient-to-br from-gray-50 to-orange-50 rounded-2xl p-6 sm:p-8 border border-gray-200">
            {githubLoading ? (
              <div className="flex items-center justify-center py-8 sm:py-12">
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                  Loading GitHub activity...
                </div>
              </div>
            ) : (
              <>
                {/* GitHub Stats */}
                {githubData && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
                    <div className="bg-white rounded-xl p-3 sm:p-4 border border-gray-200 flex items-center gap-2 sm:gap-3">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <Github className="text-orange-600" size={18} className="sm:w-5 sm:h-5" />
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm text-gray-600">Public Repos</p>
                        <p className="text-lg sm:text-xl font-bold text-gray-900">{githubData.public_repos}</p>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-xl p-3 sm:p-4 border border-gray-200 flex items-center gap-2 sm:gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Star className="text-blue-600" size={18} className="sm:w-5 sm:h-5" />
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm text-gray-600">Following</p>
                        <p className="text-lg sm:text-xl font-bold text-gray-900">{githubData.following}</p>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-xl p-3 sm:p-4 border border-gray-200 flex items-center gap-2 sm:gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Calendar className="text-green-600" size={18} className="sm:w-5 sm:h-5" />
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm text-gray-600">Member Since</p>
                        <p className="text-lg sm:text-xl font-bold text-gray-900">
                          {new Date(githubData.created_at).getFullYear()}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* GitHub Badges Section */}
                <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 mb-4 sm:mb-6">
                  <div className="text-center mb-4 sm:mb-6">
                    <p className="text-base sm:text-lg font-semibold text-gray-800 mb-4">GitHub Badges</p>
                  </div>
                  
                  <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
                    <img 
                      src="https://img.shields.io/github/followers/Shotbylu?style=for-the-badge&logo=github&logoColor=white&color=orange" 
                      alt="GitHub Followers"
                      className="hover:scale-105 transition-transform duration-200 max-w-full h-auto"
                    />
                    <img 
                      src="https://img.shields.io/github/stars/Shotbylu?affiliations=OWNER%2CCOLLABORATOR&style=for-the-badge&logo=github&logoColor=white&color=blue" 
                      alt="GitHub Stars"
                      className="hover:scale-105 transition-transform duration-200 max-w-full h-auto"
                    />
                    <img 
                      src="https://img.shields.io/badge/Profile%20Views-Dynamic-brightgreen?style=for-the-badge&logo=github" 
                      alt="Profile Views"
                      className="hover:scale-105 transition-transform duration-200 max-w-full h-auto"
                    />
                  </div>
                  
                  <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mt-3 sm:mt-4">
                    <img 
                      src="https://github-readme-stats.vercel.app/api?username=Shotbylu&show_icons=true&theme=default&hide_border=true&bg_color=f9fafb&title_color=f97316&icon_color=f97316" 
                      alt="GitHub Stats"
                      className="rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 max-w-full h-auto"
                    />
                  </div>
                  
                  <div className="flex justify-center mt-3 sm:mt-4">
                    <img 
                      src="https://github-readme-streak-stats.herokuapp.com/?user=Shotbylu&theme=default&hide_border=true&background=f9fafb&ring=f97316&fire=f97316&currStreakLabel=374151" 
                      alt="GitHub Streak"
                      className="rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 max-w-full h-auto"
                    />
                  </div>
                </div>

                {/* Real GitHub Contribution Calendar */}
                <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200">
                  <div className="text-center mb-4 sm:mb-6">
                    <p className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Contribution Calendar</p>
                  </div>
                  
                  <div className="flex justify-center">
                    <img 
                      src="https://ghchart.rshah.org/f97316/Shotbylu" 
                      alt="GitHub Contribution Calendar"
                      className="rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 max-w-full h-auto"
                      style={{ filter: 'brightness(1.1)' }}
                    />
                  </div>
                  
                  {/* Legend */}
                  <div className="flex items-center justify-between mt-3 sm:mt-4 text-xs text-gray-500">
                    <span>Less</span>
                    <div className="flex gap-1">
                      <div className="w-3 h-3 rounded-sm bg-gray-100"></div>
                      <div className="w-3 h-3 rounded-sm bg-orange-200"></div>
                      <div className="w-3 h-3 rounded-sm bg-orange-300"></div>
                      <div className="w-3 h-3 rounded-sm bg-orange-400"></div>
                      <div className="w-3 h-3 rounded-sm bg-orange-500"></div>
                    </div>
                    <span>More</span>
                  </div>
                  
                  <div className="flex justify-center mt-3 sm:mt-4">
                    <a 
                      href="https://github.com/Shotbylu" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors duration-200 font-medium text-sm sm:text-base"
                    >
                      <Github size={18} className="sm:w-5 sm:h-5" />
                      View on GitHub
                    </a>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Status Messages */}
        {submitStatus && (
          <div className={`max-w-md mx-auto mb-6 sm:mb-8 p-3 sm:p-4 rounded-lg flex items-center gap-2 sm:gap-3 ${
            submitStatus === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {submitStatus === 'success' ? (
              <CheckCircle size={18} className="text-green-600 sm:w-5 sm:h-5" />
            ) : (
              <AlertCircle size={18} className="text-red-600 sm:w-5 sm:h-5" />
            )}
            <span className="text-sm sm:text-base">
              {submitStatus === 'success' 
                ? 'Message sent successfully! I\'ll get back to you soon.' 
                : 'Failed to send message. Please try again or email me directly.'}
            </span>
          </div>
        )}

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
          {/* Left Column - Contact Info */}
          <div className="space-y-6 sm:space-y-8">
            {/* Contact Information */}
            <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Contact Information</h3>
              
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Mail size={18} className="text-orange-600 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm sm:text-base">Email</p>
                    <a 
                      href="mailto:lsibisi@icloud.com"
                      className="text-gray-600 hover:text-orange-600 transition-colors text-sm sm:text-base"
                    >
                      lsibisi@icloud.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <MapPin size={18} className="text-orange-600 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm sm:text-base">Location</p>
                    <p className="text-gray-600 text-sm sm:text-base">Johannesburg, South Africa</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Connect With Me</h3>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <a
                  href="https://www.linkedin.com/in/lungelo-sibisi-6745aa21b"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 sm:gap-3 p-3 bg-white rounded-lg hover:shadow-md transition-all duration-200 hover:scale-105"
                >
                  <Linkedin size={18} className="text-blue-600 sm:w-5 sm:h-5" />
                  <span className="font-medium text-gray-700 text-sm sm:text-base">LinkedIn</span>
                </a>
                
                <a
                  href="https://github.com/Shotbylu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 sm:gap-3 p-3 bg-white rounded-lg hover:shadow-md transition-all duration-200 hover:scale-105"
                >
                  <Github size={18} className="text-gray-600 sm:w-5 sm:h-5" />
                  <span className="font-medium text-gray-700 text-sm sm:text-base">GitHub</span>
                </a>
              </div>
            </div>

            {/* Availability Status */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 sm:p-6">
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <h3 className="text-base sm:text-lg font-bold text-green-800">Available Now</h3>
              </div>
              <p className="text-green-700 text-sm sm:text-base">
                I am currently open to freelance work and collaborations. Let's discuss your next project!
              </p>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="bg-gray-50 rounded-xl p-6 sm:p-8">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Send me a message</h3>
            
            <div className="space-y-4 sm:space-y-6">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                  Full name *
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  <option value="Inquiry">General Inquiry</option>
                  <option value="Collaboration">Collaboration Opportunity</option>
                  <option value="Job Opportunity">Job Opportunity</option>
                  <option value="Freelance Project">Freelance Project</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  rows={5}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 resize-none disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                  placeholder="Tell me about your project or idea..."
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !emailJSLoaded || !formData.fullName || !formData.email || !formData.message}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:transform-none text-sm sm:text-base"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={16} className="sm:w-4 sm:h-4" />
                      Send Message
                    </>
                  )}
                </button>
                
                <button
                  type="button"
                  disabled={isSubmitting}
                  className="flex-1 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <Eye size={16} className="sm:w-4 sm:h-4" />
                  View Portfolio
                </button>
              </div>

              {!emailJSLoaded && (
                <div className="text-xs sm:text-sm text-gray-500 text-center">
                  Loading email service...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
