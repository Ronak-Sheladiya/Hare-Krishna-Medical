// Client-side fallback for when backend is not available
// Provides basic functionality using localStorage

const CLIENT_STORAGE_KEY = "hk_medical_client_data";

/**
 * Get data from client storage
 */
const getClientData = () => {
  try {
    const data = localStorage.getItem(CLIENT_STORAGE_KEY);
    return data ? JSON.parse(data) : { users: [], currentUser: null };
  } catch (error) {
    console.warn("Error reading client storage:", error);
    return { users: [], currentUser: null };
  }
};

/**
 * Save data to client storage
 */
const saveClientData = (data) => {
  try {
    localStorage.setItem(CLIENT_STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.warn("Error saving client storage:", error);
    return false;
  }
};

/**
 * Client-side authentication fallback
 */
export const clientSideAuth = {
  // Register user (client-side only)
  register: (userData) => {
    const data = getClientData();

    // Check if user already exists
    const existingUser = data.users.find((u) => u.email === userData.email);
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      ...userData,
      role: 0, // Regular user
      emailVerified: true, // Skip verification in client mode
      createdAt: new Date().toISOString(),
    };

    data.users.push(newUser);
    saveClientData(data);

    return {
      message: "Registration successful (Client-side mode)",
      user: newUser,
      token: btoa(
        JSON.stringify({ userId: newUser.id, timestamp: Date.now() }),
      ),
    };
  },

  // Login user (client-side only)
  login: (email, password) => {
    const data = getClientData();
    const user = data.users.find((u) => u.email === email);

    if (!user) {
      throw new Error("Invalid email or password");
    }

    // In client mode, accept any password for demo purposes
    // In a real app, you'd store hashed passwords

    data.currentUser = user;
    saveClientData(data);

    return {
      message: "Login successful (Client-side mode)",
      user,
      token: btoa(JSON.stringify({ userId: user.id, timestamp: Date.now() })),
    };
  },

  // Update profile (client-side only)
  updateProfile: (userId, profileData) => {
    const data = getClientData();
    const userIndex = data.users.findIndex((u) => u.id === userId);

    if (userIndex === -1) {
      throw new Error("User not found");
    }

    // Update user data
    data.users[userIndex] = {
      ...data.users[userIndex],
      ...profileData,
      updatedAt: new Date().toISOString(),
    };

    // Update current user if it's the same user
    if (data.currentUser && data.currentUser.id === userId) {
      data.currentUser = data.users[userIndex];
    }

    saveClientData(data);

    return {
      message: "Profile updated successfully (Client-side mode)",
      user: data.users[userIndex],
    };
  },

  // Get current user
  getCurrentUser: () => {
    const data = getClientData();
    return data.currentUser;
  },

  // Check if client-side mode is available
  isAvailable: () => {
    try {
      // Test localStorage availability
      const test = "__test__";
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (error) {
      return false;
    }
  },
};

/**
 * Check if we should use client-side fallback
 */
export const shouldUseClientSideFallback = () => {
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";

  // Use client-side fallback for fly.dev when backend is not available
  return hostname.includes("fly.dev") && clientSideAuth.isAvailable();
};

export default clientSideAuth;
