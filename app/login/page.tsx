// app/login/page.tsx

import Image from "next/image";
import styles from "./LoginPage.module.css";

export const metadata = {
  title: 'Mugna - Login Account',
}

const getStaggerClass = (delay: number) => 
  `${styles.staggerIn} [animation-delay:${delay}ms]`;


export default function LoginPage() {
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
            Mugna Collection
          </h1>
          <p className={styles.marketingText}> 
            Your gateway to discovering and curating the finest digital and physical crafts. 
            Sign in to manage your inventory, explore new collections, and connect with artisans worldwide.
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
              Sign in to your account
            </h1>
          </div>

          <form className={styles.formWrapper}>
            
            <div className={getStaggerClass(800)}>
              <label
                htmlFor="email"
                className={styles.label}
              >
                Email address
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

            
            <div className={getStaggerClass(1000)}>
              <label
                htmlFor="password"
                className={styles.label}
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className={styles.inputField}
                placeholder="••••••••"
              />
              
              
              <div className={styles.forgotPasswordLinkContainer}> 
                <a
                  href="#"
                  className={styles.forgotPasswordLink}
                >
                  Forgot your password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              className={`${styles.loginButton} ${getStaggerClass(1200)}`} 
            >
              Log In
            </button>

            
            <div className={`${styles.separatorWrapper} ${getStaggerClass(1400)}`}> 
              <div className={styles.separatorLine}>
                <div className={styles.separatorBar}></div>
              </div>
              <div className={styles.separatorTextContainer}>
                <span className={styles.separatorText}>
                  New to Mugna?
                </span>
              </div>
            </div>

            
            <a
              href="/signup" 
              className={`${styles.createAccountButton} ${getStaggerClass(1600)}`} 
            >
              Create Account
            </a>
          </form>
        </main>
      </div>
    </div>
  );
}