"use client";

import { useState } from "react";
import styles from "./AdminLoginPage.module.css";
import { Eye, EyeOff, Shield } from "lucide-react";

const getStaggerClass = (delay: number) =>
  `${styles.staggerIn} [animation-delay:${delay}ms]`;

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    const username = (document.getElementById("email") as HTMLInputElement).value;
    const password = (document.getElementById("password") as HTMLInputElement).value;

    try {
      const res = await fetch("/admin/login/api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.message || "Invalid credentials.");
        setLoading(false);
        return;
      }

      // Redirect after success
      window.location.href = "/admin/dashboard";

    } catch (err) {
      setErrorMessage("Server error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div
      className={styles.mainContainer}
      style={{
        backgroundImage: `url('/market-shop.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className={styles.backgroundOverlay}></div>

      <div className={styles.contentWrapper}>
        {/* LEFT SECTION */}
        <div className={`${styles.leftSection} ${getStaggerClass(200)}`}>
          <h1 className={styles.heading1}>Admin Access</h1>
          <p className={styles.marketingText}>
            Log in to the Mugna Administrative Dashboard to manage users,
            moderate content, and maintain the platform&apos;s health.
          </p>
          <p className={styles.marketingText} style={{ marginTop: "1rem" }}>
            <Shield size={20} style={{ display: "inline", marginRight: "8px" }} />
            System Integrity Check Required.
          </p>
        </div>

        {/* RIGHT SECTION FORM */}
        <main className={`${styles.loginFormMain} ${getStaggerClass(400)}`}>
          <div className={`${styles.headerContainer} ${getStaggerClass(600)}`}>
            <h1 className={styles.headerTitle}>Mugna Admin</h1>
            <h1 className={styles.headerSubtitle}>Sign In to Your Admin Account</h1>
          </div>

          <form className={styles.formWrapper} onSubmit={handleLogin}>
            {/* USERNAME */}
            <div className={`${getStaggerClass(800)} ${styles.mb4}`}>
              <label htmlFor="email" className={styles.label}>
                Admin Email or Username
              </label>
              <input
                id="email"
                name="email"
                type="text"
                required
                className={styles.inputField}
                placeholder="admin@mugna.com"
              />
            </div>

            {/* PASSWORD */}
            <div className={`${getStaggerClass(1000)} ${styles.mb4}`}>
              <label htmlFor="password" className={styles.label}>
                Password
              </label>

              <div className={styles.passwordInputWrapper}>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className={styles.inputField}
                  placeholder="••••••••"
                />

                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className={styles.togglePasswordButton}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* ERROR MESSAGE */}
            {errorMessage && (
              <p style={{ color: "red", textAlign: "center", marginBottom: "1rem" }}>
                {errorMessage}
              </p>
            )}

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              className={`${styles.loginButton} ${getStaggerClass(1200)}`}
              disabled={loading}
            >
              {loading ? "Validating..." : "Secure Log In"}
            </button>

            
          </form>
        </main>
      </div>
    </div>
  );
}
