"use client"; // Retain 'use client' for useState

import { useState } from 'react'; 
import styles from "./LoginPage.module.css";
import { Eye, EyeOff } from 'lucide-react'; 


const getStaggerClass = (delay: number) => 
  `${styles.staggerIn} [animation-delay:${delay}ms]`;


export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false); 

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div
      className={styles.mainContainer}
      style={{
        backgroundImage: `url('/market-shop.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className={styles.backgroundOverlay}></div>

      <div className={styles.contentWrapper}>
        
        <div 
          className={`${styles.leftSection} ${getStaggerClass(200)}`}
        >
          <h1 className={styles.heading1}> 
            Welcome Back!
          </h1>
          <p className={styles.marketingText}> 
            Sign in to Mugna to access your personalized dashboard, manage your inventory, 
            and keep up with the latest from the global artisan community.
          </p>
        </div>

        <main 
          className={`${styles.loginFormMain} ${getStaggerClass(400)}`}
        >
          
          <div className={`${styles.headerContainer} ${getStaggerClass(600)}`}> 
            <h1 className={styles.headerTitle}>
              Mugna
            </h1>
            <h1 className={styles.headerSubtitle}>
              Sign In to Your Account
            </h1>
          </div>

          <form className={styles.formWrapper}>
            
            {/* Email Field */}
            <div className={`${getStaggerClass(800)} ${styles.mb4}`}> 
              <label
                htmlFor="email"
                className={styles.label}
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className={styles.inputField}
                placeholder="you@example.com"
              />
            </div>

            {/* Password Field */}
            <div className={`${getStaggerClass(1000)} ${styles.mb4}`}>
              <label
                htmlFor="password"
                className={styles.label}
              >
                Password
              </label>
              
              <div className={styles.passwordInputWrapper}> 
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'} 
                  required
                  className={styles.inputField}
                  placeholder="••••••••"
                />
                
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className={styles.togglePasswordButton}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className={`${styles.loginButton} ${getStaggerClass(1200)}`} 
            >
              Log In
            </button>

            {/* Separator and Sign Up Link */}
            <div className={`${styles.separatorWrapper} ${getStaggerClass(1400)}`}> 
              <div className={styles.separatorLine}>
                <div className={styles.separatorBar}></div>
              </div>
              <div className={styles.separatorTextContainer}>
                <span className={styles.separatorText}>
                  Don&apos;t have an account?
                </span>
              </div>
            </div>

            <a
              href="/signup"
              className={`${styles.signupLink} ${getStaggerClass(1600)}`} 
            >
              Sign Up
            </a>
          </form>
        </main>
      </div>
    </div>
  );
}