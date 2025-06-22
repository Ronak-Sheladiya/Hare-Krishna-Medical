/**
 * Date utility functions for consistent date handling across the application
 * All functions return serializable values (strings) suitable for Redux state
 */

/**
 * Get current date as ISO string (suitable for Redux state)
 * @returns {string} ISO date string
 */
export const getCurrentISOString = () => {
  return new Date().toISOString();
};

/**
 * Format date string for display
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString();
};

/**
 * Format date and time string for display
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date and time string
 */
export const formatDateTime = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleString();
};

/**
 * Format time string for display
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted time string
 */
export const formatTime = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleTimeString();
};

/**
 * Get relative time (e.g., "2 hours ago")
 * @param {string} dateString - ISO date string
 * @returns {string} Relative time string
 */
export const getRelativeTime = (dateString) => {
  if (!dateString) return "";

  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) {
    return "Just now";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes === 1 ? "" : "s"} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours === 1 ? "" : "s"} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays === 1 ? "" : "s"} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths === 1 ? "" : "s"} ago`;
  }

  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} year${diffInYears === 1 ? "" : "s"} ago`;
};

/**
 * Create a date offset from now (for mock data)
 * @param {number} hours - Hours to subtract from current time
 * @returns {string} ISO date string
 */
export const createDateOffset = (hours) => {
  return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
};

/**
 * Validate if a string is a valid date
 * @param {string} dateString - Date string to validate
 * @returns {boolean} True if valid date
 */
export const isValidDate = (dateString) => {
  if (!dateString) return false;
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
};

/**
 * Sort array by date field (newest first)
 * @param {Array} array - Array of objects with date field
 * @param {string} dateField - Name of the date field
 * @returns {Array} Sorted array
 */
export const sortByDateDesc = (array, dateField = "createdAt") => {
  return [...array].sort(
    (a, b) => new Date(b[dateField]) - new Date(a[dateField]),
  );
};

/**
 * Sort array by date field (oldest first)
 * @param {Array} array - Array of objects with date field
 * @param {string} dateField - Name of the date field
 * @returns {Array} Sorted array
 */
export const sortByDateAsc = (array, dateField = "createdAt") => {
  return [...array].sort(
    (a, b) => new Date(a[dateField]) - new Date(b[dateField]),
  );
};
