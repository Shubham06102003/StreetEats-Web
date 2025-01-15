import Link from "next/link";

export default function NearbyStreetfoodCard() {
  const streetfoodItems = [
    {
      title: "Chaat Corner",
      description: "Delicious chaat with a variety of toppings.",
      rating: 4.5,
      imageUrl: "https://via.placeholder.com/150?text=Chaat+Corner"
    },
    {
      title: "Biryani House",
      description: "Authentic biryani served fresh.",
      rating: 4.5,
      imageUrl: "https://via.placeholder.com/150?text=Biryani+House"
    },
    {
      title: "Pani Puri Street",
      description: "Taste the most crispy and spicy pani puri.",
      rating: 1.5,
      imageUrl: "https://via.placeholder.com/150?text=Pani+Puri+Street"
    },
    {
      title: "Samosa Stand",
      description: "Crispy samosas with a blend of spices.",
      rating: 3.5,
      imageUrl: "https://via.placeholder.com/150?text=Samosa+Stand"
    }
  ];

  // Function to get rating color based on the rating value
  const getRatingColor = (rating) => {
    if (rating < 2) return "bg-red-500"; // Red for rating < 2
    if (rating >= 2 && rating < 4) return "bg-yellow-400"; // Yellow for 2 <= rating < 4
    return "bg-green-500"; // Green for rating >= 4
  };

  return (
    <div className="w-full max-w-6xl mt-8">
      <div className="flex justify-between items-center mb-4 ">
        <h2 className="text-2xl font-semibold">Nearby Streetfood</h2>
        <Link href="/customer-dashboard/nearby-streetfood" className="text-sm text-blue-500 hover:underline">
          See More
        </Link>
      </div>
      <div className="flex gap-6 overflow-x-auto ">
        {streetfoodItems.map((item, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-lg shadow-lg w-72 transform transition-transform duration-300 ease-in-out hover:scale-95 card"
          >
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-40 object-cover rounded-t-lg"
            />
            <div className="pt-4">
              <h3 className="text-lg font-semibold">{item.title}</h3>
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
