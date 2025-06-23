import React from "react";
import { getUserImageUrl } from "../../utils/imageUtils";

const UserAvatar = ({
  user,
  size = 40,
  className = "",
  showBorder = true,
  onClick = null,
}) => {
  const getUserInitials = () => {
    if (!user) return "U";

    const name = user.fullName || user.name || user.email || "User";
    const names = name.split(" ");

    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }

    return name[0].toUpperCase();
  };

  const avatarStyle = {
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: `${size * 0.4}px`,
    fontWeight: "600",
    cursor: onClick ? "pointer" : "default",
    transition: "all 0.3s ease",
    border: showBorder ? "2px solid #e63946" : "none",
    boxShadow: showBorder ? "0 2px 8px rgba(230, 57, 70, 0.3)" : "none",
  };

  const avatarUrl = getUserImageUrl(user);

  // Check if we have a valid image URL (not the default avatar URL)
  if (avatarUrl && !avatarUrl.includes("ui-avatars.com")) {
    return (
      <img
        src={avatarUrl}
        alt={user.fullName || user.name || "User"}
        className={`user-avatar ${className}`}
        style={{
          ...avatarStyle,
          objectFit: "cover",
        }}
        onClick={onClick}
        onError={(e) => {
          // Fallback to initials if image fails to load
          e.target.style.display = "none";
          e.target.nextSibling.style.display = "flex";
        }}
      />
    );
  }

  return (
    <div
      className={`user-avatar-fallback ${className}`}
      style={{
        ...avatarStyle,
        background: "linear-gradient(135deg, #e63946, #dc3545)",
        color: "white",
      }}
      onClick={onClick}
    >
      {getUserInitials()}
    </div>
  );
};

export default UserAvatar;
