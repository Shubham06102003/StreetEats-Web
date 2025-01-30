// import Link from "next/link";

// export default function NearbyStreetfoodCard() {
//   const streetfoodItems = [
//     {
//       title: "Chaat Corner",
//       description: "Delicious chaat with a variety of toppings.",
//       rating: 4.5,
//       imageUrl: "https://via.placeholder.com/150?text=Chaat+Corner"
//     },
//     {
//       title: "Biryani House",
//       description: "Authentic biryani served fresh.",
//       rating: 4.5,
//       imageUrl: "https://via.placeholder.com/150?text=Biryani+House"
//     },
//     {
//       title: "Pani Puri Street",
//       description: "Taste the most crispy and spicy pani puri.",
//       rating: 1.5,
//       imageUrl: "https://via.placeholder.com/150?text=Pani+Puri+Street"
//     },
//     {
//       title: "Samosa Stand",
//       description: "Crispy samosas with a blend of spices.",
//       rating: 3.5,
//       imageUrl: "https://via.placeholder.com/150?text=Samosa+Stand"
//     }
//   ];

//   // Function to get rating color based on the rating value
//   const getRatingColor = (rating) => {
//     if (rating < 2) return "bg-red-500"; // Red for rating < 2
//     if (rating >= 2 && rating < 4) return "bg-yellow-400"; // Yellow for 2 <= rating < 4
//     return "bg-green-500"; // Green for rating >= 4
//   };

//   return (
//     <div className="w-full max-w-6xl mt-8">
//       <div className="flex justify-between items-center mb-4 ">
//         <h2 className="text-2xl font-semibold">Nearby Streetfood</h2>
//         <Link href="/customer-dashboard/nearby-streetfood" className="text-sm text-blue-500 hover:underline">
//           See More
//         </Link>
//       </div>
//       <div className="flex gap-6 overflow-x-auto ">
//         {streetfoodItems.map((item, index) => (
//           <div
//             key={index}
//             className="bg-white p-4 rounded-lg shadow-lg w-72 transform transition-transform duration-300 ease-in-out hover:scale-95 card"
//           >
//             <img
//               src={item.imageUrl}
//               alt={item.title}
//               className="w-full h-40 object-cover rounded-t-lg"
//             />
//             <div className="pt-4">
//               <h3 className="text-lg font-semibold">{item.title}</h3>
//               <p className="text-sm text-gray-600 mt-2 dark:text-slate-300">{item.description}</p>
//               <div className="mt-2">
//                 <span
//                   className={`inline-block ${getRatingColor(item.rating)} text-white text-xs px-2 py-1 rounded-full`}
//                 >
//                   {item.rating} ★
//                 </span>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
// import { useEffect, useState } from "react";
// import { collection, getDocs, query, where } from "firebase/firestore";
// import { db } from "@/lib/firebase"; // Import the Firestore database instance
// import { getAuth } from "firebase/auth";

// // Function to fetch latitude and longitude from address
// const fetchGeocodeAddress = async (address) => {
//   try {
//     const response = await fetch(
//       `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
//         address
//       )}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}`
//     );
//     const data = await response.json();

//     console.log("Geocoding response:", data); // Log the API response

//     if (data.status === "OK") {
//       const { lat, lng } = data.results[0].geometry.location;
//       return { lat, lng };
//     } else {
//       throw new Error("Unable to geocode address");
//     }
//   } catch (error) {
//     console.error("Geocoding error:", error);
//     return null;
//   }
// };

// // Haversine distance formula to calculate distance between two coordinates
// const haversineDistance = (lat1, lon1, lat2, lon2) => {
//   const toRad = (x) => (x * Math.PI) / 180;
//   const R = 6371; // Radius of Earth in kilometers
//   const dLat = toRad(lat2 - lat1);
//   const dLon = toRad(lon2 - lon1);
//   const a =
//     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//     Math.cos(toRad(lat1)) *
//       Math.cos(toRad(lat2)) *
//       Math.sin(dLon / 2) *
//       Math.sin(dLon / 2);
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   return R * c; // Distance in kilometers
// };

