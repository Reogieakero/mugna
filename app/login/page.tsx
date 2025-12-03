// /app/login/LoginPage.tsx
"use client"; 

import { useState } from 'react'; 
import { useRouter } from 'next/navigation'; // <-- Import the router
import styles from "./LoginPage.module.css";
import { Eye, EyeOff } from 'lucide-react'; 

const getStaggerClass = (delay: number) => 
  `${styles.staggerIn} [animation-delay:${delay}ms]`;


export default function LoginPage() {
  const router = useRouter(); // <-- Initialize the router
  
  const [showPassword, setShowPassword] = useState(false); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  // SECURE LOGIN HANDLER
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // <-- CRITICAL: PREVENTS DEFAULT HTML FORM SUBMISSION
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/login', { 
        method: 'POST', // <-- CRITICAL: Uses POST method for security
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle server/validation errors (Invalid credentials, unverified account)
        setError(data.error || 'Login failed. Please try again.');
        return;
      }

      // Login successful!
      // 1. Clear credentials (optional, but good practice)
      setEmail('');
      setPassword('');
      
      // 2. Redirect the user using the router (No credentials in the URL!)
      const redirectPath = data.redirectTo || '/'; // Default to homepage if not specified
      router.push(redirectPath); 
      
    } catch (err) {
      console.error('Network or unexpected error:', err);
      setError('A network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
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

          <form className={styles.formWrapper} onSubmit={handleSubmit}> 
            
            {error && <p className={styles.errorMessage}>{error}</p>}

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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
              disabled={loading}
            >
              {loading ? 'Logging In...' : 'Log In'}
            </button>

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