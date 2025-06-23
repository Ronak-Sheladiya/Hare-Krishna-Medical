import { useMemo } from "react";
import {
  formatDateUniversal,
  formatDateTimeUniversal,
  getRelativeTime,
} from "../utils/dateUtils";

/**
 * Custom hook for consistent date formatting across the application
 * Always returns dates in dd/mm/yyyy format
 */
export const useDateTime = () => {
  const formatters = useMemo(
    () => ({
      /**
       * Format date to dd/mm/yyyy
       * @param {string|Date} date - Date to format
       * @returns {string} Formatted date string
       */
      formatDate: (date) => formatDateUniversal(date),

      /**
       * Format date and time to dd/mm/yyyy HH:mm
       * @param {string|Date} date - Date to format
       * @returns {string} Formatted date and time string
       */
      formatDateTime: (date) => formatDateTimeUniversal(date),

      /**
       * Get relative time (e.g., "2 hours ago")
       * @param {string|Date} date - Date to get relative time for
       * @returns {string} Relative time string
       */
      getRelativeTime: (date) => getRelativeTime(date),

      /**
       * Get current date in dd/mm/yyyy format
       * @returns {string} Current date string
       */
      getCurrentDate: () => formatDateUniversal(new Date()),

      /**
       * Check if date is today
       * @param {string|Date} date - Date to check
       * @returns {boolean} True if date is today
       */
      isToday: (date) => {
        if (!date) return false;
        const inputDate = new Date(date);
        const today = new Date();
        return (
          inputDate.getDate() === today.getDate() &&
          inputDate.getMonth() === today.getMonth() &&
          inputDate.getFullYear() === today.getFullYear()
        );
      },

      /**
       * Check if date is this week
       * @param {string|Date} date - Date to check
       * @returns {boolean} True if date is this week
       */
      isThisWeek: (date) => {
        if (!date) return false;
        const inputDate = new Date(date);
        const today = new Date();
        const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        return inputDate >= oneWeekAgo && inputDate <= today;
      },

      /**
       * Format date for display with conditional formatting
       * Shows relative time for recent dates, full date for older ones
       * @param {string|Date} date - Date to format
       * @returns {string} Conditionally formatted date string
       */
      formatDateSmart: (date) => {
        if (!date) return "";

        const inputDate = new Date(date);
        const now = new Date();
        const diffInHours = (now - inputDate) / (1000 * 60 * 60);

        // If less than 24 hours ago, show relative time
        if (diffInHours < 24) {
          return getRelativeTime(date);
        }

        // If less than 7 days ago, show day and time
        if (diffInHours < 168) {
          // 7 days * 24 hours
          const dayNames = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ];
          const day = dayNames[inputDate.getDay()];
          const time = inputDate.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });
          return `${day} at ${time}`;
        }

        // Otherwise show full date
        return formatDateUniversal(date);
      },
    }),
    [],
  );

  return formatters;
};

export default useDateTime;