// const auth = getAuth();
//   const user = auth.currentUser
//   console.log(user.email);

// // Fetch customer location from Firestore using cus_email
// const getCustomerLocationFromDb = async (cus_email) => {
  
//   const customerRef = collection(db, "customers");
//   const q = query(customerRef, where("cus_email", "==", user.email)); // Fetch by cus_email
//   const querySnapshot = await getDocs(q);
  
//   if (!querySnapshot.empty) {
//     const customerData = querySnapshot.docs[0].data();
//     console.log(customerData.location)
//     return customerData.location; // Assuming location is stored as a string
//   }
//   console.error("Customer location not found.");
//   return null;
// };

// // Fetch stores data from Firestore using email
// const getStoresFromDb = async (store_email) => {
//   const storesRef = collection(db, "stores");
//   const q = query(storesRef, where("email", "==", store_email)); // Fetch by store email
//   const storesSnapshot = await getDocs(q);
//   const stores = [];
  
//   storesSnapshot.forEach((doc) => {
//     stores.push(doc.data()); // Assuming store data contains a location string
//   });
  
//   console.log("Stores from Firestore:", stores); // Log store data
//   return stores;
// };

// export default function NearbyStreetfoodCard() {
//   const [streetfoodItems, setStreetfoodItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [cus_email, setCusEmail] = useState("customer@example.com"); // Set the customer's email
//   const [store_email, setStoreEmail] = useState("store@example.com"); // Set the store's email

//   useEffect(() => {
//     const getNearestStreetFood = async () => {
//       try {
//         // Fetch customer location
//         const customerLocation = await getCustomerLocationFromDb(cus_email);
//         if (!customerLocation) {
//           setError("Customer location not available.");
//           setLoading(false);
//           return;
//         }

//         // Geocode the customer location
//         const customerLatLon = await fetchGeocodeAddress(customerLocation);
//         if (!customerLatLon) {
//           setError("Unable to geocode customer location.");
//           setLoading(false);
//           return;
//         }

//         const customerLat = customerLatLon.lat;
//         const customerLon = customerLatLon.lng;

//         // Fetch store locations from Firestore
//         const stores = await getStoresFromDb(store_email);
        
//         // Geocode each store's address and calculate distance
//         const storesWithDistance = await Promise.all(
//           stores.map(async (store) => {
//             const storeLocation = await fetchGeocodeAddress(store.location); // Geocode the store location
//             if (storeLocation) {
//               const distance = haversineDistance(
//                 customerLat,
//                 customerLon,
//                 storeLocation.lat,
//                 storeLocation.lng
//               );
//               console.log(`Store: ${store.title}, Distance: ${distance} km`); // Log the distance
//               return { ...store, distance };
//             }
//             return null; // Skip store if geocoding fails
//           })
//         );

//         // Filter out stores where geocoding failed
//         const validStores = storesWithDistance.filter((store) => store !== null);

//         // Sort stores by distance and limit to 20 items
//         const sortedStores = validStores
//           .sort((a, b) => a.distance - b.distance)
//           .slice(0, 20);

//         console.log("Sorted stores:", sortedStores); // Log sorted stores
//         setStreetfoodItems(sortedStores);
//       } catch (err) {
//         setError("Error fetching nearby street food.");
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     getNearestStreetFood();
//   }, [cus_email, store_email]); // Re-run when email changes

