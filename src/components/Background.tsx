import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, GraduationCap, Briefcase, Folder } from 'lucide-react';

const Background = () => {
  const [activeFilter, setActiveFilter] = useState('Work Experience');
  const [activeYear, setActiveYear] = useState('All');

  const filters = ['Education', 'Work Experience'];
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
      location: 'Durban',
      description: 'Started career in sales, developing customer relationship and communication skills.',
      icon: Briefcase,
      color: 'Charcoal'
    },
    {
      year: '2022',
      category: 'Education',
      title: 'Diploma Marketing Management',
      institution: 'Boston City Campus',
      location: 'Durban',
      description: 'NQF 6 - Specialized in marketing strategies, consumer behavior, and digital marketing.',
      icon: GraduationCap,
      color: 'indigo'
    },
    {
      year: '2025',
      category: 'Education',
      title: 'Higher Certificate Data Science',
      institution: 'MICTSETA',
      location: 'Johannesburg',
      description: 'NQF 5 - Advanced training in data science methodologies and tools.',
      icon: GraduationCap,
      color: 'indigo'
    },
    {
      year: '2025-2027',
      category: 'Education',
      title: 'BCom Degree, Marketing Management',
      institution: 'University Of South Africa (UNISA)',
      location: 'Johannesburg',
      description: 'NQF 7 - Bachelor of Commerce degree specializing in Marketing Management.',
      icon: GraduationCap,
      color: 'indigo'
    },
    {
      year: '2023',
      category: 'Work Experience',
      title: 'Media, Marketing & Brand Officer',
      institution: 'Empangeni High School',
      location: 'Empangeni',
      description: 'Gained experience in Media, Marketing and Branding.',
      icon: Briefcase,
      color: 'Charcoal'
    },
    {
      year: '2023',
      category: 'Work Experience',
      title: 'Data Analyst Intern',
      institution: 'South32',
      location: 'Richards Bay',
      description: 'Gained experience in data analysis and business intelligence.',
      icon: Briefcase,
      color: 'Charcoal'
    },
    {
      year: '2024',
      category: 'Work Experience',
      title: 'Corporate Communications Intern',
      institution: 'Sasol ESD',
      location: 'Sandton',
      description: 'Developed corporate communication strategies and content.',
      icon: Briefcase,
      color: 'Charcoal'
    },
    {
      year: '2025',
      category: 'Work Experience',
      title: 'Junior Marketing Coordinator',
      institution: 'Initium Venture Solutions',
      location: 'Kempton Park',
      description: 'Current role focused on marketing and communications for Initium Venture Solutions..',
      icon: Briefcase,
      color: 'Charcoal'
    }
  ];

  const filteredData = timelineData.filter(item => {
    const filterMatch = item.category === activeFilter;
    const yearMatch = activeYear === 'All' || item.year === activeYear;
    return filterMatch && yearMatch;
  });

  const getColorClasses = (color) => {
    switch (color) {
      case 'indigo':
        return 'border-l-indigo-500 bg-indigo-50';
      case 'Charcoal':
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
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-800 mb-4">My Background</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From education to on the job experience, discover my evolution in the digital world
          </p>
        </div>

        {/* Filters */}
        <div className="flex justify-center mb-8">
          <div className="flex flex-wrap gap-2 bg-white rounded-2xl p-2 shadow-lg">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                  activeFilter === filter
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'text-gray-600 hover:text-orange-500 hover:bg-orange-50'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Year Navigation */}
        <div className="flex items-center justify-center mb-12">
          <button className="p-2 text-gray-400 hover:text-orange-500 transition-colors">
            <ChevronLeft size={20} />
          </button>
          <div className="flex space-x-2 mx-4 overflow-x-auto">
            <button
              onClick={() => setActiveYear('All')}
              className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition-all duration-200 ${
                activeYear === 'All'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-600'
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
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                {year}
              </button>
            ))}
          </div>
          <button className="p-2 text-gray-400 hover:text-orange-500 transition-colors">
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Timeline Cards */}
        <div className="grid gap-6 mb-16">
          {filteredData.map((item, index) => (
            <div
              key={`${item.year}-${item.title}`}
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
                    <span className="text-sm font-semibold text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
                      {item.year}
                    </span>
                    <span className="text-sm text-gray-500">{item.location}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-1">{item.title}</h3>
                  <p className="text-blue-600 font-semibold mb-2">{item.institution}</p>
                  <p className="text-gray-600 mb-4">{item.description}</p>
                  <button className="text-orange-600 font-semibold hover:text-orange-700 transition-colors">
                    View Details →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={stat.label} className="space-y-2">
                <h3 className="text-2xl font-bold text-slate-800">{stat.value}</h3>
                <p className="text-gray-600 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-gray-500 mt-6">
            A steady progression since 2018 with a total of 37 skills acquired.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Background;
