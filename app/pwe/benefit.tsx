import React from 'react'
import Image from 'next/image'
import { BENEFITS_CONTENT } from '@/lib/constant'

export default function Benefit() {
  return (
    <div id="benefit" className="benefit bg-white h-full p-4 md:p-6 md:py-8 lg:p-8 lg:px-25 xl:p-12 xl:px-25">
        <div className="container mx-auto ">
            <div className="content flex flex-col items-center justify-center gap-8">
                <div className="title-container text-center flex flex-col items-center justify-center gap-4">
                    <div className="title">
                        <h2 className="title-text text-2xl md:text-3xl lg:text-4xl xl:text-[2.6rem] md:max-w-[400px] lg:max-w-[650px] xl:max-w-[700px] font-bold font-montserrat text-center text-dark leading-tight">
                            {BENEFITS_CONTENT.heading} <span className="title-highlight heading-gradient inline-block">{BENEFITS_CONTENT.headingHighlight}</span>
                        </h2>
                    </div>
                    <div className="description">
                        <p className="description-text text-gray text-center text-sm md:text-sm lg:text-base xl:text-[1.15rem] md:max-w-[500px] lg:max-w-[650px] xl:max-w-[700px] mx-auto font-roboto leading-relaxed">
                            {BENEFITS_CONTENT.description}
                        </p>
                    </div>
                </div>


                <div className="mobile-view md:hidden flex flex-col items-center justify-center gap-3">
                   
                    <div className="window-image-container mb-6 w-full flex items-center justify-center">
                        <Image
                            src={BENEFITS_CONTENT.windowImage}
                            alt="Energy Saving Window"
                            width={500}
                            height={600}
                            className="w-[300px] h-[330px]  object-contain"
                        />
                    </div>

                    {/* Benefit Cards */}
                    <div className="benefit-cards flex flex-col items-center justify-center gap-4 w-full ">
                        {BENEFITS_CONTENT.benefitCards.map((card, index) => (
                            <div
                                key={index}
                                className="benefit-card p-6 flex flex-col items-center justify-center gap-5 w-full border border-[#BBB] bg-white shadow-[4px_4px_12px_0_rgba(0,0,0,0.05)]"
                            >
                                <div className="flex flex-col items-start justify-start gap-3">
                                    {/* Icon */}
                                    <div className="icon-container flex flex-cols items-center justify-start gap-2">
                                        <div className="w-7 h-7  rounded-full flex items-center justify-center">
                                            <Image
                                                src={card.icon}
                                                alt={card.title}
                                                width={32}
                                                height={32}
                                                className="w-6 h-6"
                                            />
                                        </div>
                                        <h3 className="card-title text-base font-semibold font-montserrat ">
                                            {card.title}
                                        </h3>
                                    </div>
                                    
                                    {/* Content */}
                                    <div className="content">
                                        
                                        <p className="card-description text-gray text-xs leading-relaxed font-roboto">
                                            {card.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>



                {/*desktop view*/}
                <div className="desktop-view hidden md:block relative w-full max-w-6xl mx-auto">
                    {/* Desktop Layout with Window and Cards */}
                    <div className="relative flex items-center justify-center ">
                        {/* Central Window */}
                        <div className="relative window-container z-0">
                            <Image
                                src={BENEFITS_CONTENT.windowImage}
                                alt="Energy Saving Window"
                                width={350}
                                height={500}
                                className="w-[350px] h-[500px] lg:w-[400px] lg:h-[500px] xl:w-[550px] xl:h-[660px] object-contain"
                            />
                        </div>

                        {/* Benefit Card 1: Energy Efficiency (Top-Left) */}
                        <div className="absolute top-21 xl:top-19 left-0 w-58 lg:w-62 xl:w-85 p-4 xl:p-6 cursor-pointer border border-[#BBB] bg-white shadow-[4px_4px_12px_0_rgba(0,0,0,0.05)] group hover:shadow-lg transition-all duration-300">
                            {/* Icon */}
                            <div className="icon-container flex items-center gap-2 mb-1 xl:gap-4">
                                <div className="w-[22px] h-[22px] xl:w-[40px] xl:h-[40px] rounded-full flex items-center justify-center">
                                    <Image
                                        src={BENEFITS_CONTENT.benefitCards[0].icon}
                                        alt={BENEFITS_CONTENT.benefitCards[0].title}
                                        width={32}
                                        height={32}
                                        className="w-[22px] h-[22px]  xl:w-[40px] xl:h-[40px] "
                                    />
                                </div>
                                <h3 className="card-title text-base font-semibold font-montserrat lg:text-[1.1rem] xl:text-[1.55rem] ">
                                    {BENEFITS_CONTENT.benefitCards[0].title}
                                </h3>
                            </div>
                            
                            {/* Content - Hidden by default, shown on hover */}
                            <div className="content overflow-hidden transition-all duration-300 max-h-0 group-hover:max-h-96 ">
                                <p className="card-description text-gray text-xs leading-relaxed font-roboto pt-1 lg:pt-2 xl:pt-3 lg:text-[0.85rem] xl:text-[1.1rem] xl:leading-normal" >
                                    {BENEFITS_CONTENT.benefitCards[0].description}
                                </p>
                            </div>
                            {/* Connection Line */}
                            <div className="connection-line absolute top-9 lg:top-11 xl:top-16 -right-19.5 lg:-right-29.5 xl:-right-44.5 w-20 lg:w-30 xl:w-45 h-0.5  border-dashed  border-t-2 xl:border-t-2.5  border-orange-500 transform -translate-y-1/5 rotate-[14.964deg] z-10"></div>
                        </div>

                       

                        {/* Benefit Card 2: Easy Cleaning (Bottom-Left) */}
                        <div className="absolute top-77 xl:top-105 left-0 lg:-left-3 xl:-left-6 w-55 lg:w-62 xl:w-85  p-4 xl:p-6 cursor-pointer border border-[#BBB] bg-white shadow-[4px_4px_12px_0_rgba(0,0,0,0.05)] group hover:shadow-lg transition-all duration-300">
                            {/* Icon */}
                            <div className="icon-container flex items-center gap-2 mb-1 xl:gap-4">
                                <div className="w-[22px] h-[22px] xl:w-[40px] xl:h-[40px] rounded-full flex items-center justify-center">
                                    <Image
                                        src={BENEFITS_CONTENT.benefitCards[2].icon}
                                        alt={BENEFITS_CONTENT.benefitCards[2].title}
                                        width={32}
                                        height={32}
                                        className="w-[22px] h-[22px]  xl:w-[40px] xl:h-[40px] "
                                    />
                                </div>
                                <h3 className="card-title text-base font-semibold font-montserrat lg:text-[1.1rem] xl:text-[1.55rem] ">
                                    {BENEFITS_CONTENT.benefitCards[2].title}
                                </h3>
                            </div>
                            
                            {/* Content */}
                            <div className="content overflow-hidden transition-all duration-300 max-h-0 group-hover:max-h-96">
                                <p className="card-description text-gray text-xs leading-relaxed font-roboto pt-1 lg:pt-2 lg:text-[0.85rem] xl:text-[1.1rem] xl:leading-normal">
                                    {BENEFITS_CONTENT.benefitCards[2].description}
                                </p>
                            </div>
                            {/* Connection Line */}
                            <div className="connection-line absolute -top-0 lg:-top-2.5  -right-16.5 lg:-right-23  xl:-right-37   w-20 lg:w-28 xl:w-43 h-0.5 border-dashed border-t-2 xl:border-t-2.5  border-orange-500 transform -translate-y-1/2 -rotate-[50.964deg] xl:-rotate-[43.964deg]  z-10"></div>
                        </div>

                        {/* Benefit Card 3: Sound Insulation (Bottom-Right) */}
                        <div className="absolute top-52 xl:top-65 xl:-right-8 right-0 w-55 lg:w-62 xl:w-85 p-4 xl:p-6 cursor-pointer border border-[#BBB] bg-white shadow-[4px_4px_12px_0_rgba(0,0,0,0.05)] group hover:shadow-lg transition-all duration-300">
                            {/* Icon */}
                            <div className="icon-container flex items-center gap-2 mb-1 xl:gap-4">
                                <div className="w-[22px] h-[22px] xl:w-[40px] xl:h-[40px] rounded-full flex items-center justify-center">
                                    <Image
                                        src={BENEFITS_CONTENT.benefitCards[1].icon}
                                        alt={BENEFITS_CONTENT.benefitCards[1].title}
                                        width={32}
                                        height={32}
                                        className="w-[22px] h-[22px]  xl:w-[40px] xl:h-[40px] "
                                    />
                                </div>
                                <h3 className="card-title text-base font-semibold font-montserrat lg:text-[1.1rem] xl:text-[1.55rem] ">
                                    {BENEFITS_CONTENT.benefitCards[1].title}
                                </h3>
                            </div>
                            
                            {/* Content */}
                            <div className="content overflow-hidden transition-all duration-300 max-h-0 group-hover:max-h-96">
                                <p className="card-description text-gray text-xs leading-relaxed font-roboto pt-1 lg:pt-2 lg:text-[0.85rem] xl:text-[1.1rem] xl:leading-normal">
                                    {BENEFITS_CONTENT.benefitCards[1].description}
                                </p>
                            </div>
                            {/* Connection Line */}
                            <div className="connection-line absolute top-12 lg:top-13 xl:top-19 right-53.5 lg:right-60  xl:right-83 w-20 lg:w-24 xl:w-43 h-0.5  border-dashed border-t-2 xl:border-t-2.5  border-orange-500 transform -translate-y-1/2 rotate-[150.964deg] xl:rotate-[157.964deg]    z-10"></div>
                        </div>

                        
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}