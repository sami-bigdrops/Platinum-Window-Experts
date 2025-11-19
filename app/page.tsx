'use client'

import { useEffect } from 'react'
import Navbar from "@/app/pwe/navbar";  
import Hero from "@/app/pwe/hero";
import USA from "@/app/pwe/usa";
import Benefit from "@/app/pwe/benefit";
import Steps from "@/app/pwe/steps";
import Product from "@/app/pwe/product";
import Review from "@/app/pwe/review";
import Faq from "@/app/pwe/faq";
import Info from "@/app/pwe/info";
import Footer from "@/app/pwe/footer";

export default function Home() {
  useEffect(() => {
    // Check if there's a section to scroll to (set from navbar when navigating from other pages)
    const scrollToSection = sessionStorage.getItem('scrollToSection');
    if (scrollToSection) {
      // Clear the sessionStorage
      sessionStorage.removeItem('scrollToSection');
      
      // Wait for page to fully load, then scroll
      const scrollToElement = () => {
        const element = document.getElementById(scrollToSection);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          // Retry if element not found yet (page still loading)
          setTimeout(scrollToElement, 100);
        }
      };
      
      // Start scrolling after a short delay to ensure page is rendered
      setTimeout(scrollToElement, 300);
    }
  }, []);

  return (
    <div>
      <Navbar />
      <Hero />
      <USA />
      <Benefit />
      <Steps />
      <Product />
      <Review />
      <Faq />
      <Info />
      <Footer />
    </div>
  );
}
