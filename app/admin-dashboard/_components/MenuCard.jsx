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
      <div className="card bg-white dark:bg-[#1e1c2e] text-black dark:text-[#e0e0e0] p-4 w-full rounded-lg shadow-md flex flex-col items-start text-left min-h-[300px] justify-between">
        {/* Image */}
        {menu.image && (
          <img
            src={menu.image}
            alt="Menu"
            className="w-full h-40 object-cover rounded-md mb-3"
          />
        )}

        {/* Content */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{menu.name || "No Name"}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {menu.category || "No Category"}
          </p>
          <p className="text-xs text-gray-700 dark:text-gray-300 min-h-[60px]">
            {menu.description || "No Description"}
          </p>
        </div>

        {/* Price & Buttons */}
        <div className="mt-auto w-full">
          <p className="text-md font-bold mt-2">{"₹ " + (menu.price || "0")}</p>
          <div className="flex space-x-3 mt-3 justify-center">
            <button
              className="bg-green-500 text-white px-4 py-1 rounded-md text-sm"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
            <button
              className="bg-red-500 text-white px-4 py-1 rounded-md text-sm"
              onClick={() => onDelete(menu.id)}
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white dark:bg-[#2a2a3c] p-6 rounded-md shadow-lg w-80">
            <h3 className="text-lg font-semibold text-black dark:text-[#e0e0e0] mb-3">
              Edit Menu Item
            </h3>
            <input
              type="text"
              value={editedMenu.name}
              onChange={(e) =>
                setEditedMenu({ ...editedMenu, name: e.target.value })
              }
              className="border dark:border-[#4b4b6b] dark:bg-[#1e1c2e] dark:text-[#e0e0e0] rounded-md p-2 w-full mb-2"
              placeholder="Menu Name"
            />
            <input
              type="text"
              value={editedMenu.category}
              onChange={(e) =>
                setEditedMenu({ ...editedMenu, category: e.target.value })
              }
              className="border dark:border-[#4b4b6b] dark:bg-[#1e1c2e] dark:text-[#e0e0e0] rounded-md p-2 w-full mb-2"
              placeholder="Category"
            />
            <textarea
              value={editedMenu.description}
              onChange={(e) =>
                setEditedMenu({ ...editedMenu, description: e.target.value })
              }
              className="border dark:border-[#4b4b6b] dark:bg-[#1e1c2e] dark:text-[#e0e0e0] rounded-md p-2 w-full mb-2"
              placeholder="Description (Max 125 Characters Allowed)"
              maxLength={125}
            />
            <input
              type="text"
              value={editedMenu.price}
              onChange={(e) =>
                setEditedMenu({ ...editedMenu, price: e.target.value })
              }
              className="border dark:border-[#4b4b6b] dark:bg-[#1e1c2e] dark:text-[#e0e0e0] rounded-md p-2 w-full mb-2"
              placeholder="Price"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              className="border dark:border-[#4b4b6b] dark:bg-[#1e1c2e] dark:text-[#e0e0e0] rounded-md p-2 w-full mb-2"
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
