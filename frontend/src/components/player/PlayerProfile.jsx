import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const PlayerProfile = () => {
  const { user, loading, axiosInstance } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    dateOfBirth: "",
    gender: "",
    phone: "",
    preferredRole: "",
    battingStyle: "",
    bowlingStyle: [],
    experience: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  // Initialize form data when user data is loaded
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        dateOfBirth: user.dateOfBirth?.split("T")[0] || "",
        gender: user.gender || "",
        phone: user.phone || "",
        preferredRole: user.preferredRole || "",
        battingStyle: user.battingStyle || "",
        bowlingStyle: user.bowlingStyle || [],
        experience: user.experience || "",
      });

      if (user.imagePath) {
        const fullImageUrl = user.imagePath.startsWith("http")
          ? user.imagePath
          : `http://localhost:6030${user.imagePath}`;
        setImagePreview(fullImageUrl);
      }
    }

    // Navigation after 1000 seconds (for demo/testing purposes)
    const navigationTimer = setTimeout(() => {
      navigate("/");
    }, 1000000); // 1000 seconds = 1000000 milliseconds

    return () => clearTimeout(navigationTimer);
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "bowlingStyle") {
      setFormData((prev) => {
        const updated = checked
          ? [...prev.bowlingStyle, value]
          : prev.bowlingStyle.filter((s) => s !== value);
        return { ...prev, bowlingStyle: updated };
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Only image files are allowed");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Image size should be less than 10MB");
        return;
      }

      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put("/api/players/update", formData, {
        withCredentials: true, // Ensure credentials are sent with cookies
      });

      if (profileImage) {
        await uploadImage();
      }

      toast.success("Profile updated successfully", {});

      setEditMode(false);

      // Smooth transition after save
      setTimeout(() => {
        navigate(0); // Reload the page to reflect changes
      }, 1500);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update profile",
        {}
      );
    }
  };

  const uploadImage = async () => {
    if (!profileImage) return;

    setIsUploading(true);
    try {
      const imageFormData = new FormData();
      imageFormData.append("image", profileImage);
      imageFormData.append("id", user._id); // Add player ID here

      const response = await axiosInstance.post(
        "/api/players/image",
        imageFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true, // Ensure credentials are sent with cookies
        }
      );

      if (response.data.imagePath) {
        // Update local preview with full URL if needed
        const fullImageUrl = response.data.imagePath.startsWith("http")
          ? response.data.imagePath
          : `http://localhost:6030${response.data.imagePath}`;
        setImagePreview(fullImageUrl);
      }

      toast.success("Profile image updated successfully");
      setProfileImage(null);
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error(error.response?.data?.message || "Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const deleteImage = async () => {
    try {
      await axiosInstance.delete("/api/players/image", {
        data: { id: user._id }, // Send ID in body for deletion
        withCredentials: true,
      });
      setImagePreview("");
      toast.success("Profile image removed successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove image");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-semibold text-gray-700">
          Please login to view your profile
        </h2>
        <button
          onClick={() => navigate("/login")}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-xl rounded-2xl mt-10 mb-10 transition-all duration-300 hover:shadow-2xl mt-30">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Profile Image Section */}
        <div className="w-full md:w-1/3 flex flex-col items-center">
          <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-blue-500 shadow-lg transition-transform duration-300 hover:scale-105">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Profile"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/default-profile.png";
                }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                <span className="text-gray-500 text-lg">No Image</span>
              </div>
            )}
          </div>

          {editMode && (
            <div className="mt-4 w-full space-y-2 animate-fadeIn">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {imagePreview ? "Change Profile Image" : "Upload Profile Image"}
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100 transition-colors duration-300"
                disabled={isUploading}
              />
              {imagePreview && (
                <button
                  onClick={deleteImage}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm transition-colors duration-300"
                  disabled={isUploading}
                  type="button"
                >
                  {isUploading ? "Removing..." : "Remove Image"}
                </button>
              )}
            </div>
          )}

          <div className="mt-6 text-center">
            <h2 className="text-2xl font-bold text-gray-800 animate-fadeIn">
              {user.fullName}
            </h2>
            <p className="text-blue-600 font-medium mt-1">
              {user.preferredRole}
            </p>
            <p className="text-gray-600 mt-1">{user.experience} Player</p>
          </div>
        </div>

        {/* Profile Details Section */}
        <div className="w-full md:w-2/3">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800 animate-fadeIn">
              {editMode ? "Edit Profile" : "Player Profile"}
            </h3>
            {!editMode ? (
              <button
                onClick={() => setEditMode(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 shadow-md hover:shadow-lg"
                type="button"
              >
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditMode(false);
                    setFormData({
                      fullName: user.fullName || "",
                      dateOfBirth: user.dateOfBirth?.split("T")[0] || "",
                      gender: user.gender || "",
                      phone: user.phone || "",
                      preferredRole: user.preferredRole || "",
                      battingStyle: user.battingStyle || "",
                      bowlingStyle: user.bowlingStyle || [],
                      experience: user.experience || "",
                    });
                    setImagePreview(user.imagePath || "");
                    setProfileImage(null);
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-300"
                  type="button"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center"
                  disabled={isUploading}
                  type="button"
                >
                  {isUploading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            )}
          </div>

          {editMode ? (
            <form className="space-y-4 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Form fields with smooth transitions */}
                {[
                  {
                    label: "Full Name",
                    name: "fullName",
                    type: "text",
                    placeholder: "Enter your full name",
                  },
                  {
                    label: "Date of Birth",
                    name: "dateOfBirth",
                    type: "date",
                  },
                  {
                    label: "Gender",
                    name: "gender",
                    type: "select",
                    options: ["", "Male", "Female", "Other"],
                  },
                  {
                    label: "Phone",
                    name: "phone",
                    type: "tel",
                    placeholder: "Enter your phone number",
                  },
                  {
                    label: "Preferred Role",
                    name: "preferredRole",
                    type: "select",
                    options: [
                      "",
                      "Batsman",
                      "Bowler",
                      "All-Rounder",
                      "Wicket-Keeper",
                    ],
                  },
                  {
                    label: "Batting Style",
                    name: "battingStyle",
                    type: "select",
                    options: ["", "Right", "Left"],
                  },
                  {
                    label: "Experience Level",
                    name: "experience",
                    type: "select",
                    options: [
                      "",
                      "Beginner",
                      "Intermediate",
                      "Advanced",
                      "Professional",
                    ],
                  },
                ].map((field) => (
                  <div
                    key={field.name}
                    className="transition-all duration-300 hover:bg-gray-50 p-2 rounded-lg"
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {field.label}
                    </label>
                    {field.type === "select" ? (
                      <select
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                      >
                        {field.options.map((option) => (
                          <option key={option} value={option}>
                            {option || `Select ${field.label}`}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type}
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                      />
                    )}
                  </div>
                ))}

                {/* Bowling Style Checkboxes */}
                <div className="transition-all duration-300 hover:bg-gray-50 p-2 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bowling Style
                  </label>
                  <div className="space-y-2">
                    {["Fast", "Medium", "Spin", "Left-arm", "Right-arm"].map(
                      (style) => (
                        <label
                          key={style}
                          className="flex items-center space-x-2 transition-colors duration-300 hover:text-blue-600"
                        >
                          <input
                            type="checkbox"
                            name="bowlingStyle"
                            value={style}
                            checked={formData.bowlingStyle.includes(style)}
                            onChange={handleChange}
                            className="rounded text-blue-600 focus:ring-blue-500 transition-colors duration-300"
                          />
                          <span>{style}</span>
                        </label>
                      )
                    )}
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Profile details with smooth hover effects */}
                {[
                  { label: "Email", value: user.email },
                  {
                    label: "Phone",
                    value: user.phone || "Not provided",
                  },
                  {
                    label: "Date of Birth",
                    value: user.dateOfBirth
                      ? new Date(user.dateOfBirth).toLocaleDateString()
                      : "Not provided",
                  },
                  {
                    label: "Gender",
                    value: user.gender || "Not provided",
                  },
                  {
                    label: "Preferred Role",
                    value: user.preferredRole || "Not specified",
                  },
                  {
                    label: "Batting Style",
                    value: user.battingStyle
                      ? `${user.battingStyle}-handed`
                      : "Not specified",
                  },
                  {
                    label: "Bowling Style",
                    value: user.bowlingStyle?.join(", ") || "None",
                  },
                  {
                    label: "Experience Level",
                    value: user.experience || "Not specified",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="p-3 rounded-lg transition-all duration-300 bg-blue-50 hover:shadow-sm"
                  >
                    <h4 className="text-sm font-small text-gray-500">
                      {item.label}
                    </h4>
                    <p className="mt-1 text-gray-900">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerProfile;
