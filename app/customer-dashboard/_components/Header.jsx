"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { CgProfile } from "react-icons/cg";
import { Autocomplete } from "@react-google-maps/api";
import { getAuth, signOut } from "firebase/auth"; // Firebase import

function Header() {
  const [location, setLocation] = useState("Detect My Location");
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showProfileDropdown, setShowProfileDropdown] = useState(false); // Profile dropdown state
  const autocompleteRef = useRef(null);
  const path = usePathname();
  const dropdownRef = useRef(null);
  const profileDropdownRef = useRef(null); // Ref for profile dropdown

  const detectCurrentLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}`
            );
            const data = await response.json();
            const fullLocation = data.results[0]?.formatted_address || "Unknown Location";
            setLocation(fullLocation);
            setSearchQuery(fullLocation);
          } catch (error) {
            console.error("Error detecting location:", error);
            setLocation("Location Unavailable");
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          setLocation("Location Unavailable");
          setLoading(false);
        }
      );
    } else {
      setLocation("Geolocation not supported");
      setLoading(false);
    }
  };

  const handlePlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      const fullAddress = place?.formatted_address || "Unknown Location";
      setLocation(fullAddress);
      setSearchQuery(fullAddress);
      setShowDropdown(false);
    }
  };

  // Close dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false); // Close profile dropdown
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        // Redirect to login page or show a success message after logout
        window.location.href = "/signin"; // Example: redirect to login
      })
      .catch((error) => {
        console.error("Logout error:", error);
      });
  };

  return (
    <div className="flex items-center justify-between bg-secondary shadow-sm px-6 py-3">
      {/* Logo */}
      <div className="flex items-center gap-4">
        <Image src="/logo.png" width={60} height={20} alt="logo" />

        {/* Detect My Location Button */}
        <ul className="flex items-center gap-6">
          <li>
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="bg-blue-500 text-white px-4 py-2 rounded-full"
              >
                {location}
              </button>

              {/* Dropdown */}
              {showDropdown && (
                <div
                  className="absolute top-full mt-2 left-0 bg-white shadow-md rounded-md w-80 p-4 z-50"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Current Location Button */}
                  <button
                    onClick={detectCurrentLocation}
                    className="bg-green-500 text-white px-4 py-2 rounded-md w-full mb-3"
                  >
                    {loading ? "Detecting..." : "Use Current Location"}
                  </button>

                  {/* Search Bar */}
                  <Autocomplete
                    onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
                    onPlaceChanged={handlePlaceChanged}
                  >
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search for a location"
                      className="border p-2 rounded-md w-full"
                    />
                  </Autocomplete>
                </div>
              )}
            </div>
          </li>
        </ul>
      </div>

      {/* Navigation Items */}
      <ul className="flex items-center gap-6">
        <li
          className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${
            path === "/customer-dashboard/help" && "text-primary font-bold"
          }`}
        >
          <Link href="/customer-dashboard/help">Help</Link>
        </li>
        <li
          className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${
            path === "/customer-dashboard/favourites" && "text-primary font-bold"
          }`}
        >
          <Link href="/customer-dashboard/favourites">Favourites</Link>
        </li>
        <li className="relative">
          <CgProfile
            className="h-8 w-8 cursor-pointer"
            onClick={() => setShowProfileDropdown(!showProfileDropdown)} // Toggle profile dropdown
          />
          {/* Profile Dropdown */}
          {showProfileDropdown && (
            <div
              ref={profileDropdownRef}
              className="absolute top-full right-0 mt-2 bg-white shadow-md rounded-md w-48 p-4 z-50"
              onClick={(e) => e.stopPropagation()}
            >
              <ul>
                <li>
                  <Link
                    href="/customer-dashboard/profile"
                    className="text-gray-700 hover:text-primary block py-2 px-4"
                  >
                    Profile Overview
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="text-red-500 hover:text-red-700 block py-2 px-4 w-full text-left"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </li>
      </ul>
    </div>
  );
}

export default Header;

