"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const isThankYouPage = pathname === '/thankyou';
  const isFormPage = pathname === '/form';

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    
    // Check if we're on the home page
    if (typeof window !== 'undefined' && window.location.pathname === '/') {
      // Already on home page, just scroll
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      // Not on home page, store section ID and navigate
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('scrollToSection', sectionId);
      }
      router.push('/');
    }
  };

  return (
    <>
      {/* MOBILE */}
      <div className="block md:hidden">
        <div className="bg-white px-4 py-3">
          <div className="flex items-center justify-center">
            <div className="logo">
              <Link href="/"><Image
                src="/logo.svg"
                alt="Platinum Window Expert"
                width={240}
                height={60}
                className="h-12 w-auto object-contain"
              /></Link>
            </div>
          </div>
        </div>
      </div>

      {/* DESKTOP NAVBAR */}
      <div className="hidden container mx-auto md:block">
        <div className="bg-white xl:py-7 py-6">
          <div className="mx-auto flex items-center justify-between">
            <Link href="/"><Image
              src="/logo.svg"
              alt="Platinum Window Expert"
              width={120}
              height={30}
              className="h-12 lg:h-10 xl:h-14 w-auto object-contain"
            /></Link>

            {!isThankYouPage && (
              <nav className="flex items-center justify-center gap-7 xl:gap-17">
                <Link
                  href="/"
                  onClick={(e) => handleSmoothScroll(e, 'benefit')}
                  className="text-xs lg:text-sm xl:text-[1.05rem] text-dark hover:text-[#275086] font-roboto transition-colors cursor-pointer"
                >
                  Benefits
                </Link>
                <Link
                  href="/"
                  onClick={(e) => handleSmoothScroll(e, 'product')}
                  className="text-xs lg:text-sm xl:text-[1.05rem] text-dark hover:text-[#275086] font-roboto transition-colors cursor-pointer"
                >
                  Products
                </Link>
                <Link
                  href="/"
                  onClick={(e) => handleSmoothScroll(e, 'review')}
                  className="text-xs lg:text-sm xl:text-[1.05rem] text-dark hover:text-[#275086] font-roboto transition-colors cursor-pointer"
                >
                  Testimonials
                </Link>
                <Link
                  href="/"
                  onClick={(e) => handleSmoothScroll(e, 'faq')}
                  className="text-xs lg:text-sm xl:text-[1.05rem] text-dark hover:text-[#275086] font-roboto transition-colors cursor-pointer"
                >
                  FAQ
                </Link>
              </nav>
            )}

            <button className="flex flex-row items-center gap-2 rounded-sm text-sm lg:text-base xl:text-lg px-4 lg:px-5 py-3 font-medium font-roboto cursor-pointer bg-blue text-white transition-all duration-300 hover:bg-[#275086]">
              <Image
                src="/desktop.svg"
                alt="Phone"
                width={16}
                height={16}
                className="h-4 xl:h-5 w-auto"
              />
              <span className="text-sm lg:text-base xl:text-[1.3rem] font-roboto text-white">
                1-855-659-1507
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
