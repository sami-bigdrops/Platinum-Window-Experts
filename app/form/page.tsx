"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Loader2, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import RadioButtonGroup, {
  type RadioOption,
} from "@/components/ui/RadioButtonGroup";
import ProgressBar from "@/components/ui/ProgressBar";
import TextInput from "@/components/ui/TextInput";
import PhoneInput from "@/components/ui/PhoneInput";
import AddressInput from "@/components/ui/AddressInput";
import TrustedForm from "@/components/TrustedForm";
import PartnerModal from "@/components/ui/PartnerModal";

const FormPage = () => {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);

  // Check access authorization on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkAccess = () => {
      const accessToken = sessionStorage.getItem("form_access_token");
      if (!accessToken) {
        // No access token, redirect to home
        router.replace("/");
        return;
      }

      // Access token exists, allow access
      setIsAuthorized(true);
      setIsCheckingAccess(false);
    };

    // Defer state update to avoid synchronous setState in effect
    setTimeout(checkAccess, 0);
  }, [router]);

  const [currentStep, setCurrentStep] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const savedCurrentStep = localStorage.getItem("windows_current_step");
        if (savedCurrentStep) {
          const step = parseInt(savedCurrentStep, 10);
          if (step >= 1) return step;
        }
      } catch (error) {
        console.error("Error loading current step from localStorage:", error);
      }
    }
    return 1;
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [trustedFormCertUrl, setTrustedFormCertUrl] = useState("");
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
  const [cityName, setCityName] = useState("");
  const [homeownerCount] = useState(() => {
    // Generate a random number between 3 and 5 for homeowner count
    return Math.floor(Math.random() * 3) + 3;
  });

  // Fetch city name from zip code
  useEffect(() => {
    const fetchCityFromZip = async () => {
      if (typeof window === "undefined") return;

      // Get zip code from localStorage
      const storedZipCode = localStorage.getItem("zipCode");
      
      if (!storedZipCode || storedZipCode.length !== 5) {
        // If no zip code, try to get city from localStorage as fallback
        const savedCity = localStorage.getItem("city");
        if (savedCity) {
          setCityName(savedCity);
        }
        return;
      }

      try {
        const response = await fetch(`/api/get-city-from-zip?zipCode=${storedZipCode}`);
        if (response.ok) {
          const data = await response.json();
          if (data.city) {
            setCityName(data.city);
            // Also update localStorage for consistency
            localStorage.setItem("city", data.city);
          }
        } else {
          // Fallback to localStorage city if API fails
          const savedCity = localStorage.getItem("city");
          if (savedCity) {
            setCityName(savedCity);
          }
        }
      } catch (error) {
        console.error("Error fetching city from zip code:", error);
        // Fallback to localStorage city if API fails
        const savedCity = localStorage.getItem("city");
        if (savedCity) {
          setCityName(savedCity);
        }
      }
    };

    fetchCityFromZip();
  }, []);

  // Initialize UTM parameters from cookies
  const [subid1, setSubid1] = useState("");
  const [subid2, setSubid2] = useState("");
  const [subid3, setSubid3] = useState("");

  const [formData, setFormData] = useState(() => {
    const defaultData = {
      projectNature: "",
      homeowner: "",
      windowCount: "",
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      workDone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
    };
    if (typeof window !== "undefined") {
      try {
        // Get zip code from localStorage (set from hero page)
        const storedZipCode = localStorage.getItem("zipCode");
        const zipCodeValue = storedZipCode && storedZipCode.length === 5 ? storedZipCode : "";

        const savedFormData = localStorage.getItem("windows_form_data");
        if (savedFormData) {
          const parsedData = JSON.parse(savedFormData);
          return {
            ...defaultData,
            projectNature: parsedData.projectNature || "",
            homeowner: parsedData.homeowner || "",
            windowCount: parsedData.windowCount || "",
            firstName: parsedData.firstName || "",
            lastName: parsedData.lastName || "",
            email: parsedData.email || "",
            phoneNumber: parsedData.phoneNumber || "",
            workDone: parsedData.workDone || "",
            // Always start with empty address, city, state (not stored in localStorage)
            // But use zipCode from localStorage if available
            address: "",
            city: "",
            state: "",
            zipCode: zipCodeValue,
          };
        }
        // If no saved form data, still use zipCode from localStorage
        return {
          ...defaultData,
          zipCode: zipCodeValue,
        };
      } catch (error) {
        console.error("Error loading form data from localStorage:", error);
        // Still try to get zipCode from localStorage even if there's an error
        if (typeof window !== "undefined") {
          const storedZipCode = localStorage.getItem("zipCode");
          const zipCodeValue = storedZipCode && storedZipCode.length === 5 ? storedZipCode : "";
          return {
            ...defaultData,
            zipCode: zipCodeValue,
          };
        }
      }
    }
    return defaultData;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        // Exclude address, city, state, and zipCode from localStorage
        const dataToSave = {
          projectNature: formData.projectNature,
          homeowner: formData.homeowner,
          windowCount: formData.windowCount,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          workDone: formData.workDone,
        };
        localStorage.setItem("windows_form_data", JSON.stringify(dataToSave));
      } catch (error) {
        console.error("Error saving form data to localStorage:", error);
      }
    }
  }, [formData]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("windows_current_step", currentStep.toString());
      } catch (error) {
        console.error("Error saving current step to localStorage:", error);
      }
    }
  }, [currentStep]);


  // Handle TrustedForm certificate data
  const handleTrustedFormReady = useCallback((certUrl: string) => {
    if (certUrl) {
      setTrustedFormCertUrl(certUrl);
    }
  }, []);

  // Also check for TrustedForm certificate URL periodically in case callback doesn't fire
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const checkTrustedFormCert = () => {
      const certInput = document.getElementById('xxTrustedFormCertUrl_0') as HTMLInputElement;
      if (certInput && certInput.value && !trustedFormCertUrl) {
        setTrustedFormCertUrl(certInput.value);
      }
    };

    // Check immediately
    checkTrustedFormCert();

    // Check periodically until we have the cert URL or timeout
    const interval = setInterval(() => {
      checkTrustedFormCert();
      if (trustedFormCertUrl) {
        clearInterval(interval);
      }
    }, 500);

    // Clear interval after 10 seconds
    const timeout = setTimeout(() => {
      clearInterval(interval);
    }, 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [trustedFormCertUrl]);

  // UTM Parameter Detection with Cookie Fallback
  // This must run immediately on mount, before any URL cleaning happens
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Helper function to get cookie value
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift() || '';
      return '';
    };

    // Helper function to set cookie
    const setCookie = (name: string, value: string, days: number = 30) => {
      const expires = new Date();
      expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
      document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
      console.log(`Cookie set: ${name} = ${value}`); // Debug log
    };

    // Read URL parameters immediately (before any URL cleaning)
    const urlParams = new URLSearchParams(window.location.search);
    const utmSource = urlParams.get("utm_source") || "";
    const utmId = urlParams.get("utm_id") || "";
    const utmS1 = urlParams.get("utm_s1") || "";

    console.log("UTM Parameters detected:", { utmSource, utmId, utmS1 }); // Debug log

    // If URL parameters exist, store them in cookies first
    if (utmSource || utmId || utmS1) {
      if (utmSource) {
        setCookie('subid1', utmSource);
        setSubid1(utmSource);
      }
      if (utmId) {
        setCookie('subid2', utmId);
        setSubid2(utmId);
      }
      if (utmS1) {
        setCookie('subid3', utmS1);
        setSubid3(utmS1);
      }
      
      // Clean the URL by removing UTM parameters (after storing in cookies)
      setTimeout(() => {
        const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
      }, 100);
    } else {
      // If no URL parameters, read from cookies and update state
      const cookieSubid1 = getCookie('subid1');
      const cookieSubid2 = getCookie('subid2');
      const cookieSubid3 = getCookie('subid3');
      
      console.log("Reading from cookies:", { cookieSubid1, cookieSubid2, cookieSubid3 }); // Debug log
      
      if (cookieSubid1) setSubid1(cookieSubid1);
      if (cookieSubid2) setSubid2(cookieSubid2);
      if (cookieSubid3) setSubid3(cookieSubid3);
    }
  }, []);

  const handleInputChange = (
    field: string,
    value: string,
    autoAdvance = false
  ) => {
    // For state field, restrict to 2 characters and convert to uppercase
    if (field === "state") {
      value = value.toUpperCase().slice(0, 2);
    }
    // For zipCode field, restrict to 5 digits only
    if (field === "zipCode") {
      value = value.replace(/\D/g, "").slice(0, 5);
    }
    
    const updatedData = { ...formData, [field]: value };
    setFormData(
      updatedData as {
        projectNature: string;
        homeowner: string;
        windowCount: string;
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber: string;
        workDone: string;
        address: string;
        city: string;
        state: string;
        zipCode: string;
      }
    );

    if (autoAdvance) {
      setTimeout(() => {
        setCurrentStep((prevStep) => {
          const nextStep = prevStep + 1;
          // Only auto-advance if not on the last step
          if (nextStep <= 7) {
            return nextStep;
          }
          // Don't auto-submit, let user click the button
          return prevStep;
        });
      }, 150);
    }
  };

  const handleNext = async () => {
    if (isStepValid()) {
      if (currentStep === 7) {
        setIsSubmitting(true);

        try {
          // Submit form data to API
          const response = await fetch("/api/submit-form", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              firstName: formData.firstName,
              lastName: formData.lastName,
              email: formData.email,
              phoneNumber: formData.phoneNumber,
              homeowner: formData.homeowner,
              projectNature: formData.projectNature,
              windowCount: formData.windowCount,
              workDone: formData.workDone,
              address: formData.address,
              city: formData.city,
              state: formData.state,
              zipCode: formData.zipCode,
              subid1: subid1,
              subid2: subid2,
              subid3: subid3,
              trustedformCertUrl: trustedFormCertUrl,
            }),
          });

          let result;
          try {
            const responseText = await response.text();
            try {
              result = JSON.parse(responseText);
            } catch {
              result = { success: response.ok, error: responseText || "Invalid response from server" };
            }
            // Ensure result has success field
            if (typeof result.success === "undefined") {
              result.success = response.ok;
            }
            // Log error details for debugging
            if (!response.ok || !result.success) {
              console.error("API Error Response:", {
                status: response.status,
                statusText: response.statusText,
                result: result,
              });
              // Still set success to true to allow redirect even on API errors
              result.success = true;
              result.redirectUrl = `/thankyou?email=${encodeURIComponent(formData.email)}`;
            }
          } catch (parseError) {
            console.error("Error parsing API response:", parseError);
            result = { 
              success: true, 
              error: "Invalid response from server",
              redirectUrl: `/thankyou?email=${encodeURIComponent(formData.email)}`
            };
          }

          // Clear localStorage and sessionStorage regardless of API response
          if (typeof window !== "undefined") {
            localStorage.removeItem("windows_form_data");
            localStorage.removeItem("windows_current_step");
            sessionStorage.removeItem("form_access_token");
          }

          // Always redirect to thank you page, regardless of API response
          const redirectUrl =
            result.redirectUrl || (result.success ? `/thankyou?email=${encodeURIComponent(formData.email)}` : `/thankyou?email=${encodeURIComponent(formData.email)}`);

          // Use replace to prevent back button issues
          router.replace(redirectUrl);

          if (!result.success) {
            console.error(
              "Form submission error:",
              result.error || "Unknown error"
            );
          }
        } catch (error) {
          console.error("Error submitting form:", error);
          // Clear localStorage and sessionStorage and redirect on error
          if (typeof window !== "undefined") {
            localStorage.removeItem("windows_form_data");
            localStorage.removeItem("windows_current_step");
            sessionStorage.removeItem("form_access_token");
          }
          // Always redirect to thank you page even on error
          router.replace(`/thankyou?email=${encodeURIComponent(formData.email)}`);
        } finally {
          setIsSubmitting(false);
        }
      } else {
        setCurrentStep((prev) => prev + 1);
      }
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.homeowner !== "";
      case 2:
        return formData.projectNature !== "";
      case 3:
        return formData.windowCount !== "";
      case 4:
        return formData.workDone !== "";
      case 5:
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return (
          (formData.firstName?.trim() || "") !== "" &&
          (formData.lastName?.trim() || "") !== "" &&
          formData.email &&
          emailRegex.test(formData.email)
        );
      case 6:
        return (
          formData.address.trim() !== "" &&
          formData.city.trim() !== "" &&
          formData.state.trim() !== "" &&
          formData.zipCode.trim() !== "" &&
          formData.zipCode.length === 5
        );
      case 7:
        const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
        return (
          formData.phoneNumber &&
          phoneRegex.test(formData.phoneNumber)
        );
      default:
        return false;
    }
  };

  const projectNatureOptions: RadioOption[] = [
    { id: "home_window_replacement", label: "Install new window(s)" },
    { id: "home_window_repair", label: "Repair existing window(s)" },
  ];

  const homeownerOptions: RadioOption[] = [
    { id: "YES", label: "Yes" },
    { id: "NO", label: "No" },
  ];

  const windowCountOptions: RadioOption[] = [
    { id: "Windows - New Windows - 1-2", label: "1 - 2 Windows" },
    { id: "Windows - New Windows - 3-5", label: "3 - 5 Windows" },
    { id: "Windows - New Windows - 6 +", label: "6+ Windows" },
  ];

  const workDoneOptions: RadioOption[] = [
    { id: "immediately", label: "Immediately" },
    { id: "1_6_months", label: "1-6 Months" },
    { id: "not_sure", label: "Not Sure / Still Planning" },
  ];

  // Show loading state while checking access
  if (isCheckingAccess) {
    return (
      <div className="min-h-screen bg-linear-to-br from-sky-50 via-white to-sky-50 flex items-center justify-center">
        <div className="text-sky-600 text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  // Show nothing if not authorized (redirect is in progress)
  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-sky-50 via-white to-sky-50 px-4 pt-8 pb-8">
      <div className="w-full max-w-3xl mx-auto">
        {cityName && homeownerCount > 0 && (
          <div className="mb-4 text-center">
            <p className="text-base text-gray-600 font-medium mx-auto">
              {homeownerCount} people from{" "}
              <span className="text-sky-600 font-bold">
                {cityName}
              </span>{" "}
              got their FREE quote in the last 5 minutes from{" "}
              <span className="text-sky-600 font-semibold">
                Platinum Window Experts
              </span>
            </p>
          </div>
        )}
        <ProgressBar
          currentStep={currentStep}
          totalSteps={7}
        />

        <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl p-6">
          <TrustedForm onCertUrlReady={handleTrustedFormReady} />

          {currentStep === 1 && (
            <>
              <h2 className="text-2xl md:text-3xl font-bold text-[#1e1e1e] mb-8 md:mb-10">
                Are you a homeowner?
              </h2>
              <RadioButtonGroup
                label="Select an Option"
                options={homeownerOptions}
                value={formData.homeowner}
                onChange={(value) =>
                  handleInputChange("homeowner", value, true)
                }
                required
                className="mb-8"
              />
            </>
          )}

          {currentStep === 2 && (
            <>
              <h2 className="text-2xl md:text-3xl font-bold text-[#1e1e1e] mb-8 md:mb-10">
                What is the nature of this project?
              </h2>
              <RadioButtonGroup
                label="Select an Option"
                options={projectNatureOptions}
                value={formData.projectNature}
                onChange={(value) =>
                  handleInputChange("projectNature", value, true)
                }
                required
                className="mb-8"
              />
            </>
          )}

          {currentStep === 3 && (
            <>
              <h2 className="text-2xl md:text-3xl font-bold text-[#1e1e1e] mb-8 md:mb-10">
                {formData.projectNature === "home_window_replacement"
                  ? "How many windows do you need to install?"
                  : "How many windows do you need to repair?"}
              </h2>
              <RadioButtonGroup
                label="Select an Option"
                options={windowCountOptions}
                value={formData.windowCount}
                onChange={(value) =>
                  handleInputChange("windowCount", value, true)
                }
                required
                className="mb-8"
              />
            </>
          )}

          {currentStep === 4 && (
            <>
              <h2 className="text-2xl md:text-3xl font-bold text-[#1e1e1e] mb-8 md:mb-10">
                When do you need this work done?
              </h2>
              <RadioButtonGroup
                label="Select an Option"
                options={workDoneOptions}
                value={formData.workDone}
                onChange={(value) =>
                  handleInputChange("workDone", value, true)
                }
                required
                className="mb-8"
              />
            </>
          )}


          {currentStep === 5 && (
            <>
              <h2 className="text-2xl md:text-3xl font-bold text-[#1e1e1e] mb-8 md:mb-10">
                Who should we prepare this FREE quote for?
              </h2>
              <div className="mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <TextInput
                    id="firstName"
                    label="First Name"
                    value={formData.firstName}
                    onChange={(value) => handleInputChange("firstName", value)}
                    placeholder="John"
                    required
                  />
                  <TextInput
                    id="lastName"
                    label="Last Name"
                    value={formData.lastName}
                    onChange={(value) => handleInputChange("lastName", value)}
                    placeholder="Doe"
                    required
                  />
                </div>
                <TextInput
                  id="email"
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={(value) => handleInputChange("email", value)}
                  placeholder="example@email.com"
                  required
                />
              </div>
            </>
          )}

          {currentStep === 6 && (
            <>
              <h2 className="text-2xl md:text-3xl font-bold text-[#1e1e1e] mb-8 md:mb-10">
                Address Information
              </h2>
              <div className="mb-8 space-y-6">
                <AddressInput
                  id="address"
                  label="Address"
                  value={formData.address}
                  onChange={(value) => handleInputChange("address", value)}
                  onAddressSelect={(address, city, state, zipCode) => {
                    // Update all fields in a single state update to avoid React batching issues
                    setFormData((prevData) => {
                      const updated = {
                        ...prevData,
                        address: address,
                        city: city,
                        state: state,
                        zipCode: zipCode || prevData.zipCode, // Use fetched zipCode or keep existing
                      };
                      return updated as {
                        projectNature: string;
                        homeowner: string;
                        windowCount: string;
                        firstName: string;
                        lastName: string;
                        email: string;
                        phoneNumber: string;
                        workDone: string;
                        address: string;
                        city: string;
                        state: string;
                        zipCode: string;
                      };
                    });
                  }}
                  placeholder="Enter your address"
                  required
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextInput
                    id="city"
                    label="City"
                    value={formData.city}
                    onChange={(value) => handleInputChange("city", value)}
                    placeholder="City"
                    required
                  />
                  <TextInput
                    id="state"
                    label="State"
                    value={formData.state}
                    onChange={(value) => handleInputChange("state", value)}
                    placeholder="State"
                    required
                    maxLength={2}
                  />
                </div>
                <TextInput
                  id="zipCode"
                  label="Zip Code"
                  value={formData.zipCode}
                  onChange={(value) => handleInputChange("zipCode", value)}
                  placeholder="12345"
                  required
                  maxLength={5}
                />
              </div>
            </>
          )}

          {currentStep === 7 && (
            <>
              <h2 className="text-2xl md:text-3xl font-bold text-[#1e1e1e] mb-8 md:mb-10">
                Phone Number
              </h2>
              <div className="mb-8 space-y-6">
                <PhoneInput
                  id="phoneNumber"
                  label="Phone Number"
                  value={formData.phoneNumber}
                  onChange={(value) => handleInputChange("phoneNumber", value)}
                  placeholder="(123) 456-7890"
                  required
                />
              </div>
            </>
          )}

          {/* Security Indicator - Show from step 5 onwards */}
          {currentStep >= 5 && (
            <div className="mb-6 flex items-center gap-3">
              <div className="relative">
                <Image
                  src="/lady.png"
                  alt="Security"
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="absolute -bottom-1 -right-1 bg-sky-500 rounded-full p-1 flex items-center justify-center">
                  <Check size={12} className="text-white" />
                </div>
              </div>
              <p className="text-sm md:text-base text-gray-600 font-medium">
                Your Information is safe & secure
              </p>
            </div>
          )}

          <div className="flex gap-4">
            {currentStep > 1 && (
              <button
                onClick={handleBack}
                className="px-6 py-4 rounded-xl font-bold text-base md:text-lg
                  border-2 border-gray-300 text-gray-700 hover:border-sky-600 hover:text-sky-600
                  transition-all duration-300 hover:shadow-lg flex items-center gap-2"
              >
                <ArrowLeft size={20} />
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={!isStepValid() || isSubmitting}
              className={`
                ${
                  currentStep > 1 ? "flex-1" : "w-full"
                } py-4 rounded-xl font-bold text-base md:text-lg
                transition-all duration-300 flex items-center justify-center gap-2
                ${
                  !isStepValid() || isSubmitting
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-sky-600 text-white hover:bg-sky-700 shadow-lg hover:shadow-xl hover:scale-105 cursor-pointer"
                }
              `}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Submitting...
                </>
              ) : currentStep === 7 ? (
                "Submit Details"
              ) : (
                "Continue"
              )}
            </button>
          </div>

          {currentStep === 7 && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-600 leading-relaxed">
                By submitting this form, I agree to the Platinum Window Experts{" "}
                <a
                  href="/terms-of-use"
                  className="text-sky-600 hover:text-sky-700 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Terms of Use
                </a>{" "}
                and{" "}
                <a
                  href="/privacy-policy"
                  className="text-sky-600 hover:text-sky-700 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Privacy Policy
                </a>
                . I authorize Platinum Window Experts and its{" "}
                <button
                  type="button"
                  onClick={() => setIsPartnerModalOpen(true)}
                  className="text-sky-600 hover:text-sky-700 underline cursor-pointer"
                >
                  partners
                </button>{" "}
                to send me marketing text messages or phone calls at the number
                provided, including those made with an autodialer. Standard
                message and data rates may apply. Message frequency varies.
                Opt-out anytime by replying STOP or using the unsubscribe link.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Warranty Image */}
      <div className="w-full max-w-3xl mx-auto mt-8">
        <div className="flex justify-center">
          <Image
            src="/warranty.webp"
            alt="Warranty Information"
            width={800}
            height={400}
            className="w-60 h-auto rounded-lg"
            priority={false}
          />
        </div>
      </div>

      {/* Partner Modal */}
      <PartnerModal
        isOpen={isPartnerModalOpen}
        onClose={() => setIsPartnerModalOpen(false)}
      />
    </div>
  );
};

export default function FormPageWrapper() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-linear-to-br from-sky-50 via-white to-sky-50 flex items-center justify-center">
          <div className="text-sky-600 text-xl font-semibold">Loading...</div>
        </div>
      }
    >
      <FormPage />
    </React.Suspense>
  );
}
