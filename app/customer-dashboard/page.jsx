"use client"
import Header from "./_components/Header";
import CategoryCircle from "./_components/CategoryCircle";
import NearbyStreetfoodCard from "./_components/NearbyStreetfoodCard";
import PopularStreetfoodCard from "./_components/PopularStreetfoodCard";
import { useRef, useState, useEffect } from "react";

export default function CustomerDashboard() {
  const scrollContainerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftStart, setScrollLeftStart] = useState(0);

  // Dynamic placeholder logic
  const [currentFoodType, setCurrentFoodType] = useState("pizza");

  useEffect(() => {
    const foodTypes = ["pizza", "burger", "sandwich", "chinese"];
    let index = 0;

    const intervalId = setInterval(() => {
      index = (index + 1) % foodTypes.length;
      setCurrentFoodType(foodTypes[index]);
    }, 2000);

    return () => clearInterval(intervalId); // Clean up interval on component unmount
  }, []);

  // Handle mouse down to start dragging
  const handleMouseDown = (event) => {
    setIsDragging(true);
    setStartX(event.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeftStart(scrollContainerRef.current.scrollLeft);
    scrollContainerRef.current.style.cursor = "grabbing";
  };

  // Handle mouse move to perform the dragging action
  const handleMouseMove = (event) => {
    if (!isDragging) return;

    const x = event.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Multiply for faster scrolling
    scrollContainerRef.current.scrollLeft = scrollLeftStart - walk;
  };

  // Handle mouse up to stop dragging
  const handleMouseUp = () => {
    setIsDragging(false);
    scrollContainerRef.current.style.cursor = "grab";
  };

  return (
    <div>
      <Header />
      <div className="flex flex-col items-center ">
        {/* Search Bar */}
        <div className="w-full max-w-md mt-6">
          <input
            type="text"
            placeholder={`Search for ${currentFoodType}`}  // Dynamically changing placeholder
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-500"
          />
        </div>

        {/* Empty Space for Advertisement */}
        <div className="w-full max-w-6xl h-32 mt-6 bg-gray-100 flex items-center justify-center border border-gray-300 rounded-lg">
          <p className="text-gray-500">Ad Space (Coming Soon)</p>
        </div>

        {/* Food Category Section */}
        <div className="w-full max-w-6xl mt-8">
          <h2 className="text-2xl font-semibold mb-4">Food Categories</h2>
          <div
            ref={scrollContainerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="overflow-x-hidden cursor-grab scroll-smooth"
            style={{ cursor: "grab" }}
          >
            <CategoryCircle />
          </div>
        </div>

        {/* Nearby Streetfood Section */}
        <NearbyStreetfoodCard />

        {/* Popular Streetfood Section */}
        <PopularStreetfoodCard />
      </div>
    </div>
  );
}
