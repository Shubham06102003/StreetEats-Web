// import React, { useState, useEffect } from "react";
// import { db } from "@/lib/firebase";
// import { getAuth } from "firebase/auth";
// import { doc, updateDoc } from "firebase/firestore";

// const MenuCard = ({ menu, onDelete, onEdit }) => {
//   const [isEditing, setIsEditing] = useState(false);
//   const [editedMenu, setEditedMenu] = useState({
//     name: menu.name,
//     category: menu.category,
//     description: menu.description,
//     image: menu.image,
//     price: menu.price,
//   });
//   const [uploading, setUploading] = useState(false);
//   const [imageFile, setImageFile] = useState(null);

//   const auth = getAuth();
//   const userEmail = auth.currentUser?.email;

//   const handleImageUpload = async () => {
//     if (!imageFile) return alert("Select an image.");
//     const formData = new FormData();
//     formData.append("file", imageFile);
//     formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);

//     try {
//       setUploading(true);
//       const response = await fetch(
//         `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
//         { method: "POST", body: formData }
//       );
//       const data = await response.json();
//       return data.secure_url || Promise.reject("Upload failed.");
//     } catch (error) {
//       alert("Upload failed.");
//       return null;
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handleSave = async () => {
//     if (editedMenu.name && editedMenu.category && editedMenu.description) {
//       const imageURL = await handleImageUpload();
//       if (imageURL) editedMenu.image = imageURL;

//       await updateDoc(doc(db, "menus", menu.id), {
//         ...editedMenu,
//         email: userEmail,
//       });

//       onEdit(menu.id, editedMenu);
//       setIsEditing(false);
//     } else {
//       alert("Fill all fields.");
//     }
//   };

//   useEffect(() => {
//     setEditedMenu({
//       name: menu.name,
//       category: menu.category,
//       description: menu.description,
//       image: menu.image,
//       price: menu.price,
//     });
//   }, [menu]);

//   return (
//     <>
//       <div className="bg-white shadow-md rounded-md p-2 w-[500px] h-[160px] card">
//         <div className="flex space-x-4">
//           {menu.image && (
//             <img src={menu.image} alt="Menu" className="w-[125px] h-[125px] object-cover rounded-md" />
//           )}
//           <div className="flex flex-col space-y-1">
//             <h3 className="text-sm font-semibold truncate">{menu.name}</h3>
//             <p className="text-xs">{menu.category}</p>
//             <p className="text-xs">{menu.description}</p>
//             <p className="text-sm font-bold">{"₹ " + menu.price}</p>
//             <div className="flex space-x-2 mt-2">
//               <button className="bg-green-500 text-white px-2 py-1 rounded-md text-xs" onClick={() => setIsEditing(true)}>
//                 Edit
//               </button>
//               <button className="bg-red-500 text-white px-2 py-1 rounded-md text-xs" onClick={() => onDelete(menu.id)}>
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {isEditing && (
//         <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
//           <div className="bg-white p-4 rounded-md shadow-lg w-80">
//             <h3 className="text-lg font-semibold mb-3">Edit Menu Item</h3>
//             <input
//               type="text"
//               value={editedMenu.name}
//               onChange={(e) => setEditedMenu({ ...editedMenu, name: e.target.value })}
//               className="border rounded-md p-2 w-full mb-2"
//               placeholder="Menu Name"
//             />
//             <input
//               type="text"
//               value={editedMenu.category}
//               onChange={(e) => setEditedMenu({ ...editedMenu, category: e.target.value })}
//               className="border rounded-md p-2 w-full mb-2"
//               placeholder="Category"
//             />
//             <textarea
//               value={editedMenu.description}
//               onChange={(e) => setEditedMenu({ ...editedMenu, description: e.target.value })}
//               className="border rounded-md p-2 w-full mb-2"
//               placeholder="Description (Max 125 Characters Allowed)"
//               maxLength={125}
//             />
//             <input
//               type="text"
//               value={editedMenu.price}
//               onChange={(e) => setEditedMenu({ ...editedMenu, price: e.target.value })}
//               className="border rounded-md p-2 w-full mb-2"
//               placeholder="Price"
//             />
//             <input
//               type="file"
//               accept="image/*"
//               onChange={(e) => setImageFile(e.target.files[0])}
//               className="border rounded-md p-2 w-full mb-2"
//             />
//             {editedMenu.image && (
//               <img src={editedMenu.image} alt="Menu" className="w-24 h-24 object-cover mb-2 rounded-md" />
//             )}
//             <button onClick={handleSave} disabled={uploading} className="bg-green-600 text-white px-4 py-2 rounded-md w-full mt-2">
//               {uploading ? "Uploading..." : "Save"}
//             </button>
//             <button onClick={() => setIsEditing(false)} className="bg-gray-400 text-white px-4 py-2 rounded-md w-full mt-2">
//               Cancel
//             </button>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default MenuCard;
"use client";

import React, { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { getAuth } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";

const MenuCard = ({ menu, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedMenu, setEditedMenu] = useState({
    name: menu.name,
    category: menu.category,
    description: menu.description,
    image: menu.image,
    price: menu.price,
  });
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const auth = getAuth();
  const userEmail = auth.currentUser?.email;

  // Function to pad description to 125 characters
  const padDescription = (desc) => {
    const maxLength = 125;
    return desc.length < maxLength ? desc.padEnd(maxLength, " ") : desc;
  };

  const handleImageUpload = async () => {
    if (!imageFile) return alert("Select an image.");
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);

    try {
      setUploading(true);
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );
      const data = await response.json();
      return data.secure_url || Promise.reject("Upload failed.");
    } catch (error) {
      alert("Upload failed.");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (editedMenu.name && editedMenu.category && editedMenu.description) {
      // Pad the description to 125 characters
      editedMenu.description = padDescription(editedMenu.description);

      const imageURL = await handleImageUpload();
      if (imageURL) editedMenu.image = imageURL;

      await updateDoc(doc(db, "menus", menu.id), {
        ...editedMenu,
        email: userEmail,
      });

      onEdit(menu.id, editedMenu);
      setIsEditing(false);
    } else {
      alert("Fill all fields.");
    }
  };

  useEffect(() => {
    setEditedMenu({
      name: menu.name,
      category: menu.category,
      description: menu.description,
      image: menu.image,
      price: menu.price,
    });
  }, [menu]);

  return (
    <>
      <div className="bg-white p-4 w-full">
        <div className="flex flex-col md:flex-row space-x-0 md:space-x-4">
          {menu.image && (
            <img
              src={menu.image}
              alt="Menu"
              className="w-full md:w-[125px] h-[125px] object-cover rounded-md mb-4 md:mb-0"
            />
          )}
          <div className="flex flex-col space-y-2">
            <h3 className="text-sm font-semibold truncate">{menu.name}</h3>
            <p className="text-xs">{menu.category}</p>
            <p className="text-xs">{menu.description}</p>
            <p className="text-sm font-bold">{"₹ " + menu.price}</p>
            <div className="flex space-x-2 mt-2">
              <button
                className="bg-green-500 text-white px-2 py-1 rounded-md text-xs"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </button>
              <button
                className="bg-red-500 text-white px-2 py-1 rounded-md text-xs"
                onClick={() => onDelete(menu.id)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md shadow-lg w-80">
            <h3 className="text-lg font-semibold mb-3">Edit Menu Item</h3>
            <input
              type="text"
              value={editedMenu.name}
              onChange={(e) =>
                setEditedMenu({ ...editedMenu, name: e.target.value })
              }
              className="border rounded-md p-2 w-full mb-2"
              placeholder="Menu Name"
            />
            <input
              type="text"
              value={editedMenu.category}
              onChange={(e) =>
                setEditedMenu({ ...editedMenu, category: e.target.value })
              }
              className="border rounded-md p-2 w-full mb-2"
              placeholder="Category"
            />
            <textarea
              value={editedMenu.description}
              onChange={(e) =>
                setEditedMenu({ ...editedMenu, description: e.target.value })
              }
              className="border rounded-md p-2 w-full mb-2"
              placeholder="Description (Max 125 Characters Allowed)"
              maxLength={125}
            />
            <input
              type="text"
              value={editedMenu.price}
              onChange={(e) =>
                setEditedMenu({ ...editedMenu, price: e.target.value })
              }
              className="border rounded-md p-2 w-full mb-2"
              placeholder="Price"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              className="border rounded-md p-2 w-full mb-2"
            />
            {editedMenu.image && (
              <img
                src={editedMenu.image}
                alt="Menu"
                className="w-24 h-24 object-cover mb-2 rounded-md"
              />
            )}
            <button
              onClick={handleSave}
              disabled={uploading}
              className="bg-green-600 text-white px-4 py-2 rounded-md w-full mt-2"
            >
              {uploading ? "Uploading..." : "Save"}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-400 text-white px-4 py-2 rounded-md w-full mt-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default MenuCard;
