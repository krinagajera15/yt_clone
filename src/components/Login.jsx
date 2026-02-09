import React, { useState } from "react";
import "./Login.css";
import loginYt from "../assets/image/yt.png";
import { Link, useNavigate, useLocation } from "react-router-dom"; // useLocation ઉમેર્યું

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation(); // લોકેશન સ્ટેટ મેળવવા માટે

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // કયા પેજ પર પાછા જવું છે તે નક્કી કરો (Default હોમ પેજ "/")
  const goBackTo = location.state?.from || "/";

  const handleLogin = async () => {
    setError("");

    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    // ✅ Hardcoded admin credentials
    const adminEmail = "ytadmin@gmail.com";
    const adminPassword = "yt@123";

    if (email === adminEmail && password === adminPassword) {
      // Admin login success
      localStorage.setItem(
        "loginData",
        JSON.stringify({ role: "admin", email })
      );
      navigate("/dashbord"); // Admin ને તો ડેશબોર્ડ પર જ મોકલીશું
      return;
    }

    try {
      // Normal user login
      const response = await fetch(
        "https://697343e3b5f46f8b5826ae3f.mockapi.io/users"
      );
      const users = await response.json();

      const user = users.find(
        (u) => u.email === email && u.password === password
      );

      if (user) {
        // User login success
        localStorage.setItem("loginData", JSON.stringify({ role: "user", ...user }));
        
        // 🔥 અહીં જાદુ છે: જે પેજ પરથી આવ્યા હતા ત્યાં પાછા મોકલો
        navigate(goBackTo, { replace: true }); 
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-image">
        <img src={loginYt} alt="Login" />
      </div>

      <div className="login-form">
        <h2>Hello Again,</h2>
        <p>Welcome back, let's get started!</p>

        <input
          type="email"
          placeholder="Email"
          className="input-box"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="input-box"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="error">{error}</p>}

        <button className="login-btn" onClick={handleLogin}>
          Login
        </button>

        <p className="signup-text">
          Don't have an account?{" "}
          <Link to="/signup" className="signup-link">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;