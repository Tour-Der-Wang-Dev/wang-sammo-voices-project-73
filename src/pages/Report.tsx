
import React from 'react';
import ComplaintForm from '@/components/ComplaintForm';

const Report = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 py-8 px-4 pb-24 md:pb-8">
      <div className="max-w-4xl mx-auto">
        <ComplaintForm />
      </div>
    </div>
  );
};

export default Report;
