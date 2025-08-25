import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Award } from 'lucide-react';

const Skills = () => {
  const [activeTab, setActiveTab] = useState('Development');

  const tabs = ['Marketing Management', 'Design', 'Development'];

  const skillsData = {
    'Marketing Management': [
      { name: 'Marketing Automation & CRM (Microsoft Dynamics 365)', level: 95 },
      { name: 'Digital Marketing Strategy & Campaign Execution', level: 90 },
      { name: 'Paid Media (Google Ads, Meta, LinkedIn, Programmatic)', level: 88 },
      { name: 'E-commerce & Conversion Rate Optimisation(CRO)', level: 70 },
      { name: 'Sustainability & ESD Communication Strategy', level: 85 },
      { name: 'Social Media Management (Content Creation)', level: 90 },
    ],
    'Design': [
      { name: 'Adobe Creative Suite (Photoshop, Illustrator, InDesign, After Effects, Premiere Pro)', level: 70 },
      { name: 'Branding & Visual Identity (Logos, Typography, Color Theory, Style Guides)', level: 90 },
      { name: 'UX/UI & Digital Design (Figma, Wireframing, Prototyping)', level: 70 },
      { name: 'Photo Editing & Retouching (Lightroom, Photoshop)', level: 82 },
      { name: 'Infographics & Data Visualization', level: 80 },
      { name: 'Canva & Social Media Design', level: 80 }
    ],
    'Development': [
      { name: 'Excel & Advanced Spreadsheets (Formulas, Pivot Tables, Macros)', level: 50 },
      { name: 'Power BI (Dashboards, Data Visualization, Reporting)', level: 70 },
      { name: 'Data Analysis & Analytics (SQL, Python, ETL/ELT)', level: 50 },
      { name: 'Power Automate (Workflow Automation, Process Optimization)', level: 72 },
      { name: 'Azure Cloud Services (Data Storage, Analytics, BI Integration)', level: 70 },
      { name: 'WordPress (Website Development & CMS Management)', level: 70 }
    ],
  };

  const certifications = [
    'Microsoft - Azure Data Fundamentals (DP-900)',
    'Adobe - Photoshop Essential Skills',
    'Microsoft - Career Essentials in Data Analysis',
    'Google - Digital Marketing Certification',
    'Johns Hopkins University - Advanced Statistics for Data Science',
  ];

  const getSkillLevel = (level: number) => {
    if (level >= 85) return 'Expert';
    if (level >= 70) return 'Advanced';
    if (level >= 50) return 'Intermediate';
    return 'Beginner';
  };

  return (
    <section id="skills" className="py-12 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0f1a2b] mb-4">
            My Skills
            <div className="w-16 sm:w-20 h-1 bg-[#FF6B00] mx-auto mt-2"></div>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            With a unique blend of marketing insight, development skills, and design thinking, I contribute end-to-end across digital projects, from strategy and UX to execution and optimisation.
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center mb-8 sm:mb-12"
        >
          <div className="flex flex-wrap sm:flex-nowrap gap-2 sm:gap-3 bg-gray-100 rounded-2xl p-2">
            {['Marketing Management', 'Design', 'Development'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold transition-all duration-200 text-sm sm:text-base whitespace-nowrap ${
                  activeTab === tab
                    ? 'bg-[#FF6B00] text-white shadow-lg'
                    : 'text-gray-600 hover:text-[#FF6B00]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Skills Grid */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16"
        >
          {skillsData[activeTab as keyof typeof skillsData].map((skill, index) => (
            <div
              key={skill.name}
              className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-200"
            >
              <div className="flex justify-between items-center mb-3 sm:mb-4">
                <h3 className="font-semibold text-[#0f1a2b] text-sm sm:text-base">{skill.name}</h3>
                <span className="text-xs sm:text-sm text-gray-500 font-medium">
                  {getSkillLevel(skill.level)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 sm:h-2.5">
                <motion.div
                  className="bg-indigo-600 h-2 sm:h-2.5 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${skill.level}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                />
              </div>
              <div className="mt-2 text-right text-xs sm:text-sm text-gray-500">
                {skill.level}%
              </div>
            </div>
          ))}
        </motion.div>

        {/* Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 sm:p-8"
        >
          <div className="flex items-center justify-center mb-4 sm:mb-6">
            <Award className="text-[#1f3bff] mr-3" size={24} className="sm:w-8 sm:h-8" />
            <h3 className="text-xl sm:text-2xl font-bold text-[#0f1a2b]">Certifications & Training</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {certifications.map((cert, index) => (
              <div
                key={index}
                className="bg-white p-3 sm:p-4 rounded-xl shadow-md flex items-center space-x-2 sm:space-x-3"
              >
                <Award className="text-[#1f3bff] flex-shrink-0" size={16} className="sm:w-5 sm:h-5" />
                <span className="text-xs sm:text-sm font-medium text-gray-700">{cert}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Tools and Languages Stack */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 sm:mt-16"
        >
          <div className="text-center mb-8 sm:mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-[#0f1a2b] mb-4">
              Languages and Tools
            </h3>
            <div className="w-16 sm:w-20 h-1 bg-[#FF6B00] mx-auto mb-4"></div>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              My technical toolkit for building innovative solutions
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100">
            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-4 sm:gap-6">
              {/* Row 1 */}
              <div className="flex flex-col items-center group">
                <div className="p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-orange-50 transition-all duration-300 group-hover:scale-110 mb-2">
                  <img src="https://skillicons.dev/icons?i=azure" alt="Azure" className="w-8 h-8 sm:w-10 sm:h-10" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-700 text-center">Azure</span>
              </div>

              <div className="flex flex-col items-center group">
                <div className="p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-orange-50 transition-all duration-300 group-hover:scale-110 mb-2">
                  <img src="https://skillicons.dev/icons?i=aws" alt="AWS" className="w-8 h-8 sm:w-10 sm:h-10" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-700 text-center">AWS</span>
              </div>

              <div className="flex flex-col items-center group">
                <div className="p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-orange-50 transition-all duration-300 group-hover:scale-110 mb-2">
                  <img src="https://skillicons.dev/icons?i=gcp" alt="GCP" className="w-8 h-8 sm:w-10 sm:h-10" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-700 text-center">GCP</span>
              </div>

              <div className="flex flex-col items-center group">
                <div className="p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-orange-50 transition-all duration-300 group-hover:scale-110 mb-2">
                  <img src="https://skillicons.dev/icons?i=py" alt="Python" className="w-8 h-8 sm:w-10 sm:h-10" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-700 text-center">Python</span>
              </div>

              <div className="flex flex-col items-center group">
                <div className="p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-orange-50 transition-all duration-300 group-hover:scale-110 mb-2">
                  <img src="https://skillicons.dev/icons?i=pytorch" alt="PyTorch" className="w-8 h-8 sm:w-10 sm:h-10" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-700 text-center">PyTorch</span>
              </div>

              <div className="flex flex-col items-center group">
                <div className="p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-orange-50 transition-all duration-300 group-hover:scale-110 mb-2">
                  <img src="https://skillicons.dev/icons?i=kubernetes" alt="Kubernetes" className="w-8 h-8 sm:w-10 sm:h-10" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-700 text-center">Kubernetes</span>
              </div>

              <div className="flex flex-col items-center group">
                <div className="p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-orange-50 transition-all duration-300 group-hover:scale-110 mb-2">
                  <img src="https://skillicons.dev/icons?i=docker" alt="Docker" className="w-8 h-8 sm:w-10 sm:h-10" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-700 text-center">Docker</span>
              </div>

              <div className="flex flex-col items-center group">
                <div className="p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-orange-50 transition-all duration-300 group-hover:scale-110 mb-2">
                  <img src="https://skillicons.dev/icons?i=ts" alt="TypeScript" className="w-8 h-8 sm:w-10 sm:h-10" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-700 text-center">TypeScript</span>
              </div>

              {/* Row 2 */}
              <div className="flex flex-col items-center group">
                <div className="p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-orange-50 transition-all duration-300 group-hover:scale-110 mb-2">
                  <img src="https://skillicons.dev/icons?i=ps" alt="Photoshop" className="w-8 h-8 sm:w-10 sm:h-10" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-700 text-center">Photoshop</span>
              </div>

              <div className="flex flex-col items-center group">
                <div className="p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-orange-50 transition-all duration-300 group-hover:scale-110 mb-2">
                  <img src="https://skillicons.dev/icons?i=wordpress" alt="WordPress" className="w-8 h-8 sm:w-10 sm:h-10" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-700 text-center">WordPress</span>
              </div>

              <div className="flex flex-col items-center group">
                <div className="p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-orange-50 transition-all duration-300 group-hover:scale-110 mb-2">
                  <img src="https://skillicons.dev/icons?i=anaconda" alt="Anaconda" className="w-8 h-8 sm:w-10 sm:h-10" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-700 text-center">Anaconda</span>
              </div>

              <div className="flex flex-col items-center group">
                <div className="p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-orange-50 transition-all duration-300 group-hover:scale-110 mb-2">
                  <img src="https://skillicons.dev/icons?i=pr" alt="Premiere Pro" className="w-8 h-8 sm:w-10 sm:h-10" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-700 text-center">Premiere Pro</span>
              </div>

              <div className="flex flex-col items-center group">
                <div className="p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-orange-50 transition-all duration-300 group-hover:scale-110 mb-2">
                  <img src="https://skillicons.dev/icons?i=visualstudio" alt="Visual Studio" className="w-8 h-8 sm:w-10 sm:h-10" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-700 text-center">Visual Studio</span>
              </div>

              <div className="flex flex-col items-center group">
                <div className="p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-orange-50 transition-all duration-300 group-hover:scale-110 mb-2">
                  <img src="https://skillicons.dev/icons?i=mongodb" alt="MongoDB" className="w-8 h-8 sm:w-10 sm:h-10" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-700 text-center">MongoDB</span>
              </div>

              <div className="flex flex-col items-center group">
                <div className="p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-orange-50 transition-all duration-300 group-hover:scale-110 mb-2">
                  <img src="https://skillicons.dev/icons?i=mysql" alt="MySQL" className="w-8 h-8 sm:w-10 sm:h-10" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-700 text-center">MySQL</span>
              </div>

              <div className="flex flex-col items-center group">
                <div className="p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-orange-50 transition-all duration-300 group-hover:scale-110 mb-2">
                  <img src="https://skillicons.dev/icons?i=js" alt="JavaScript" className="w-8 h-8 sm:w-10 sm:h-10" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-700 text-center">JavaScript</span>
              </div>

              {/* Row 3 */}
              <div className="flex flex-col items-center group">
                <div className="p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-orange-50 transition-all duration-300 group-hover:scale-110 mb-2">
                  <img src="https://skillicons.dev/icons?i=firebase" alt="Firebase" className="w-8 h-8 sm:w-10 sm:h-10" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-700 text-center">Firebase</span>
              </div>

              <div className="flex flex-col items-center group">
                <div className="p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-orange-50 transition-all duration-300 group-hover:scale-110 mb-2">
                  <img src="https://user-images.githubusercontent.com/25181517/192108372-f71d70ac-7ae6-4c0d-8395-51d8870c2ef0.png" alt="Git" className="w-8 h-8 sm:w-10 sm:h-10" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-700 text-center">Git</span>
              </div>

              <div className="flex flex-col items-center group">
                <div className="p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-orange-50 transition-all duration-300 group-hover:scale-110 mb-2">
                  <img src="https://skillicons.dev/icons?i=github" alt="GitHub" className="w-8 h-8 sm:w-10 sm:h-10" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-700 text-center">GitHub</span>
              </div>

              <div className="flex flex-col items-center group">
                <div className="p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-orange-50 transition-all duration-300 group-hover:scale-110 mb-2">
                  <img src="https://skillicons.dev/icons?i=vite" alt="Vite" className="w-8 h-8 sm:w-10 sm:h-10" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-700 text-center">Vite</span>
              </div>

              <div className="flex flex-col items-center group">
                <div className="p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-orange-50 transition-all duration-300 group-hover:scale-110 mb-2">
                  <img src="https://skillicons.dev/icons?i=vscode" alt="VS Code" className="w-8 h-8 sm:w-10 sm:h-10" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-700 text-center">VS Code</span>
              </div>

              <div className="flex flex-col items-center group">
                <div className="p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-orange-50 transition-all duration-300 group-hover:scale-110 mb-2">
                  <img src="https://skillicons.dev/icons?i=tensorflow" alt="TensorFlow" className="w-8 h-8 sm:w-10 sm:h-10" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-700 text-center">TensorFlow</span>
              </div>

              <div className="flex flex-col items-center group">
                <div className="p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-orange-50 transition-all duration-300 group-hover:scale-110 mb-2">
                  <img src="https://skillicons.dev/icons?i=cpp" alt="C++" className="w-8 h-8 sm:w-10 sm:h-10" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-700 text-center">C++</span>
              </div>

              <div className="flex flex-col items-center group">
                <div className="p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-orange-50 transition-all duration-300 group-hover:scale-110 mb-2">
                  <img src="https://skillicons.dev/icons?i=rust" alt="Rust" className="w-8 h-8 sm:w-10 sm:h-10" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-700 text-center">Rust</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
