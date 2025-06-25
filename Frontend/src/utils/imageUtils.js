/**
 * Image utility functions for handling image storage and retrieval from database
 */

import { api } from "./apiClient";

// Maximum file size for images (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Allowed image types
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

/**
 * Validate image file
 * @param {File} file - Image file to validate
 * @returns {Object} - Validation result with isValid and error
 */
export const validateImageFile = (file) => {
  if (!file) {
    return { isValid: false, error: "No file provided" };
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: "Invalid file type. Only JPEG, PNG, and WebP images are allowed.",
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: "File size too large. Maximum size is 5MB.",
    };
  }

  return { isValid: true, error: null };
};

/**
 * Convert file to base64 string for database storage
 * @param {File} file - Image file to convert
 * @returns {Promise<string>} - Base64 string
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Compress image to reduce file size
 * @param {File} file - Image file to compress
 * @param {number} quality - Compression quality (0.1 to 1.0)
 * @param {number} maxWidth - Maximum width
 * @param {number} maxHeight - Maximum height
 * @returns {Promise<string>} - Compressed base64 string
 */
export const compressImage = (
  file,
  quality = 0.8,
  maxWidth = 800,
  maxHeight = 800,
) => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;

      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);
      const compressedDataUrl = canvas.toDataURL(file.type, quality);
      resolve(compressedDataUrl);
    };

    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Upload user profile image
 * @param {File} file - Image file to upload
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - Upload result
 */
export const uploadUserImage = async (file, userId) => {
  try {
    // Validate file
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    // Compress image
    const compressedImage = await compressImage(file, 0.8, 400, 400);

    // Upload via API
    const response = await api.post("/api/users/upload-profile-image", {
      userId,
      imageData: compressedImage,
    });

    if (response.data.success) {
      return {
        success: true,
        imageUrl: response.data.data.imageUrl,
        message: "Profile image uploaded successfully",
      };
    } else {
      throw new Error(response.data.message || "Upload failed");
    }
  } catch (error) {
    console.error("Error uploading user image:", error);
    return {
      success: false,
      error: error.message || "Failed to upload image",
    };
  }
};

/**
 * Upload product image(s)
 * @param {File|File[]} files - Image file(s) to upload
 * @param {string} productId - Product ID
 * @returns {Promise<Object>} - Upload result
 */
export const uploadProductImages = async (files, productId) => {
  try {
    const fileArray = Array.isArray(files) ? files : [files];

    // Validate all files
    for (const file of fileArray) {
      const validation = validateImageFile(file);
      if (!validation.isValid) {
        throw new Error(`${file.name}: ${validation.error}`);
      }
    }

    // Compress all images
    const compressedImages = await Promise.all(
      fileArray.map((file) => compressImage(file, 0.8, 800, 800)),
    );

    // Upload via API
    const response = await api.post("/api/products/upload-images", {
      productId,
      images: compressedImages,
    });

    if (response.data.success) {
      return {
        success: true,
        imageUrls: response.data.data.imageUrls,
        message: "Product images uploaded successfully",
      };
    } else {
      throw new Error(response.data.message || "Upload failed");
    }
  } catch (error) {
    console.error("Error uploading product images:", error);
    return {
      success: false,
      error: error.message || "Failed to upload images",
    };
  }
};

/**
 * Get user profile image URL
 * @param {Object} user - User object
 * @returns {string} - Image URL or default avatar
 */
export const getUserImageUrl = (user) => {
  if (!user) return getDefaultAvatarUrl();

  // Check for profileImage first
  if (user.profileImage && user.profileImage.trim()) {
    return user.profileImage;
  }

  // Fallback to deprecated avatar field
  if (user.avatar && user.avatar.trim()) {
    return user.avatar;
  }

  return getDefaultAvatarUrl(user);
};

/**
 * Get product image URLs
 * @param {Object} product - Product object
 * @returns {string[]} - Array of image URLs
 */
export const getProductImageUrls = (product) => {
  if (!product) return [getDefaultProductImageUrl()];

  // Check for images array first
  if (
    product.images &&
    Array.isArray(product.images) &&
    product.images.length > 0
  ) {
    return product.images.filter((url) => url && url.trim());
  }

  // Fallback to legacy imageUrls
  if (
    product.imageUrls &&
    Array.isArray(product.imageUrls) &&
    product.imageUrls.length > 0
  ) {
    return product.imageUrls
      .map((imgObj) => imgObj.url)
      .filter((url) => url && url.trim());
  }

  return [getDefaultProductImageUrl()];
};

/**
 * Get default avatar URL based on user initials
 * @param {Object} user - User object
 * @returns {string} - Default avatar URL
 */
export const getDefaultAvatarUrl = (user) => {
  if (user && user.fullName) {
    const initials = user.fullName
      .split(" ")
      .map((name) => name.charAt(0).toUpperCase())
      .slice(0, 2)
      .join("");

    return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=e63946&color=white&size=200&font-size=0.6`;
  }

  return "https://ui-avatars.com/api/?name=U&background=e63946&color=white&size=200&font-size=0.6";
};

/**
 * Get default product image URL
 * @returns {string} - Default product image URL
 */
export const getDefaultProductImageUrl = () => {
  return "https://via.placeholder.com/400x400/e63946/white?text=No+Image";
};

/**
 * Generate thumbnail from image URL
 * @param {string} imageUrl - Original image URL
 * @param {number} size - Thumbnail size
 * @returns {string} - Thumbnail URL
 */
export const generateThumbnail = (imageUrl, size = 150) => {
  if (!imageUrl || !imageUrl.trim()) {
    return getDefaultProductImageUrl();
  }

  // If it's a base64 image, return as is (could be optimized further)
  if (imageUrl.startsWith("data:image/")) {
    return imageUrl;
  }

  // If it's a regular URL, return as is (could add thumbnail service)
  return imageUrl;
};

/**
 * Delete user image
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - Delete result
 */
export const deleteUserImage = async (userId) => {
  try {
    const response = await api.delete(
      `/api/users/delete-profile-image/${userId}`,
    );

    if (response.data.success) {
      return {
        success: true,
        message: "Profile image deleted successfully",
      };
    } else {
      throw new Error(response.data.message || "Delete failed");
    }
  } catch (error) {
    console.error("Error deleting user image:", error);
    return {
      success: false,
      error: error.message || "Failed to delete image",
    };
  }
};

/**
 * Delete product image
 * @param {string} productId - Product ID
 * @param {string} imageUrl - Image URL to delete
 * @returns {Promise<Object>} - Delete result
 */
export const deleteProductImage = async (productId, imageUrl) => {
  try {
    const response = await api.delete("/api/products/delete-image", {
      data: { productId, imageUrl },
    });

    if (response.data.success) {
      return {
        success: true,
        message: "Product image deleted successfully",
      };
    } else {
      throw new Error(response.data.message || "Delete failed");
    }
  } catch (error) {
    console.error("Error deleting product image:", error);
    return {
      success: false,
      error: error.message || "Failed to delete image",
    };
  }
};

export default {
  validateImageFile,
  fileToBase64,
  compressImage,
  uploadUserImage,
  uploadProductImages,
  getUserImageUrl,
  getProductImageUrls,
  getDefaultAvatarUrl,
  getDefaultProductImageUrl,
  generateThumbnail,
  deleteUserImage,
  deleteProductImage,
};
