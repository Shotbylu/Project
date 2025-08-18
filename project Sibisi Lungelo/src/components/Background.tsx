import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, GraduationCap, Briefcase, Folder } from 'lucide-react';

const Background = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [activeYear, setActiveYear] = useState('All');

  const filters = ['All', 'Education', 'Work Experience'];
  const years = ['2018', '2019', '2022', '2023', '2024', '2025', '2025-2027'];

  const timelineData = [
    {
      year: '2018',
      category: 'Education',
      title: 'Matric Senior Certificate',
      institution: 'Richards Bay Secondary',
      location: 'Richards Bay',
      description: 'NQF4 - Completed high school education with focus on mathematics and science.',
      icon: GraduationCap,
      color: 'indigo'
    },
    {
      year: '2019',
      category: 'Work Experience',
      title: 'Sales Consultant',
      institution: 'CCI Global',
      location: 'South Africa',
      description: 'Started career in sales, developing customer relationship and communication skills.',
      icon: Briefcase,
      color: 'teal'
    },
    {
      year: '2022',
      category: 'Education',
      title: 'Diploma Marketing Management',
      institution: 'Boston City Campus',
      location: 'South Africa',
      description: 'NQF 6 - Specialized in marketing strategies, consumer behavior, and digital marketing.',
      icon: GraduationCap,
      color: 'indigo'
    },
    {
      year: '2025',
      category: 'Education',
      title: 'Higher Certificate Data Science',
      institution: 'MICTSETA',
      location: 'South Africa',
      description: 'NQF 5 - Advanced training in data science methodologies and tools.',
      icon: GraduationCap,
      color: 'indigo'
    },
    {
      year: '2025-2027',
      category: 'Education',
      title: 'BCom Degree, Marketing Management',
      institution: 'University Of South Africa (UNISA)',
      location: 'South Africa',
      description: 'NQF 7 - Bachelor of Commerce degree specializing in Marketing Management.',
      icon: GraduationCap,
      color: 'indigo'
    },
    {
      year: '2023',
      category: 'Work Experience',
      title: 'Media, Marketing & Brand Officer',
      institution: 'Empangeni High School',
      location: 'South Africa',
      description: 'Gained experience in Media, Marketing and Branding.',
      icon: Briefcase,
      color: 'teal'
    },
    {
      year: '2023',
      category: 'Work Experience',
      title: 'Data Analyst Intern',
      institution: 'South32',
      location: 'South Africa',
      description: 'Gained experience in data analysis and business intelligence.',
      icon: Briefcase,
      color: 'teal'
    },
    {
      year: '2024',
      category: 'Work Experience',
      title: 'Corporate Communications Intern',
      institution: 'Sasol ESD',
      location: 'South Africa',
      description: 'Developed corporate communication strategies and content.',
      icon: Briefcase,
      color: 'teal'
    },
    {
      year: '2025',
      category: 'Work Experience',
      title: 'Junior Marketing Coordinator',
      institution: 'Initium Venture Solutions',
      location: 'South Africa',
      description: 'Current role focused on marketing and communications for Initium Venture Solutions..',
      icon: Briefcase,
      color: 'teal'
    }
  ];

  const filteredData = timelineData.filter(item => {
    const filterMatch = activeFilter === 'All' || item.category === activeFilter;
    const yearMatch = activeYear === 'All' || item.year === activeYear;
    return filterMatch && yearMatch;
  });

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'indigo':
        return 'border-l-indigo-500 bg-indigo-50';
      case 'teal':
        return 'border-l-teal-500 bg-teal-50';
      case 'orange':
        return 'border-l-orange-500 bg-orange-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const stats = [
    { label: 'Education', value: '3 qualifications + 1 pending' },
    { label: 'Experience', value: '6+ years' },
    { label: 'Campaigns', value: '3+ & projects' }
  ];

  return (
    <section id="background" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-[#0f1a2b] mb-4">My Background</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From education to on the job experience, discover my evolution in the digital world
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center mb-8"
        >
          <div className="flex flex-wrap gap-2 bg-white rounded-2xl p-2 shadow-lg">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                  activeFilter === filter
                    ? 'bg-[#FF6B00] text-white shadow-md'
                    : 'text-gray-600 hover:text-[#FF6B00] hover:bg-orange-50'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Year Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex items-center justify-center mb-12"
        >
          <button className="p-2 text-gray-400 hover:text-[#FF6B00] transition-colors">
            <ChevronLeft size={20} />
          </button>
          <div className="flex space-x-2 mx-4 overflow-x-auto">
            <button
              onClick={() => setActiveYear('All')}
              className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition-all duration-200 ${
                activeYear === 'All'
                  ? 'bg-[#1f3bff] text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-blue-50 hover:text-[#1f3bff]'
              }`}
            >
              All
            </button>
            {years.map((year) => (
              <button
                key={year}
                onClick={() => setActiveYear(year)}
                className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition-all duration-200 ${
                  activeYear === year
                    ? 'bg-[#1f3bff] text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-blue-50 hover:text-[#1f3bff]'
                }`}
              >
                {year}
              </button>
            ))}
          </div>
          <button className="p-2 text-gray-400 hover:text-[#FF6B00] transition-colors">
            <ChevronRight size={20} />
          </button>
        </motion.div>

        {/* Timeline Cards */}
        <div className="grid gap-6 mb-16">
          {filteredData.map((item, index) => (
            <motion.div
              key={`${item.year}-${item.title}`}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`bg-white rounded-2xl shadow-lg border-l-4 ${getColorClasses(item.color)} p-6 hover:shadow-xl transition-shadow duration-200`}
            >
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-xl ${
                  item.color === 'indigo' ? 'bg-indigo-100 text-indigo-600' :
                  item.color === 'teal' ? 'bg-teal-100 text-teal-600' :
                  'bg-orange-100 text-orange-600'
                }`}>
                  <item.icon size={24} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-[#FF6B00] bg-orange-100 px-3 py-1 rounded-full">
                      {item.year}
                    </span>
                    <span className="text-sm text-gray-500">{item.location}</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#0f1a2b] mb-1">{item.title}</h3>
                  <p className="text-[#1f3bff] font-semibold mb-2">{item.institution}</p>
                  <p className="text-gray-600 mb-4">{item.description}</p>
                  <button className="text-[#FF6B00] font-semibold hover:text-orange-600 transition-colors">
                    View Details →
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={stat.label} className="space-y-2">
                <h3 className="text-2xl font-bold text-[#0f1a2b]">{stat.value}</h3>
                <p className="text-gray-600 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-gray-500 mt-6">
            A steady progression since 2018 with a total of 37 skills acquired.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Background;