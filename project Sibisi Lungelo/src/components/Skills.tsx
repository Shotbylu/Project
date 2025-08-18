import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Award } from 'lucide-react';

const Skills = () => {
  const [activeTab, setActiveTab] = useState('Development');

  const tabs = ['Marketing Management', 'Design', 'Development'];

  const skillsData = {
    'Marketing Management': [
      { name: 'Campaign Management', level: 95 },
      { name: 'Digital Marketing', level: 90 },
      { name: 'CRM tools (HubSpot, Salesforce, Zoho)', level: 88 },
      { name: 'Client Acquisition', level: 85 },
      { name: 'Communications', level: 85 },
      { name: 'B2B Marketing', level: 90 },
    ],
    'Design': [
      { name: 'Adobe Creative Suite', level: 92 },
      { name: 'Canva', level: 88 },
      { name: 'Graphic Design', level: 85 },
      { name: 'Lightroom', level: 80 },
      { name: 'InDesign', level: 80 },
      { name: 'Figma (UX/UI Design)', level: 80 },
    ],
    'Development': [
      { name: 'Python', level: 65 },
      { name: 'SQL', level: 75 },
      { name: 'Power BI', level: 85 },
      { name: 'Excel', level: 90 },
      { name: 'Power Automate', level: 80 },
      { name: 'Azure', level: 70 },
      { name: 'AWS', level: 65 },
      { name: 'Data Analysis', level: 85 },
      { name: 'WordPress', level: 70 },
    ],
  };

  const certifications = [
    'Microsoft Azure Data Fundamentals (DP-900)',
    'Adobe Photoshop Essential Skills',
    'Google Digital Marketing Certification',
    'Advanced Statistics for Data Science - Johns Hopkins',
  ];

  const getSkillLevel = (level: number) => {
    if (level >= 85) return 'Expert';
    if (level >= 70) return 'Advanced';
    if (level >= 50) return 'Intermediate';
    return 'Beginner';
  };

  return (
    <section id="skills" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-[#0f1a2b] mb-4">
            My Skills
            <div className="w-20 h-1 bg-[#FF6B00] mx-auto mt-2"></div>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            With a unique blend of marketing insight, development skills, and design thinking, I contribute end-to-end across digital projects, from strategy and UX to execution and optimisation.
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center mb-12"
        >
          <div className="flex space-x-3 bg-gray-100 rounded-2xl p-2">
            {['Marketing Management', 'Design', 'Development'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
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
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
        >
          {skillsData[activeTab as keyof typeof skillsData].map((skill, index) => (
            <div
              key={skill.name}
              className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-200"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-[#0f1a2b]">{skill.name}</h3>
                <span className="text-sm text-gray-500 font-medium">
                  {getSkillLevel(skill.level)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <motion.div
                  className="bg-indigo-600 h-2.5 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${skill.level}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                />
              </div>
              <div className="mt-2 text-right text-sm text-gray-500">
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
          className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8"
        >
          <div className="flex items-center justify-center mb-6">
            <Award className="text-[#1f3bff] mr-3" size={32} />
            <h3 className="text-2xl font-bold text-[#0f1a2b]">Certifications & Training</h3>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {certifications.map((cert, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-xl shadow-md flex items-center space-x-3"
              >
                <Award className="text-[#1f3bff] flex-shrink-0" size={20} />
                <span className="text-sm font-medium text-gray-700">{cert}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;