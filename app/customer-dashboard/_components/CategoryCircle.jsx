import React from "react";

const categories = [
  { label: "North Indian", image: "https://via.placeholder.com/100?text=North+Indian" },
  { label: "Chaat", image: "https://via.placeholder.com/100?text=Chaat" },
  { label: "Desserts", image: "https://via.placeholder.com/100?text=Desserts" },
  { label: "South Indian", image: "https://via.placeholder.com/100?text=South+Indian" },
  { label: "Burger", image: "/burger.png" },
  { label: "Pizza", image: "/pizza.png" },
  { label: "Biryani", image: "https://via.placeholder.com/100?text=Biryani" },
  { label: "Rolls", image: "https://via.placeholder.com/100?text=Rolls" },
  { label: "Chicken", image: "https://via.placeholder.com/100?text=Chicken" },
  { label: "Chinese", image: "https://via.placeholder.com/100?text=Chinese" },
  { label: "Thali", image: "https://via.placeholder.com/100?text=Thali" },
  { label: "Ice Cream", image: "https://via.placeholder.com/100?text=Ice+Cream" },
  { label: "Sandwich", image: "https://via.placeholder.com/100?text=Sandwich" },
  { label: "Chaap", image: "https://via.placeholder.com/100?text=Chaap" },
  { label: "Italian", image: "https://via.placeholder.com/100?text=Italian" },
  { label: "Pav Bhaji", image: "https://via.placeholder.com/100?text=Pav+Bhaji" },
  { label: "Momos", image: "https://via.placeholder.com/100?text=Momos" },
  { label: "Waffles", image: "https://via.placeholder.com/100?text=Waffles" },
  { label: "Vada Pav", image: "https://via.placeholder.com/100?text=Vada+Pav" },
  { label: "Tea", image: "https://via.placeholder.com/100?text=Tea" },
];

export default function CategoryCircle() {
  return (
    <div className="flex gap-4">
      {categories.map((category, index) => (
        <div
          key={index}
          className="flex flex-col items-center w-24 flex-shrink-0 transform transition-transform duration-300 ease-in-out hover:scale-95 cursor-pointer"
        >
          <div className="w-20 h-20 bg-gray-200 rounded-full shadow-md flex items-center justify-center overflow-hidden">
            {category.image ? (
              <img
                src={category.image}
                alt={category.label}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-gray-500 text-sm">No Image</div>
            )}
          </div>
          <p className="text-sm mt-2 text-center">{category.label}</p>
        </div>
      ))}
    </div>
  );
}
