import React, { useState } from "react";
import axios from "axios";

export default function AddWatch() {
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    price: "",
    description: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const data = new FormData();
    data.append("name", formData.name);
    data.append("brand", formData.brand);
    data.append("price", formData.price);
    data.append("description", formData.description);
    data.append("image", image);

    await axios.post(
      "http://localhost:5000/api/v1/watches",
      data,
      {
        headers: {
          Authorization: `Bearer ${window.__authToken}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    alert("✅ Product Added Successfully");

    // clear form
    setFormData({
      name: "",
      brand: "",
      price: "",
      description: "",
    });
    setImage(null);
    setPreview(null);

  } catch (err) {
    console.error(err);
    alert("❌ Failed to add product");
  }
};

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-8">
        Add New Product
      </h1>

      <div className="bg-white rounded-2xl shadow-xl p-10 space-y-6 text-gray-800">
        <form onSubmit={handleSubmit} className="space-y-6">

          <input
            type="text"
            name="name"
            placeholder="Product Name"
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border"
          />

          <input
            type="text"
            name="brand"
            placeholder="Brand"
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border"
          />

          <input
            type="number"
            name="price"
            placeholder="Price"
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border"
          />

          <textarea
            name="description"
            placeholder="Description"
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border"
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />

          {preview && (
            <img
              src={preview}
              alt="preview"
              className="h-40 mt-4 rounded-lg"
            />
          )}

          <button
            type="submit"
            className="bg-black text-white px-8 py-3 rounded-lg"
          >
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
}