//   // Render the component
//   return (
//     <div className="w-full max-w-6xl mt-8">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-2xl font-semibold">Nearby Streetfood</h2>
//       </div>
//       {loading && <p>Loading...</p>}
//       {/* {error && <p className="text-red-500">{error}</p>} */}
//       <div className="flex gap-6 overflow-x-auto">
//         {streetfoodItems.length === 0 ? (
//           <p>No nearby streetfood found.</p> // Display a message when no streetfood found
//         ) : (
//           streetfoodItems.map((item, index) => (
//             <div
//               key={index}
//               className="bg-white p-4 rounded-lg shadow-lg w-72 transform transition-transform duration-300 ease-in-out hover:scale-95 card"
//             >
//               <img
//                 src={item.imageUrl || "https://via.placeholder.com/150?text=Store+Image"}
//                 alt={item.title}
//                 className="w-full h-40 object-cover rounded-t-lg"
//               />
//               <div className="pt-4">
//                 <h3 className="text-lg font-semibold">{item.title}</h3>
//                 <p className="text-sm text-gray-600 mt-2">{item.description}</p>
//                 <div className="mt-2">
//                   <span
//                     className={`inline-block ${
//                       item.rating < 2
//                         ? "bg-red-500"
//                         : item.rating >= 4
//                         ? "bg-green-500"
//                         : "bg-yellow-400"
//                     } text-white text-xs px-2 py-1 rounded-full`}
//                   >
//                     {item.rating} ★
//                   </span>
//                 </div>
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }

"use client"
import React, { useState, useEffect } from 'react';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const NearbyStreetFood = ({ customerEmail }) => {
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNearbyFood = async () => {
      try {
        // Get customer location
        const customerDoc = await getDocs(collection(db, 'customers'));
        const customerData = customerDoc.docs
          .find(doc => doc.id === customerEmail)?.data();

        if (!customerData) {
          console.error('Customer not found');
          return;
        }

        const customerLat = customerData.userLatitude;
        const customerLng = customerData.userLongitude;

        // Get all stores
        const storesSnapshot = await getDocs(collection(db, 'stores'));
        const stores = storesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Get all menu items
        const menusSnapshot = await getDocs(collection(db, 'menus'));
        const menuItems = menusSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Calculate distance and combine store and menu data
        const itemsWithDistance = menuItems.map(item => {
          const store = stores.find(s => s.email === item.email);
          if (!store) return null;

          // Calculate distance using Haversine formula
          const distance = calculateDistance(
            customerLat,
            customerLng,
            store.storeLatitude,
            store.storeLongitude
          );

          return {
            ...item,
            distance,
            storeLocation: store.location,
            isStoreOnline: store.isOnline
          };
        }).filter(item => item !== null);

        // Sort by distance
        const sortedItems = itemsWithDistance.sort((a, b) => a.distance - b.distance);
        setFoodItems(sortedItems);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching nearby food:', error);
        setLoading(false);
      }
    };

    fetchNearbyFood();
  }, [customerEmail]);

  // Haversine formula to calculate distance between two points
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const toRad = (value) => {
    return value * Math.PI / 180;
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '1rem' }}>Loading nearby food items...</div>;
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '1rem',
      padding: '1rem'
    }}>
      {foodItems.map((item) => (
        <div 
          key={item.id} 
          style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            overflow: 'hidden',
            backgroundColor: 'white',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          <img 
            src={item.image} 
            alt={item.name}
            style={{
              width: '100%',
              height: '200px',
              objectFit: 'cover'
            }}
          />
          <div style={{ padding: '1rem' }}>
            <h3 style={{ 
              margin: '0 0 0.5rem 0',
              fontSize: '1.25rem',
              fontWeight: 'bold'
            }}>
              {item.name}
            </h3>
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '0.5rem'
            }}>
              <span style={{ 
                color: '#22c55e', 
                fontWeight: '600'
              }}>
                ₹{item.price}
              </span>
              <span style={{
                padding: '0.25rem 0.75rem',
                borderRadius: '9999px',
                fontSize: '0.875rem',
                backgroundColor: item.isStoreOnline ? '#dcfce7' : '#fee2e2',
                color: item.isStoreOnline ? '#166534' : '#991b1b'
              }}>
                {item.isStoreOnline ? 'Open' : 'Closed'}
              </span>
            </div>

            <p style={{ 
              color: '#4b5563',
              fontSize: '0.875rem',
              marginBottom: '1rem'
            }}>
              {item.description}
            </p>

            <div style={{ 
              fontSize: '0.875rem',
              color: '#6b7280'
            }}>
              <p style={{ margin: '0.25rem 0' }}>
                📍 {item.storeLocation}
              </p>
              <p style={{ margin: '0.25rem 0' }}>
                📏 {item.distance.toFixed(1)} km away
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NearbyStreetFood;