"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Autocomplete } from "@react-google-maps/api";
import { getAuth, signOut } from "firebase/auth";

function Header() {
  const [location, setLocation] = useState("Detect My Location");
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isOnline, setIsOnline] = useState(false); // State for online/offline toggle
  const autocompleteRef = useRef(null);
  const path = usePathname();
  const dropdownRef = useRef(null);

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
            let fullLocation = data.results[0]?.formatted_address || "Unknown Location";

            // Restrict location to 60 words
            const words = fullLocation.split(" ");
            if (words.length > 60) {
              fullLocation = words.slice(0, 60).join(" ") + "...";
            }

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
      let fullAddress = place?.formatted_address || "Unknown Location";

      // Restrict location to 60 words
      const words = fullAddress.split(" ");
      if (words.length > 60) {
        fullAddress = words.slice(0, 60).join(" ") + "...";
      }

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

  const toggleStoreStatus = () => {
    setIsOnline((prevStatus) => !prevStatus);
    // Example: You can integrate this with a backend API call
    console.log(`Store is now ${!isOnline ? "Online" : "Offline"}`);
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
            path === "/admin-dashboard/profile" && "text-primary font-bold"
          }`}
        >
          <Link href="/admin-dashboard/profile">Profile Overview</Link>
        </li>
        <li
          className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${
            path === "/admin-dashboard/ratings" && "text-primary font-bold"
          }`}
        >
          <Link href="/admin-dashboard/ratings">Ratings and Reviews</Link>
        </li>
        <li
          className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${
            path === "/admin-dashboard/help" && "text-primary font-bold"
          }`}
        >
          <Link href="/admin-dashboard/help">Help</Link>
        </li>

        {/* Online/Offline Toggle */}
        <li
          className="flex items-center gap-2 cursor-pointer transition-all"
          onClick={toggleStoreStatus}
        >
          <div
            className={`relative w-12 h-6 rounded-full transition-all ${
              isOnline ? "bg-green-500" : "bg-gray-300"
            }`}
          >
            <div
              className={`absolute w-6 h-6 bg-white rounded-full shadow-md transition-transform transform ${
                isOnline ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </div>
          <span className={`${isOnline ? "text-green-500" : "text-red-500"}`}>
            {isOnline ? "Online" : "Offline"}
          </span>
        </li>

        {/* Logout Button */}
        <li>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-700 transition-all"
          >
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
}

export default Header;
