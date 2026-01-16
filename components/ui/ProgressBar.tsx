'use client'

import React from 'react'

interface ProgressBarProps {
  currentStep: number
  totalSteps: number
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  totalSteps,
}) => {
  const percentage = Math.max(0, Math.min((currentStep / totalSteps) * 100, 100))

  return (
    <div className="mb-8 md:mb-12">
      <div className="relative w-full bg-gray-200 rounded-full h-8">
        <div 
          className="bg-[#43C590] h-8 rounded-full transition-all duration-300 relative flex items-center justify-end pr-2"
          style={{ width: `${percentage}%` }}
        >
          <span className="text-sm font-semibold text-white whitespace-nowrap">
            <span className="md:hidden">{Math.round(percentage)}%</span>
            <span className="hidden md:inline">{Math.round(percentage)}% Complete</span>
          </span>
        </div>
      </div>
    </div>
  )
}

export default ProgressBar

