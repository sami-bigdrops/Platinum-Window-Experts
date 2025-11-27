"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const isThankYouPage = pathname === '/thankyou';

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
        <div className="bg-white px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="logo">
              <Link href="/"><Image
                src="/logo.svg"
                alt="Platinum Window Expert"
                width={120}
                height={30}
                className="h-8 w-auto"
              /></Link>
            </div>
            <div className="nav-group flex flex-col justify-center items-center gap-1">
              <p className="text-xs font-roboto font-medium text-center mb-0 text-dark">
                Call Us for a FREE Quote
              </p>
              <div className="phone-grp flex flex-row items-center gap-2">
                <Image
                  src="/mobile.svg"
                  alt="Phone"
                  width={16}
                  height={16}
                  className="h-4 w-auto"
                />
                <Link
                  href="tel:18556591507"
                  className="font-semibold text-sm font-roboto text-blue text-primary"
                >
                  1-855-659-1507
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DESKTOP NAVBAR */}
      <div className="hidden md:block">
        <div className="bg-white px-10 xl:px-45 xl:py-7 py-6 mx-auto">
          <div className="mx-auto flex justify-between items-center">
            <Link href="/"><Image
              src="/logo.svg"
              alt="Platinum Window Expert"
              width={120}
              height={30}
              className="h-9 lg:h-10 xl:h-14 w-auto"
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
