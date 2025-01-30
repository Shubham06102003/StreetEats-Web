"use client";
import React, { useState, useEffect } from "react";
import { db } from "@/lib/firebase"; // Assuming you have set up Firebase and exported the Firestore instance
import { doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import Header from "../_components/Header";
import axios from 'axios';  // For making requests to Cloudinary

const VendorProfile = () => {
  const [vendor, setVendor] = useState({
    photo: null,
    name: "", 
    category: "", 
    description: "", 
    email: "abcd@gmail.com",  // Assuming this is provided through authentication
    location: "",
    status: "",
    storeLatitude: "",
    storeLongitude: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch vendor's store details from Firestore based on email
  const fetchStoreData = async (email) => {
    try {
      const docRef = doc(db, "vendor", email); // Assuming 'stores' collection and 'email' as the document ID
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const storeData = docSnap.data();
        setVendor((prevVendor) => ({
          ...prevVendor,
          location: storeData.location,
          status: storeData.status,
          storeLatitude: storeData.storeLatitude,
          storeLongitude: storeData.storeLongitude,
          name: storeData.name || prevVendor.name,
          category: storeData.category || prevVendor.category,
          description: storeData.description || prevVendor.description,
          photo: storeData.photo || prevVendor.photo,
        }));

        // Real-time updates with onSnapshot
        onSnapshot(docRef, (snapshot) => {
          const updatedStoreData = snapshot.data();
          setVendor((prevVendor) => ({
            ...prevVendor,
            location: updatedStoreData.location,
            status: updatedStoreData.status,
            storeLatitude: updatedStoreData.storeLatitude,
            storeLongitude: updatedStoreData.storeLongitude,
            name: updatedStoreData.name || prevVendor.name,
            category: updatedStoreData.category || prevVendor.category,
            description: updatedStoreData.description || prevVendor.description,
            photo: updatedStoreData.photo || prevVendor.photo,
          }));
        });
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching store data: ", error);
    }
  };

  // Push vendor data to the Firestore 'vendor' collection in real-time
  const pushToVendorCollection = async () => {
    try {
      const docRef = doc(db, "vendor", vendor.email); // Use vendor email as the document ID in 'vendor' collection
      await setDoc(docRef, {
        photo: vendor.photo,
        name: vendor.name,
        category: vendor.category,
        description: vendor.description,
        location: vendor.location,
        status: vendor.status,
        storeLatitude: vendor.storeLatitude,
        storeLongitude: vendor.storeLongitude,
        email: vendor.email,
      });
      console.log("Vendor data pushed to 'vendor' collection successfully");
    } catch (error) {
      console.error("Error pushing data to 'vendor' collection: ", error);
    }
  };

  // Function to upload the photo to Cloudinary and get the URL
  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET); // Using environment variable
        formData.append("cloud_name", process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME); // Using environment variable

        // Upload the image to Cloudinary
        const response = await axios.post(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, formData);
        const imageUrl = response.data.secure_url;  // URL of the uploaded image

        setVendor((prevVendor) => ({
          ...prevVendor,
          photo: imageUrl,
        }));
      } catch (error) {
        console.error("Error uploading photo to Cloudinary: ", error);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVendor((prevVendor) => ({
      ...prevVendor,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsEditing(false);
    setIsModalOpen(false);  // Close the modal when form is submitted
    pushToVendorCollection(); // Push data to the 'vendor' collection when the form is submitted
  };

  const handleEdit = () => {
    setIsEditing(true);
    setIsModalOpen(true); // Open the modal when the "Edit Profile" button is clicked
  };

  const handleAddData = () => {
    setIsEditing(true);
    setIsModalOpen(true); // Open the modal when "Add Data" is clicked
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  useEffect(() => {
    const email = "abcd@gmail.com"; // Replace this with dynamic email (e.g., from authentication)
    fetchStoreData(email); // Fetch store details from Firestore based on email
  }, []);

  return (
    <div>
      <Header />
      <div className="w-full h-full mx-auto p-6">
        <h2 className="text-2xl font-semibold text-center mb-6">Vendor Profile Overview</h2>
        <div className="mb-4 text-center">
          {vendor.photo ? (
            <img src={vendor.photo} alt="Vendor" className="w-32 h-32 rounded-full mx-auto mb-4" />
          ) : (
            <div className="w-32 h-32 rounded-full mx-auto mb-4 bg-gray-300" />
          )}
          <p className="font-medium text-xl">{vendor.name || "Vendor Name"}</p>
          <p className="text-gray-600">{vendor.category || "Category"}</p>
          <p className="text-gray-600">{vendor.description || "Description of the vendor."}</p>

          {/* Fetched store data */}
          <p className="mt-2 font-medium text-gray-700">Store Status: <span className={vendor.status === "Online" ? "text-green-600" : "text-red-600"}>{vendor.status || "Offline"}</span></p>
          <p className="text-gray-600">Location: {vendor.location || "Vendor Location"}</p>
          <p className="text-gray-600">Latitude: {vendor.storeLatitude || "0.0000"}</p>
          <p className="text-gray-600">Longitude: {vendor.storeLongitude || "0.0000"}</p>
        </div>

        <div className="mt-4 text-center">
          {vendor.name || vendor.category || vendor.description || vendor.location ? (
            <button
              onClick={handleEdit}
              className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Edit Profile
            </button>
          ) : (
            <button
              onClick={handleAddData}
              className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-300"
            >
              Add Data
            </button>
          )}
        </div>
      </div>

      {/* Modal for editing vendor details */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-semibold mb-4">{vendor.name ? "Edit Vendor Profile" : "Add Vendor Profile"}</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block font-medium text-gray-700">Photo</label>
                <input
                  type="file"
                  onChange={handlePhotoChange}
                  className="mt-2 p-2 border border-gray-300 rounded-lg w-full"
                />
                {vendor.photo && (
                  <img src={vendor.photo} alt="Vendor" className="mt-4 w-32 h-32 rounded-full mx-auto" />
                )}
              </div>

              <div className="mb-4">
                <label className="block font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={vendor.name}
                  onChange={handleInputChange}
                  placeholder="Enter vendor name"
                  className="mt-2 p-2 border border-gray-300 rounded-lg w-full"
                />
              </div>

              <div className="mb-4">
                <label className="block font-medium text-gray-700">Category</label>
                <input
                  type="text"
                  name="category"
                  value={vendor.category}
                  onChange={handleInputChange}
                  placeholder="Enter vendor category"
                  className="mt-2 p-2 border border-gray-300 rounded-lg w-full"
                />
              </div>

              <div className="mb-4">
                <label className="block font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={vendor.description}
                  onChange={handleInputChange}
                  placeholder="Enter vendor description"
                  className="mt-2 p-2 border border-gray-300 rounded-lg w-full"
                  rows="4"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition duration-300"
              >
                Save Changes
              </button>
            </form>

            <button
              onClick={handleCloseModal}
              className="mt-4 w-full text-center text-red-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorProfile;

