'use client'

import React from 'react'

interface PartnerModalProps {
  isOpen: boolean
  onClose: () => void
}

const partners = [
  "Renewal by Andersen",
  "Home Media LLC"
]

export default function PartnerModal({ isOpen, onClose }: PartnerModalProps) {
  if (!isOpen) return null

  return (
    <>
      {/* Blurred Background Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs z-9998 transition-opacity duration-200 ease-out"
        style={{
          animation: 'fadeIn 0.2s ease-out',
        }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div
        className="fixed inset-0 z-9999 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose()
          }
        }}
      >
        <div
          className="relative bg-white rounded-2xl md:rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
          style={{
            animation: 'modalSlideIn 0.25s ease-out',
            transformOrigin: 'center',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 sm:px-8 pt-6 sm:pt-8 pb-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1e1e1e]">
              Our Partners
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors duration-200 group"
              aria-label="Close modal"
            >
              <svg
                className="w-5 h-5 text-gray-600 group-hover:text-gray-800"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Modal Content - Scrollable */}
          <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {partners.map((partner, index) => (
                <div
                  key={index}
                  className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-sky-300 hover:bg-sky-50 transition-all duration-200"
                >
                  <p className="text-sm md:text-base text-[#1e1e1e] font-medium">
                    {partner}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

