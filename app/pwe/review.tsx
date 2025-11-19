
import React                        from 'react'
import Image                        from 'next/image'
import { TESTIMONIALS_CONTENT }     from '@/lib/constant'

export default function Review() {
  return (
    <div id="review" className="review w-full h-full p-4 py-6 md:py-8 lg:p-8 lg:px-14 xl:px-55 xl:py-12" style={{ background: '#F3F4F6' }}>
      <div className="container mx-auto">
        <div className="content flex flex-col items-center justify-center gap-8 md:gap-10 lg:gap-13">
          <div className="title-container text-center flex flex-col items-center justify-center gap-4">
            <div className="title">
              <h2
                className="title-text text-2xl md:text-3xl lg:text-4xl xl:text-[2.6rem] xl:max-w-full md:max-w-[400px] lg:max-w-[650px] font-bold font-montserrat text-center text-dark"
                style={{ lineHeight: 1.3 }}
              >
                {TESTIMONIALS_CONTENT.heading}
                <span className="title-highlight heading-gradient inline-block">
                  {TESTIMONIALS_CONTENT.headingHighlight}
                </span>
              </h2>
            </div>
            <div className="description">
              <p
                className="description-text text-gray text-center text-sm md:text-sm lg:text-base xl:text-[1.15rem] md:max-w-[500px] lg:max-w-[650px] mx-auto font-roboto"
                style={{ lineHeight: 1.5 }}
              >
                {TESTIMONIALS_CONTENT.description}
              </p>
            </div>
          </div>
          <div className="review-container w-full ">
            <div className="grid  grid-cols-1 md:grid-cols-3 md:gap-3 lg:gap-7 xl:gap-9 gap-7 ">
              {TESTIMONIALS_CONTENT.testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="bg-white flex flex-col items-start justify-start gap-3 lg:gap-4 xl:gap-5 p-6"
                >
                  <div className="flex items-center justify-start gap-1 xl:gap-1 ">
                    {[...Array(5)].map((_, index) => (
                      <svg
                        key={index}
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="23"
                        viewBox="0 0 24 23"
                        fill="none"
                        className="w-5 h-5 "
                      >
                        <path
                          d="M12 18.3478L19.3143 22.7607L17.3794 14.4366L23.8359 8.83939L15.3242 8.10844L12 0.260742L8.67521 8.10844L0.164062 8.83939L6.62063 14.4366L4.68521 22.7607L12 18.3478Z"
                          fill="#F46036"
                        />
                      </svg>
                    ))}
                  </div>

                  <p className="text-dark text-[0.9rem] lg:text-[1rem] xl:text-[1.1rem] md:max-w-[180px] xl:max-w-[280px] lg:max-w-full font-roboto" style={{ lineHeight: 1.5 }}>
                    "{testimonial.review}"
                  </p>

                  <div className="flex items-center justify-start gap-3">
                     <div className="w-10 h-10 xl:w-11 xl:h-11 rounded-full overflow-hidden flex-shrink-0 relative">
                       <Image
                         src={testimonial.profileImage}
                         alt={testimonial.reviewer}
                         fill
                         className="object-cover"
                       />
                     </div>
                    <div>
                      <p className="font-medium text-dark text-[14px] lg:text-[16px] xl:text-[17px] font-roboto">
                        {testimonial.reviewer}
                      </p>
                      <p className="text-gray text-[13px] lg:text-[15px] xl:text-[16px] font-roboto">
                        {testimonial.location}
                      </p>
                    </div>
                  </div>

                   <div className="w-full h-43 md:h-38 lg:h-43 xl:h-49 mt-3 overflow-hidden relative lg:shadow-[6px_6px_0_0_#275086]" style={{ boxShadow: '4px 4px 0 0 #275086' }}>
                     <Image
                       src={testimonial.associatedImage}
                       alt={`${testimonial.reviewer}'s home`}
                       fill
                       className="object-cover"
                     />
                   </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

