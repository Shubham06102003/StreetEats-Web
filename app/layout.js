"use client";
import { useEffect, useState } from "react";
import Head from "next/head"; // Import Head for setting metadata in the head section
import { LoadScript } from "@react-google-maps/api"; // Import LoadScript
import "./globals.css";

export default function RootLayout({ children }) {
  const [darkMode, setDarkMode] = useState(false);

  // On initial load, check if dark mode preference is saved in localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedMode);
    if (savedMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    const newMode = !darkMode;
    localStorage.setItem("darkMode", newMode);
    if (newMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <html lang="en">
      <head>
        <Head>
          <title>StreetEats</title>
          <meta name="description" content="Street Food Finder and Locator" />
        </Head>
      </head>
      <body className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        {/* Load Google Maps Script */}
        <LoadScript
          googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY} // Use your Google Maps API Key
          libraries={["places"]} // Load the "places" library for Autocomplete
        >
          {/* Dark Mode Toggle Button */}
          <div className="fixed bottom-4 right-4">
            <button
              onClick={toggleDarkMode}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600"
            >
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>
          </div>

          {/* Render the rest of the app */}
          {children}
        </LoadScript>
      </body>
    </html>
  );
}
