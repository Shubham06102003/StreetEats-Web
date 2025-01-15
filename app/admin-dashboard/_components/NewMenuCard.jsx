import React, { useState } from "react";
import { getAuth } from "firebase/auth"; // Firebase Auth to get current user's email
import { db } from "@/lib/firebase"; // Import Firebase Firestore
import { collection, addDoc } from "firebase/firestore";
import { toast } from "react-toastify";

function NewMenuCard({ setShowNewMenu, refreshMenus }) {
  const [menuName, setMenuName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [price,setPrice] = useState("");

  const auth = getAuth();
  const userEmail = auth.currentUser?.email; // Get current user's email

  const handleImageUpload = async () => {
    if (!imageFile) {
      alert("Please select an image.");
      return null;
    }

    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);

    try {
      setUploading(true);
      
      // Upload image to Cloudinary
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      if (data.secure_url) {
        return data.secure_url; // Cloudinary URL for the uploaded image
      } else {
        throw new Error("Image upload failed.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Image upload failed. Please try again.");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (menuName && category && description && imageFile && userEmail) {
      const imageURL = await handleImageUpload(); // Upload the image
      if (!imageURL) return;

      try {
        // Save menu to Firestore with the uploaded image URL
        const menuCollectionRef = collection(db, "menus");
        await addDoc(menuCollectionRef, {
          name: menuName,
          category,
          description,
          image: imageURL, // Store uploaded image URL
          email: userEmail, // Add email of the logged-in user
          price: price
        });

        // Clear input fields
        setMenuName("");
        setCategory("");
        setDescription("");
        setPrice("");
        setImageFile(null);

        toast.success("Menu item added successfully!");
        setShowNewMenu(false); // Close the new menu card

        // Refresh the menu list
        refreshMenus(); // Refresh menu list from the parent component
      } catch (error) {
        console.error("Error adding menu item:", error);
        toast.error("Failed to add the new menu item. Please try again.");
      }
    } else {
      toast.error("All fields are required.");
    }
  };

  return (
    <div className="bg-white p-6 w-full max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Add New Menu Item</h2>
      <input
        type="text"
        placeholder="Menu Name"
        value={menuName}
        onChange={(e) => setMenuName(e.target.value)}
        className="border border-gray-300 rounded-md p-2 w-full mb-3"
      />
      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="border border-gray-300 rounded-md p-2 w-full mb-3"
      />
      <textarea
        placeholder="Description (Max 125 Characters)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border border-gray-300 rounded-md p-2 w-full mb-3"
        maxLength={125}
      />
      <input
        type="text"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="border border-gray-300 rounded-md p-2 w-full mb-3"
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImageFile(e.target.files[0])}
        className="border border-gray-300 rounded-md p-2 w-full mb-3"
      />
      <button
        onClick={handleSubmit}
        disabled={uploading}
        className="bg-blue-500 text-white px-4 py-2 rounded-md w-full"
      >
        {uploading ? "Uploading..." : "Submit"}
      </button>
    </div>
  );
}

export default NewMenuCard;
