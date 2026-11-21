
import { useState } from "react";
import API from "../../services/api";

import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress,
} from "@mui/material";

import {
  UserRound,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  CalendarCheck,
  Clock3,
  ClipboardCheck,
  Fingerprint,
  CheckCircle2,
} from "lucide-react";

function EmployeeLogin({ onLogin, onBack }) {
  const [employeeId, setEmployeeId] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPin, setShowPin] = useState(false);

  const fieldStyle = {
    "& .MuiOutlinedInput-root": {
      backgroundColor: "#FFFFFF",
      borderRadius: "13px",
      color: "#173D30",
      fontSize: "14px",
      minHeight: 56,

      "& fieldset": {
        borderColor: "#E4E1D8",
      },

      "&:hover fieldset": {
        borderColor: "#8AA99A",
      },

      "&.Mui-focused fieldset": {
        borderColor: "#0B3D2E",
        borderWidth: "1.5px",
      },
    },

    "& .MuiInputBase-input": {
      py: 1.8,
    },

    "& input::placeholder": {
      color: "#929B95",
      opacity: 1,
    },
  };

  // ========================================
  // EMPLOYEE LOGIN
  // ========================================

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!employeeId.trim() || !/^\d{4}$/.test(pin)) {
      setError("Please enter your Employee ID and valid 4-digit PIN.");
      return;
    }

    try {
      setLoading(true);

      const response = await API.post("/employees/login", {
        employeeId: employeeId.trim(),
        pin,
      });

      sessionStorage.setItem(
        "employeeToken",
        response.data.token
      );

      sessionStorage.setItem(
        "employeeUser",
        JSON.stringify(response.data.employee)
      );

      onLogin(response.data.employee);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your Employee ID and PIN."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: { xs: 1.5, sm: 3 },
        position: "relative",
        overflow: "hidden",
        boxSizing: "border-box",
        background: "#FFF8EF",

        "& *": {
          boxSizing: "border-box",
        },

        "&::before": {
          content: '""',
          position: "absolute",
          width: 350,
          height: 350,
          borderRadius: "50%",
          background: "#DCEDE2",
          filter: "blur(90px)",
          top: -180,
          right: -100,
          pointerEvents: "none",
        },

        "&::after": {
          content: '""',
          position: "absolute",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "#E4EEE2",
          filter: "blur(90px)",
          bottom: -150,
          left: -100,
          pointerEvents: "none",
        },
      }}
    >
      {/* MAIN CARD */}

      <Box
        sx={{
          width: "100%",
          maxWidth: 1120,
          minHeight: { xs: "auto", md: 690 },
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "0.92fr 1.08fr",
          },
          position: "relative",
          zIndex: 1,
          overflow: "hidden",
          borderRadius: { xs: "20px", md: "28px" },
          background: "#FFFCF7",
          border: "1px solid #EAE4D9",
          boxShadow: "0 25px 75px rgba(11,61,46,0.13)",
        }}
      >

        {/* LEFT GREEN PANEL */}

        <Box
          sx={{
            background:
              "linear-gradient(145deg, #14533F 0%, #0B3D2E 55%, #062C22 100%)",
            color: "#FFFFFF",
            px: { xs: 3, sm: 5 },
            py: { xs: 3.5, md: 5 },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",

            "&::before": {
              content: '""',
              position: "absolute",
              width: 280,
              height: 280,
              borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.09)",
              top: -140,
              right: -100,
            },

            "&::after": {
              content: '""',
              position: "absolute",
              width: 220,
              height: 220,
              borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.08)",
              bottom: -120,
              left: -90,
            },
          }}
        >

          {/* BRAND */}

          <Box sx={{ position: "relative", zIndex: 1 }}>

            <Box
              sx={{
                width: 76,
                height: 76,
                mx: "auto",
                mb: 1.5,
                borderRadius: "20px",
                background: "#FFF8EF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#0B3D2E",
                fontSize: 47,
                fontWeight: 900,
                boxShadow: "0 8px 25px rgba(0,0,0,0.18)",
              }}
            >
              A
            </Box>

            <Typography
              sx={{
                fontSize: { xs: 29, md: 36 },
                fontWeight: 850,
                letterSpacing: 2,
                color: "#FFFFFF",
              }}
            >
              ATTENZA
            </Typography>

            <Typography
              sx={{
                color: "#D5E7DB",
                fontSize: 14,
                mt: 0.5,
              }}
            >
              Employee Attendance Portal
            </Typography>

          </Box>

          {/* EMPLOYEE ILLUSTRATION */}

          <Box
            sx={{
              position: "relative",
              zIndex: 1,
              width: 190,
              height: 170,
              my: 3.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >

            <Box
              sx={{
                width: 145,
                height: 145,
                borderRadius: "30px",
                background: "rgba(255,255,255,0.09)",
                border: "1px solid rgba(255,255,255,0.17)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            >

              <UserRound
                size={95}
                strokeWidth={1.3}
                color="#E7F2E8"
              />

              <Box
                sx={{
                  position: "absolute",
                  width: 65,
                  height: 65,
                  borderRadius: "50%",
                  background: "#FFF8EF",
                  color: "#0B3D2E",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  right: -24,
                  bottom: -10,
                  border: "5px solid #0B3D2E",
                }}
              >
                <CheckCircle2 size={35} />
              </Box>

            </Box>

            <ShieldCheck
              size={35}
              color="#B7D6B7"
              style={{
                position: "absolute",
                top: 5,
                left: 0,
              }}
            />

            <Fingerprint
              size={34}
              color="#B7D6B7"
              style={{
                position: "absolute",
                right: 0,
                top: 20,
              }}
            />

          </Box>

          {/* BRAND TEXT */}

          <Box sx={{ position: "relative", zIndex: 1 }}>

            <Typography
              sx={{
                fontSize: { xs: 22, md: 25 },
                fontWeight: 750,
                mb: 1,
              }}
            >
              Your Workday. Your Records.
            </Typography>

            <Typography
              sx={{
                color: "#D5E7DB",
                fontSize: 13,
                lineHeight: 1.9,
                maxWidth: 330,
                mx: "auto",
              }}
            >
              Access your attendance records,
              track working hours and manage
              your daily attendance easily.
            </Typography>

          </Box>

          {/* FEATURES */}

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: { xs: 2, md: 3 },
              mt: 4,
              width: "100%",
              maxWidth: 350,
              position: "relative",
              zIndex: 1,
            }}
          >

            {[
              {
                icon: <CalendarCheck size={29} />,
                label: "Attendance",
              },
              {
                icon: <Clock3 size={29} />,
                label: "Working Hours",
              },
              {
                icon: <ClipboardCheck size={29} />,
                label: "My Records",
              },
            ].map((item) => (
              <Box key={item.label}>

                <Box
                  sx={{
                    width: 62,
                    height: 62,
                    mx: "auto",
                    mb: 1,
                    borderRadius: "17px",
                    background: "rgba(255,255,255,0.11)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "#FFFFFF",
                  }}
                >
                  {item.icon}
                </Box>

                <Typography
                  sx={{
                    color: "#FFFFFF",
                    fontSize: 11,
                    fontWeight: 600,
                  }}
                >
                  {item.label}
                </Typography>

              </Box>
            ))}

          </Box>

          <Typography
            sx={{
              mt: 4,
              fontSize: 10,
              color: "#B7D0C1",
              position: "relative",
              zIndex: 1,
            }}
          >
            SMARTER ATTENDANCE, BETTER MANAGEMENT
          </Typography>

        </Box>

        {/* RIGHT LOGIN PANEL */}

        <Box
          sx={{
            px: { xs: 3, sm: 5, md: 6 },
            py: { xs: 4, md: 5 },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            background: "#FFFCF7",
          }}
        >

          {/* EMPLOYEE BADGE */}

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 3,
            }}
          >

            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1.2,
                px: 2.5,
                py: 1,
                borderRadius: 30,
                background: "#F1F1E5",
                border: "1px solid #E2E4D3",
                color: "#0B3D2E",
              }}
            >
              <UserRound size={21} />

              <Typography
                sx={{
                  fontWeight: 750,
                  fontSize: 14,
                }}
              >
                Employee Portal
              </Typography>

            </Box>

          </Box>

          {/* HEADING */}

          <Box sx={{ textAlign: "center", mb: 4 }}>

            <Typography
              sx={{
                fontSize: { xs: 30, md: 39 },
                fontWeight: 850,
                letterSpacing: -1.2,
                color: "#0B3D2E",
              }}
            >
              Welcome Back
            </Typography>

            <Typography
              sx={{
                fontSize: 14,
                color: "#77847E",
                mt: 1,
                lineHeight: 1.7,
              }}
            >
              Sign in to view your attendance details
            </Typography>

          </Box>

          {/* ERROR MESSAGE */}

          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 2.5,
                borderRadius: "12px",
              }}
            >
              {error}
            </Alert>
          )}

          {/* LOGIN FORM */}

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ width: "100%" }}
          >

            {/* EMPLOYEE ID */}

            <Typography
              sx={{
                color: "#334D40",
                fontSize: 12,
                fontWeight: 700,
                mb: 1,
              }}
            >
              Employee ID
            </Typography>

            <TextField
              fullWidth
              placeholder="Example: AIOT2605"
              value={employeeId}
              onChange={(e) =>
                setEmployeeId(e.target.value)
              }
              autoComplete="username"
              required
              disabled={loading}
              sx={{ ...fieldStyle, mb: 2.5 }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <UserRound
                        size={19}
                        color="#52675D"
                      />
                    </InputAdornment>
                  ),
                },
              }}
            />

            {/* 4 DIGIT PIN */}

            <Typography
              sx={{
                color: "#334D40",
                fontSize: 12,
                fontWeight: 700,
                mb: 1,
              }}
            >
              4-digit PIN
            </Typography>

            <TextField
              fullWidth
              placeholder="Enter your 4-digit PIN"
              type={showPin ? "text" : "password"}
              value={pin}
              onChange={(e) =>
                setPin(
                  e.target.value
                    .replace(/\D/g, "")
                    .slice(0, 4)
                )
              }
              inputMode="numeric"
              autoComplete="current-password"
              required
              disabled={loading}
              sx={{ ...fieldStyle, mb: 2.5 }}
              slotProps={{
                htmlInput: {
                  maxLength: 4,
                  pattern: "[0-9]{4}",
                },
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <ShieldCheck
                        size={19}
                        color="#52675D"
                      />
                    </InputAdornment>
                  ),

                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          setShowPin((prev) => !prev)
                        }
                        onMouseDown={(e) =>
                          e.preventDefault()
                        }
                        edge="end"
                        aria-label="Toggle PIN visibility"
                        sx={{ color: "#0B3D2E" }}
                      >
                        {showPin ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            {/* SECURITY NOTE */}

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 3,
                color: "#6D7D72",
              }}
            >
              <ShieldCheck
                size={17}
                color="#16835B"
              />

              <Typography sx={{ fontSize: 11 }}>
                Your attendance information is securely protected
              </Typography>
            </Box>

            {/* LOGIN BUTTON */}

            <Button
              type="submit"
              fullWidth
              disabled={loading}
              endIcon={
                loading ? (
                  <CircularProgress
                    size={18}
                    color="inherit"
                  />
                ) : (
                  <ArrowRight size={20} />
                )
              }
              sx={{
                py: 1.8,
                borderRadius: "14px",
                color: "#FFFFFF",
                background:
                  "linear-gradient(100deg, #14533F, #0B3D2E)",
                fontSize: 14,
                fontWeight: 750,
                textTransform: "none",
                boxShadow:
                  "0 9px 22px rgba(11,61,46,0.16)",
                transition: "all .25s ease",

                "&:hover": {
                  background:
                    "linear-gradient(100deg, #0B3D2E, #062C22)",
                  transform: "translateY(-2px)",
                  boxShadow:
                    "0 12px 25px rgba(11,61,46,0.24)",
                },

                "&:disabled": {
                  color: "#FFFFFF",
                  opacity: 0.7,
                },
              }}
            >
              {loading ? "Signing in..." : "Login to Employee Portal"}
            </Button>

          </Box>

          {/* BACK TO HOME */}

          <Button
            fullWidth
            variant="outlined"
            onClick={onBack}
            startIcon={<ArrowLeft size={18} />}
            sx={{
              mt: 3,
              py: 1.6,
              borderRadius: "14px",
              borderColor: "#DADDD4",
              color: "#0B3D2E",
              fontSize: 13,
              fontWeight: 700,
              textTransform: "none",
              background: "#FFFFFF",
              transition: "all .2s ease",

              "&:hover": {
                borderColor: "#0B3D2E",
                background: "#F0F5EF",
              },
            }}
          >
            Back to Home
          </Button>

          {/* FOOTER */}

          <Typography
            sx={{
              textAlign: "center",
              fontSize: 10,
              color: "#929B93",
              mt: 4,
            }}
          >
            © 2026 ATTENZA. Smarter Attendance, Better Management.
          </Typography>

        </Box>
      </Box>
    </Box>
  );
}

export default EmployeeLogin;
