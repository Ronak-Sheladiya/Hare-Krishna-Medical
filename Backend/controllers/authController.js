const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { supabase, supabaseAdmin } = require("../config/supabase");
const emailService = require("../utils/emailService");

class AuthController {
  // Check database connectivity
  async checkDBConnection() {
    try {
      const { error } = await supabase.from('users').select('count').limit(1);
      if (error && error.code !== 'PGRST116') {
        throw new Error("Supabase connection not available.");
      }
    } catch (err) {
      throw new Error("Database connection failed.");
    }
  }
  // Register a new user
  async register(req, res) {
    try {
      const { fullName, email, mobile, password, address } = req.body;

      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('email, mobile')
        .or(`email.eq.${email},mobile.eq.${mobile}`);

      if (existingUser && existingUser.length > 0) {
        const existing = existingUser[0];
        return res.status(400).json({
          message: existing.email === email
            ? "User with this email already exists"
            : "User with this mobile number already exists",
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create new user
      const userData = {
        full_name: fullName,
        email,
        mobile,
        password_hash: hashedPassword,
        address,
        role: 0, // Regular user
        email_verified: false,
        is_active: true
      };

      const { data: user, error } = await supabase
        .from('users')
        .insert(userData)
        .select()
        .single();

      if (error) throw error;

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET || 'fallback-secret',
        { expiresIn: '7d' }
      );

      // Emit real-time update
      const io = req.app.get("io");
      if (io) {
        io.to("admin-room").emit("new-user-registered", {
          user: {
            id: user.id,
            fullName: user.full_name,
            email: user.email,
            registeredAt: user.created_at,
          },
        });
      }

      res.status(201).json({
        message: "User registered successfully",
        token,
        user: {
          id: user.id,
          fullName: user.full_name,
          email: user.email,
          mobile: user.mobile,
          role: user.role,
          address: user.address,
          emailVerified: user.email_verified,
        },
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({
        message: "Registration failed",
        error: error.message,
      });
    }
  }

  // Login user
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Find user
      const { data: users, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('is_active', true);

      if (error) throw error;

      if (!users || users.length === 0) {
        return res.status(400).json({
          message: "Invalid email or password",
        });
      }

      const user = users[0];

      // Check password
      const isMatch = await bcrypt.compare(password, user.password_hash);

      if (!isMatch) {
        return res.status(400).json({
          message: "Invalid email or password",
        });
      }

      // Update last login
      await supabase
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', user.id);

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET || 'fallback-secret',
        { expiresIn: '7d' }
      );

      // Emit real-time update
      const io = req.app.get("io");
      if (io) {
        io.to("admin-room").emit("user-logged-in", {
          user: {
            id: user.id,
            fullName: user.full_name,
            email: user.email,
            lastLogin: new Date().toISOString(),
          },
        });
      }

      res.json({
        message: "Login successful",
        token,
        user: {
          id: user.id,
          fullName: user.full_name,
          email: user.email,
          mobile: user.mobile,
          role: user.role,
          address: user.address,
          lastLogin: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({
        message: "Login failed",
        error: error.message,
      });
    }
  }

  // Get user profile
  async getProfile(req, res) {
    try {
      const user = await User.findById(req.user.id).select("-password");
      res.json({
        user,
      });
    } catch (error) {
      console.error("Profile fetch error:", error);
      res.status(500).json({
        message: "Failed to fetch profile",
        error: error.message,
      });
    }
  }

  // Update user profile
  async updateProfile(req, res) {
    try {
      const { fullName, mobile, address, preferences } = req.body;

      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      // Update fields
      if (fullName) user.fullName = fullName;
      if (mobile) user.mobile = mobile;
      if (address) user.address = address;
      if (preferences)
        user.preferences = { ...user.preferences, ...preferences };

      await user.save();

      res.json({
        message: "Profile updated successfully",
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          mobile: user.mobile,
          role: user.role,
          address: user.address,
          preferences: user.preferences,
        },
      });
    } catch (error) {
      console.error("Profile update error:", error);
      res.status(500).json({
        message: "Profile update failed",
        error: error.message,
      });
    }
  }

  // Change user password
  async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          message: "Current password and new password are required",
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          message: "New password must be at least 6 characters",
        });
      }

      const user = await User.findById(req.user.id).select("+password");

      // Verify current password
      const isMatch = await user.comparePassword(currentPassword);

      if (!isMatch) {
        return res.status(400).json({
          message: "Current password is incorrect",
        });
      }

      // Update password
      user.password = newPassword;
      await user.save();

      res.json({
        message: "Password changed successfully",
      });
    } catch (error) {
      console.error("Password change error:", error);
      res.status(500).json({
        message: "Password change failed",
        error: error.message,
      });
    }
  }

  // Send password reset email
  async forgotPassword(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          message: "Email is required",
        });
      }

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({
          message: "User with this email does not exist",
        });
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString("hex");
      user.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
      user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

      await user.save();

      // Send reset email
      const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

      try {
        await emailService.sendPasswordResetEmail(
          user.email,
          user.fullName,
          resetUrl,
        );

        res.json({
          message: "Password reset email sent successfully",
        });
      } catch (emailError) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        return res.status(500).json({
          message: "Email could not be sent",
        });
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      res.status(500).json({
        message: "Failed to process password reset request",
        error: error.message,
      });
    }
  }

  // Reset password
  async resetPassword(req, res) {
    try {
      const { token } = req.params;
      const { password } = req.body;

      if (!password || password.length < 6) {
        return res.status(400).json({
          message: "Password must be at least 6 characters",
        });
      }

      // Hash token to compare with stored hash
      const resetPasswordToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

      const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
      });

      if (!user) {
        return res.status(400).json({
          message: "Invalid or expired reset token",
        });
      }

      // Set new password
      user.password = password;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save();

      res.json({
        message: "Password reset successful",
      });
    } catch (error) {
      console.error("Password reset error:", error);
      res.status(500).json({
        message: "Password reset failed",
        error: error.message,
      });
    }
  }

  // Verify email OTP
  async verifyOtp(req, res) {
    try {
      const { email, otp } = req.body;

      if (!email || !otp) {
        return res.status(400).json({
          message: "Email and OTP are required",
        });
      }

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      // Check if OTP exists and is not expired
      if (!user.emailOTP || !user.emailOTPExpires) {
        return res.status(400).json({
          message: "No OTP found. Please request a new OTP.",
        });
      }

      if (Date.now() > user.emailOTPExpires) {
        return res.status(400).json({
          message: "OTP has expired. Please request a new OTP.",
        });
      }

      // Verify OTP
      if (user.emailOTP === otp) {
        user.emailVerified = true;
        user.emailOTP = undefined;
        user.emailOTPExpires = undefined;
        user.emailVerificationToken = undefined;
        await user.save();

        // Send welcome email after successful verification
        try {
          await emailService.sendWelcomeEmail(user.email, user.fullName);
        } catch (emailError) {
          console.error("Welcome email failed:", emailError);
        }

        res.json({
          message: "Email verified successfully",
          user: {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            mobile: user.mobile,
            role: user.role,
            emailVerified: user.emailVerified,
          },
        });
      } else {
        return res.status(400).json({
          message: "Invalid OTP. Please check and try again.",
        });
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      res.status(500).json({
        message: "OTP verification failed",
        error: error.message,
      });
    }
  }

  // Resend email OTP
  async resendOtp(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          message: "Email is required",
        });
      }

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      if (user.emailVerified) {
        return res.status(400).json({
          message: "Email is already verified",
        });
      }

      // Generate new OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      user.emailOTP = otp;
      user.emailOTPExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
      user.emailVerificationToken = crypto.randomBytes(32).toString("hex");
      await user.save();

      // Send new OTP email
      try {
        await emailService.sendVerificationEmail(
          user.email,
          user.fullName,
          otp,
        );
      } catch (emailError) {
        console.error("Resend OTP email failed:", emailError);
        return res.status(500).json({
          message: "Failed to send OTP email",
        });
      }

      res.json({
        message: "New OTP sent successfully to your email",
      });
    } catch (error) {
      console.error("Resend OTP error:", error);
      res.status(500).json({
        message: "Failed to resend OTP",
        error: error.message,
      });
    }
  }

  // Logout user (client-side token removal)
  async logout(req, res) {
    res.json({
      message: "Logout successful",
    });
  }
}

module.exports = new AuthController();
