// "use client"
// import React, { useState, useEffect } from "react";
// import { collection, query, where, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
// import { db } from "@/lib/firebase";
// import MenuCard from "./_components/MenuCard";
// import NewMenuCard from "./_components/NewMenuCard";
// import { getAuth } from "firebase/auth";
// import Header from "./_components/Header";
// import { toast } from "react-toastify";

// export default function AdminDashboard() {
//   const [menus, setMenus] = useState([]);
//   const [showNewMenu, setShowNewMenu] = useState(false);
//   const [userEmail, setUserEmail] = useState(null);
//   const auth = getAuth();

//   // Fetch menus from Firestore
//   const fetchMenus = async (userEmail) => {
//     if (!userEmail) return;
//     const q = query(collection(db, "menus"), where("email", "==", userEmail));
//     const querySnapshot = await getDocs(q);
//     const menuList = querySnapshot.docs.map((doc) => ({
//       id: doc.id,
//       ...doc.data(),
//     }));
//     setMenus(menuList);
//   };

//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged((user) => {
//       if (user) {
//         setUserEmail(user.email);
//       } else {
//         setUserEmail(null);
//       }
//     });

//     return () => unsubscribe();
//   }, [auth]);

//   useEffect(() => {
//     if (userEmail) {
//       fetchMenus(userEmail);
//     }
//   }, [userEmail]);

//   // Function to remove a menu from the list after successful deletion
//   const removeMenu = (menuId) => {
//     setMenus((prevMenus) => prevMenus.filter((menu) => menu.id !== menuId));
//   };

//   // Function to handle the deletion of a menu
//   const handleDelete = async (menuId) => {
//     if (window.confirm("Are you sure you want to delete this menu item?")) {
//       try {
//         const menuRef = doc(db, "menus", menuId);
//         await deleteDoc(menuRef);
//         removeMenu(menuId); // Remove menu from UI after successful delete
//         toast.success("Menu item deleted successfully!");
//       } catch (error) {
//         console.error("Error deleting menu item:", error);
//         toast.error("Failed to delete the menu item. Please try again.");
//       }
//     }
//   };

//   // Function to handle the editing of a menu
//   const handleEdit = async (menuId, updatedMenuData) => {
//     try {
//       const menuRef = doc(db, "menus", menuId);
//       await updateDoc(menuRef, updatedMenuData);
      
//       // Immediately update the UI without needing to re-fetch the menus from Firestore
//       setMenus((prevMenus) =>
//         prevMenus.map((menu) =>
//           menu.id === menuId ? { ...menu, ...updatedMenuData } : menu
//         )
//       );
//       toast.success("Menu item updated successfully!");
//     } catch (error) {
//       console.error("Error updating menu item:", error);
//       toast.error("Failed to update the menu item. Please try again.");
//     }
//   };

//   return (
//     <div>
//       <Header />
//       <div className="p-6">
//         <h1 className="text-4xl font-bold mb-4">Admin Dashboard</h1>
//         <button
//           className="bg-blue-500 text-white px-4 py-2 rounded-md"
//           onClick={() => setShowNewMenu(true)}
//         >
//           Add New Menu
//         </button>

//         {/* New Menu Popup */}
//         {showNewMenu && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//             <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
//               <NewMenuCard
//                 setShowNewMenu={setShowNewMenu}
//                 refreshMenus={() => fetchMenus(userEmail)} // Pass refreshMenus directly
//               />
//               {/* X Button to close popup */}
//               <button
//                 className="absolute top-2 right-2 text-xl font-bold p-2"
//                 onClick={() => setShowNewMenu(false)}
//               >
//                 ×
//               </button>
//             </div>
//           </div>
//         )}

//         <div className="grid grid-cols-1 space-x-3 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
//           {menus.length === 0 ? (
//             <p>No menus available</p>
//           ) : (
//             menus.map((menu) => (
//               <MenuCard
//                 key={menu.id}
//                 menu={menu}
//                 onDelete={handleDelete} // Pass handleDelete function
//                 onEdit={handleEdit} // Pass handleEdit function
//               />
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";
import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import MenuCard from "./_components/MenuCard";
import NewMenuCard from "./_components/NewMenuCard";
import { getAuth } from "firebase/auth";
import Header from "./_components/Header";
import { toast } from "react-toastify";

export default function AdminDashboard() {
  const [menus, setMenus] = useState([]);
  const [showNewMenu, setShowNewMenu] = useState(false);
  const [userEmail, setUserEmail] = useState(null);
  const auth = getAuth();

  // Fetch menus from Firestore
  const fetchMenus = async (userEmail) => {
    if (!userEmail) return;
    const q = query(collection(db, "menus"), where("email", "==", userEmail));
    const querySnapshot = await getDocs(q);
    const menuList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setMenus(menuList);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserEmail(user.email);
      } else {
        setUserEmail(null);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    if (userEmail) {
      fetchMenus(userEmail);
    }
  }, [userEmail]);

  // Function to remove a menu from the list after successful deletion
  const removeMenu = (menuId) => {
    setMenus((prevMenus) => prevMenus.filter((menu) => menu.id !== menuId));
  };

  // Function to handle the deletion of a menu
  const handleDelete = async (menuId) => {
    if (window.confirm("Are you sure you want to delete this menu item?")) {
      try {
        const menuRef = doc(db, "menus", menuId);
        await deleteDoc(menuRef);
        removeMenu(menuId); // Remove menu from UI after successful delete
        toast.success("Menu item deleted successfully!");
      } catch (error) {
        console.error("Error deleting menu item:", error);
        toast.error("Failed to delete the menu item. Please try again.");
      }
    }
  };

  // Function to handle the editing of a menu
  const handleEdit = async (menuId, updatedMenuData) => {
    try {
      const menuRef = doc(db, "menus", menuId);
      await updateDoc(menuRef, updatedMenuData);
      
      // Immediately update the UI without needing to re-fetch the menus from Firestore
      setMenus((prevMenus) =>
        prevMenus.map((menu) =>
          menu.id === menuId ? { ...menu, ...updatedMenuData } : menu
        )
      );
      toast.success("Menu item updated successfully!");
    } catch (error) {
      console.error("Error updating menu item:", error);
      toast.error("Failed to update the menu item. Please try again.");
    }
  };

  return (
    <div>
      <Header />
      <div className="p-6">
        <h1 className="text-4xl font-bold mb-4">Admin Dashboard</h1>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
          onClick={() => setShowNewMenu(true)}
        >
          Add New Menu
        </button>

        {/* New Menu Popup */}
        {showNewMenu && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-full sm:w-96 w-full relative">
              <NewMenuCard
                setShowNewMenu={setShowNewMenu}
                refreshMenus={() => fetchMenus(userEmail)} // Pass refreshMenus directly
              />
              {/* X Button to close popup */}
              <button
                className="absolute top-2 right-2 text-xl font-bold p-2"
                onClick={() => setShowNewMenu(false)}
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Menu Cards */}
        <div className="w-full grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
          {menus.length === 0 ? (
            <p className="text-center text-lg text-gray-500">No menus available</p>
          ) : (
            menus.map((menu) => (
              <div key={menu.id} className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                <MenuCard
                  menu={menu}
                  onDelete={handleDelete} // Pass handleDelete function
                  onEdit={handleEdit} // Pass handleEdit function
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
