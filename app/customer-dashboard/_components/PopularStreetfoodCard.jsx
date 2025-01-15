import Link from "next/link";

export default function PopularStreetfoodCard() {
  const popularStreetfoodItems = [
    {
      title: "Pav Bhaji",
      description: "Spicy and flavorful pav bhaji with butter.",
      rating: 4.5,
      imageUrl: "https://via.placeholder.com/150?text=Pav+Bhaji"
    },
    {
      title: "Momos",
      description: "Tasty steamed momos served with chutney.",
      rating: 2.8,
      imageUrl: "https://via.placeholder.com/150?text=Momos"
    },
    {
      title: "Bhel Puri",
      description: "Crispy, tangy, and sweet bhel puri.",
      rating: 1.7,
      imageUrl: "https://via.placeholder.com/150?text=Bhel+Puri"
    },
    {
      title: "Maharaja Thali",
      description: "A royal thali with an assortment of flavors.",
      rating: 4.6,
      imageUrl: "https://via.placeholder.com/150?text=Maharaja+Thali"
    }
  ];

  // Function to get rating color based on the rating value
  const getRatingColor = (rating) => {
    if (rating < 2) return "bg-red-500"; // Red for rating < 2
    if (rating >= 2 && rating < 4) return "bg-yellow-400"; // Yellow for 2 <= rating < 4
    return "bg-green-500"; // Green for rating >= 4
  };

  return (
    <div className="w-full max-w-6xl mt-12 mb-12">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Popular Streetfood</h2>
        <Link href="/customer-dashboard/popular-streetfood" className="text-sm text-blue-500 hover:underline">
          See More
        </Link>
      </div>
      <div className="flex gap-6 overflow-x-auto">
        {popularStreetfoodItems.map((item, index) => (
          <div
            key={index}
            className="bg-white p-5 rounded-xl shadow-xl w-80 transform transition-transform duration-300 ease-in-out hover:scale-95 card"
          >
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-48 object-cover rounded-t-xl"
            />
            <div className="pt-4">
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <p className="text-sm text-gray-600 mt-2 dark:text-slate-300">{item.description}</p>
              <div className="mt-2">
                <span
                  className={`inline-block ${getRatingColor(item.rating)} text-white text-xs px-2 py-1 rounded-full`}
                >
                  {item.rating} ★
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
