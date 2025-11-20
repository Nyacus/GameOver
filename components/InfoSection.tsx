
import React from 'react';

interface InfoSectionProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const InfoSection: React.FC<InfoSectionProps> = ({ icon, title, description }) => {
  return (
    <section className="flex items-start space-x-4">
      <div className="text-[#0077F2] flex-shrink-0 w-8 h-8">{icon}</div>
      <div>
        <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
        <p className="text-gray-600 mt-1">{description}</p>
      </div>
    </section>
  );
};

export default InfoSection;
