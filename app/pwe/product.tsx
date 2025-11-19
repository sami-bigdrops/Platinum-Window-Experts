'use client'

import { PRODUCT_CONTENT } from '@/lib/constant'
import React, { useState } from 'react'
import Image from 'next/image'

export default function Product() {
  const [showAllProducts, setShowAllProducts] = useState(false)
  
  // For mobile: show first 4 products initially, all products when "View More" is clicked
  // For md, lg, xl: always show all products
  const displayedProducts = showAllProducts ? PRODUCT_CONTENT.products : PRODUCT_CONTENT.products.slice(0, 4)
  
  return (
    <div id="product" className='product w-full h-full p-4 py-6 lg:p-8 lg:px-8 xl:px-12 xl:py-13 xl:pb-15'  >
      <div className='container mx-auto'>
        <div className='content flex flex-col items-center justify-center gap-8 md:gap-10 lg:gap-13 xl:gap-10'>
          <div className='title-container text-center flex flex-col items-center justify-center gap-4'>
            <div className='title flex flex-col items-center justify-center gap-4'>
              <h2 className='title-text text-2xl md:text-3xl lg:text-4xl xl:text-[2.6rem]  md:max-w-[500px] lg:max-w-[650px] xl:max-w-[700px] font-bold font-montserrat text-center text-dark leading-tight'>
                {PRODUCT_CONTENT.heading}
                <span className='title-highlight heading-gradient'>{PRODUCT_CONTENT.headingHighlight}</span>
              </h2>
              <p
                className="description-text text-gray text-center text-sm md:text-sm lg:text-base xl:text-[1.15rem] md:max-w-[500px] lg:max-w-[650px] mx-auto font-roboto"
                style={{ lineHeight: 1.5 }}
              >
                {PRODUCT_CONTENT.description}
              </p>
            </div>
          </div>

          <div className='product-container w-full px-6'>
            {/* Products Grid */}
            <div className='flex flex-wrap items-center justify-center '>
              {/* Mobile: Show limited products with View More button */}
              <div className='md:hidden flex flex-wrap items-center justify-center w-full'>
                {displayedProducts.map((product) => (
                  <div key={product.id} className='product-card bg-white flex flex-col items-center p-4 py-5 justify-center gap-3 transition-all duration-300 group hover:bg-[#245086] cursor-pointer relative overflow-hidden w-full'>
                    {/* Product Description - Shows on hover at top */}
                    <div className='product-description hidden group-hover:block absolute top-8 left-4 right-4 z-10'>
                      <p className='text-[0.95rem] font-roboto text-center text-white leading-relaxed'>
                        {product.description}
                      </p>
                    </div>
                    
                    {/* Product Image - Normal state */}
                    <div className='relative w-full h-32 flex items-center justify-center group-hover:opacity-0 transition-opacity duration-300'>
                      <Image
                        src={product.image}
                        alt={product.title}
                        width={200}
                        height={150}
                        className='object-contain max-w-full max-h-full'
                      />
                    </div>
                    
                    {/* Product Title - Always visible, turns white on hover */}
                    <div className='product-title relative z-10'>
                      <h3 className='text-[1.05rem] font-bold text-dark group-hover:text-white font-montserrat text-center transition-colors duration-300'>
                        {product.title}
                      </h3>
                    </div>
                  </div>
                ))}
                
                {/* View More Button - Only visible on mobile and when not all products are shown */}
                {!showAllProducts && PRODUCT_CONTENT.products.length > 4 && (
                  <div className='flex justify-center mt-7 w-full'>
                    <button 
                      onClick={() => setShowAllProducts(true)}
                      className='bg-[#275086] w-full max-w-[220px] text-base text-white px-6 py-3 rounded-sm font-medium hover:bg-[#1e3d6b] transition-colors duration-300'
                    >
                      View More
                    </button>
                  </div>
                )}
              </div>
              
              {/* Desktop: Show all products (md, lg, xl screens) */}
              <div className='hidden md:flex flex-wrap items-center justify-center w-full '>
                {PRODUCT_CONTENT.products.map((product) => (
                  <div key={product.id} className='product-card bg-white flex flex-col items-center p-4  py-5 lg:py-6 lg:px-7 xl:py-8 xl:px-7   justify-center gap-3 transition-all duration-300 group hover:bg-[#275086]/80 cursor-pointer relative overflow-hidden w-full md:w-[calc(33.333%-1rem)] lg:w-[calc(20%-0.5rem)] xl:w-[calc(20%-0.5rem)]'>
                   
                   
                    {/* Product Description - Shows on hover at top */}
                    <div className='product-description hidden group-hover:block absolute top-8 md:top-6 left-4 right-4 z-10'>
                      <p className='text-[0.95rem] md:text-[0.95rem] lg:text-[0.85rem] xl:text-[1.15rem] font-roboto text-center text-white leading-relaxed'>
                        {product.description}
                      </p>
                    </div>
                    
                    {/* Product Image - Normal state */}
                    <div className='relative w-full h-32 md:h-33 lg:h-38 xl:h-39 flex items-center justify-center group-hover:opacity-0 transition-opacity duration-300'>
                      <Image
                        src={product.image}
                        alt={product.title}
                        width={200}
                        height={150}
                        className='object-contain max-w-full max-h-full'
                      />
                    </div>
                    
                    {/* Product Title - Always visible, turns white on hover */}
                    <div className='product-title relative z-10'>
                      <h3 className='text-[1.05rem] md:text-[1.05rem]  lg:text-[0.73rem] xl:text-[1.15rem] font-bold text-dark group-hover:text-white font-montserrat text-center transition-colors duration-300'>
                        {product.title}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}