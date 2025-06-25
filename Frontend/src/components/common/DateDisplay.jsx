import React from "react";
import { useDateTime } from "../../hooks/useDateTime";

/**
 * Universal date display component that ensures consistent dd/mm/yyyy formatting
 * across the entire application
 */
const DateDisplay = ({
  date,
  format = "date", // 'date', 'datetime', 'relative', 'smart'
  fallback = "—",
  className = "",
  ...props
}) => {
  const { formatDate, formatDateTime, getRelativeTime, formatDateSmart } =
    useDateTime();

  if (!date) {
    return (
      <span className={className} {...props}>
        {fallback}
      </span>
    );
  }

  const getFormattedDate = () => {
    switch (format) {
      case "datetime":
        return formatDateTime(date);
      case "relative":
        return getRelativeTime(date);
      case "smart":
        return formatDateSmart(date);
      default:
        return formatDate(date);
    }
  };

  return (
    <span className={className} {...props} title={formatDateTime(date)}>
      {getFormattedDate()}
    </span>
  );
};

export default DateDisplay;
