
import Image from "next/image";
import styles from "./SignupPage.module.css";
export const metadata = {
  title: 'Mugna - Create Account',
}

const getStaggerClass = (delay: number) => 
  `${styles.staggerIn} [animation-delay:${delay}ms]`;


export default function SignupPage() {
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
            Start Your Journey
          </h1>
          <p className={styles.marketingText}> 
            Join Mugna today! Create your account to unlock full access to our global marketplace, 
            begin managing your inventory, and connect directly with fellow artisans and customers.
          </p>
        </div>

        <main 
          className={`${styles.signupFormMain} ${getStaggerClass(400)}`}
        >
          
          <div className={`${styles.headerContainer} ${getStaggerClass(600)}`}> 
            <h1 className={styles.headerTitle}>
              Mugna
            </h1>
            <h1 className={styles.headerSubtitle}>
              Create a New Account
            </h1>
          </div>

          <form className={styles.formWrapper}>
            
            <div className={getStaggerClass(800)}>
              <label
                htmlFor="name"
                className={styles.label}
              >
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className={styles.inputField}
                placeholder="John Doe"
              />
            </div>

            <div className={getStaggerClass(1000)}>
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

            <div className={getStaggerClass(1200)}>
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
            </div>

            <button
              type="submit"
              className={`${styles.signupButton} ${getStaggerClass(1400)}`} 
            >
              Sign Up
            </button>

            <div className={`${styles.separatorWrapper} ${getStaggerClass(1600)}`}> 
              <div className={styles.separatorLine}>
                <div className={styles.separatorBar}></div>
              </div>
              <div className={styles.separatorTextContainer}>
                <span className={styles.separatorText}>
                  Already have an account?
                </span>
              </div>
            </div>

            <a
              href="/login"
              className={`${styles.loginLink} ${getStaggerClass(1800)}`} 
            >
              Log In
            </a>
          </form>
        </main>
      </div>
    </div>
  );
}