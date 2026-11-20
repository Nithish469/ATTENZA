
import { useState } from "react";
import API from "../services/api";

import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress,
  Divider,
} from "@mui/material";

import {
  Visibility,
  VisibilityOff,
  PersonOutlined,
  LockOutlined,
  ArrowForward,
  VerifiedUserOutlined,
} from "@mui/icons-material";

function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const font = "'Inter', sans-serif";

  const fieldStyle = {
    "& .MuiOutlinedInput-root": {
      backgroundColor: "rgba(255,255,255,0.055)",
      borderRadius: "13px",
      color: "#ffffff",
      fontSize: "13px",
      "& fieldset": {
        borderColor: "rgba(255,255,255,0.12)",
      },
      "&:hover fieldset": {
        borderColor: "rgba(96,165,250,0.6)",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#60a5fa",
      },
    },
    "& input::placeholder": {
      color: "#71829e",
      opacity: 1,
    },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await API.post("/admin/login", {
        username,
        password,
      });

      sessionStorage.setItem(
        "adminToken",
        response.data.token
      );

      sessionStorage.setItem(
        "adminUser",
        JSON.stringify(response.data.admin)
      );

      onLogin();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Login failed. Check backend connection."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
        overflow: "hidden",
        position: "relative",
        fontFamily: font,
        background: "#070d1b",
        "& *": {
          fontFamily: font,
        },
      }}
    >
      {/* Background Blue Glow */}
      <Box
        sx={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "#164bba",
          filter: "blur(160px)",
          opacity: 0.28,
          top: "-220px",
          left: "-100px",
          pointerEvents: "none",
        }}
      />

      {/* Background Cyan Glow */}
      <Box
        sx={{
          position: "absolute",
          width: 450,
          height: 450,
          borderRadius: "50%",
          background: "#087eaa",
          filter: "blur(160px)",
          opacity: 0.2,
          bottom: "-220px",
          right: "-100px",
          pointerEvents: "none",
        }}
      />

      {/* Main Login Card */}
      <Box
        sx={{
          width: "100%",
          maxWidth: 465,
          position: "relative",
          zIndex: 1,
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: "26px",
          p: { xs: 3, sm: 5 },
          background: "rgba(17,27,48,0.88)",
          backdropFilter: "blur(25px)",
          boxShadow: "0 30px 100px rgba(0,0,0,0.5)",
        }}
      >
        {/* Company Logo */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 3,
          }}
        >
          <Box
            component="img"
            src="/anbu-aiot-logo.png"
            alt="Anbu AIoT Logo"
            sx={{
              width: 155,
              height: 85,
              objectFit: "contain",
            }}
          />
        </Box>

        {/* Branding */}
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              borderRadius: 20,
              px: 2,
              py: 0.8,
              mb: 2.5,
              border: "1px solid rgba(96,165,250,0.25)",
              background: "rgba(37,99,235,0.12)",
            }}
          >
            <Box
              sx={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "#60a5fa",
                boxShadow: "0 0 10px #60a5fa",
              }}
            />

            <Typography
              sx={{
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: 1.5,
                color: "#93c5fd",
              }}
            >
              ADMINISTRATOR PORTAL
            </Typography>
          </Box>

          <Typography
            sx={{
              fontSize: 34,
              fontWeight: 800,
              color: "#ffffff",
              letterSpacing: -1.5,
            }}
          >
            ATTENZA
          </Typography>

          <Typography
            sx={{
              fontSize: 12,
              color: "#8293ad",
              mt: 1,
            }}
          >
            Smart Attendance Management System
          </Typography>
        </Box>

        <Divider
          sx={{
            borderColor: "rgba(255,255,255,0.09)",
            mb: 3.5,
          }}
        />

        {/* Login Heading */}
        <Typography
          sx={{
            fontSize: 22,
            fontWeight: 700,
            color: "#ffffff",
            mb: 0.8,
          }}
        >
          Welcome back
        </Typography>

        <Typography
          sx={{
            fontSize: 12,
            color: "#8494ae",
            mb: 3,
            lineHeight: 1.8,
          }}
        >
          Enter your credentials to access your dashboard.
        </Typography>

        {/* Error Message */}
        {error && (
          <Alert
            severity="error"
            sx={{ mb: 2, borderRadius: 2 }}
          >
            {error}
          </Alert>
        )}

        {/* Login Form */}
        <Box component="form" onSubmit={handleSubmit}>

          {/* Username */}
          <Typography
            sx={{
              fontSize: 12,
              fontWeight: 600,
              color: "#c5d0e0",
              mb: 1,
            }}
          >
            Username
          </Typography>

          <TextField
            fullWidth
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
            disabled={loading}
            sx={{ ...fieldStyle, mb: 2.5 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonOutlined sx={{ color: "#7186a5" }} />
                </InputAdornment>
              ),
            }}
          />

          {/* Password */}
          <Typography
            sx={{
              fontSize: 12,
              fontWeight: 600,
              color: "#c5d0e0",
              mb: 1,
            }}
          >
            Password
          </Typography>

          <TextField
            fullWidth
            placeholder="Enter your password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
            disabled={loading}
            sx={{ ...fieldStyle, mb: 3.5 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlined sx={{ color: "#7186a5" }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    edge="end"
                    aria-label="Toggle password visibility"
                    sx={{ color: "#8193ad" }}
                  >
                    {showPassword ? (
                      <VisibilityOff fontSize="small" />
                    ) : (
                      <Visibility fontSize="small" />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Login Button */}
          <Button
            type="submit"
            fullWidth
            disabled={loading}
            endIcon={
              loading ? (
                <CircularProgress size={18} color="inherit" />
              ) : (
                <ArrowForward />
              )
            }
            sx={{
              py: 1.7,
              borderRadius: "13px",
              color: "#ffffff",
              background:
                "linear-gradient(100deg,#2563eb,#087fce)",
              fontSize: 13,
              fontWeight: 700,
              textTransform: "none",
              boxShadow: "0 8px 25px rgba(37,99,235,0.25)",
              transition: "all .25s ease",
              "&:hover": {
                background:
                  "linear-gradient(100deg,#1d4ed8,#0369a1)",
                transform: "translateY(-2px)",
                boxShadow:
                  "0 12px 30px rgba(37,99,235,0.4)",
              },
            }}
          >
            {loading ? "Signing in..." : "Access Dashboard"}
          </Button>
        </Box>

        {/* Security Footer */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            mt: 4,
          }}
        >
          <VerifiedUserOutlined
            sx={{ fontSize: 16, color: "#34d399" }}
          />

          <Typography
            sx={{
              fontSize: 10,
              color: "#8293ad",
            }}
          >
            Secure Administrator Authentication
          </Typography>
        </Box>

        <Typography
          sx={{
            textAlign: "center",
            fontSize: 10,
            color: "#566781",
            mt: 2,
          }}
        >
          © 2026 ATTENZA · Powered by Anbu AIoT
        </Typography>
      </Box>
    </Box>
  );
}

export default AdminLogin;
