"use client";

import { useState, useMemo } from 'react';
import styles from "./SignupPage.module.css";
import { Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react'; 

const getStaggerClass = (delay: number) => 
  `${styles.staggerIn} [animation-delay:${delay}ms]`;

// Function to validate password complexity
const validatePassword = (password: string) => ({
  isLengthValid: password.length >= 8,
  hasUppercase: /[A-Z]/.test(password),
  hasLowercase: /[a-z]/.test(password),
  hasNumber: /[0-9]/.test(password),
  hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
});

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Memoize password validation results for dynamic display
  const passwordValidation = useMemo(() => 
    validatePassword(formData.password)
  , [formData.password]);
  
  // Determine if the password meets ALL requirements
  const isPasswordValid = Object.values(passwordValidation).every(Boolean);

  // Determine if the form is generally valid for submission
  const isFormValid = isPasswordValid && 
                      formData.name.trim() !== '' &&
                      formData.email.trim() !== '' &&
                      formData.password === formData.confirmPassword;


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear status message on input change
    setStatusMessage(null); 
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 
    setStatusMessage(null); 
    setIsSubmitting(true);
    
    // Client-side guard for complex password validation
    if (!isPasswordValid) {
        setStatusMessage('**Error:** Your password does not meet all the required security criteria.');
        setIsSubmitting(false);
        return;
    }

    // Client-side guard for password match
    if (formData.password !== formData.confirmPassword) {
        setStatusMessage('**Error:** Passwords do not match.');
        setIsSubmitting(false);
        return;
    }

    try {
      const response = await fetch('/signup/api', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatusMessage(`**Success!** Your Mugna account has been created, **${formData.name}**! Redirecting to login...`); 
        setFormData({ name: '', email: '', password: '', confirmPassword: '' });
        
        // --- MODIFICATION FOR REDIRECT ---
        setTimeout(() => {
          window.location.href = '/login'; 
        }, 500); // Redirect after 2 seconds
        // ---------------------------------
        
      } else {
        setStatusMessage(`**Error:** ${data.error || 'Something went wrong during account creation.'}`);
      }
    } catch (error) {
      setStatusMessage('**Network Error:** An unexpected network issue occurred. Please try again.');
    } finally {
      // Only stop showing 'Creating Account...' if the submission failed, 
      // otherwise, the redirect will handle the page change.
      if (!statusMessage?.startsWith('**Success!')) { 
        setIsSubmitting(false);
      }
    }
  };

  const ValidationItem = ({ isValid, children }: { isValid: boolean, children: React.ReactNode }) => (
    <li className={styles.validationItem} data-valid={isValid}>
      {isValid ? <CheckCircle size={14} className={styles.checkIcon} /> : <XCircle size={14} className={styles.xIcon} />}
      {children}
    </li>
  );

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

          <form className={styles.formWrapper} onSubmit={handleSubmit}>
            
            {/* Full Name Field */}
            <div className={`${getStaggerClass(800)} ${styles['mb-4']}`}> 
              <label htmlFor="name" className={styles.label}>Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className={styles.inputField}
                placeholder="John Doe"
                onChange={handleChange}
                value={formData.name}
              />
            </div>

            {/* Email Field */}
            <div className={`${getStaggerClass(1000)} ${styles['mb-4']}`}> 
              <label htmlFor="email" className={styles.label}>Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className={styles.inputField}
                placeholder="you@example.com"
                onChange={handleChange}
                value={formData.email}
              />
            </div>

            {/* Password Field & Validation CONTAINER */}
            <div className={`${getStaggerClass(1200)} ${styles.passwordGroupContainer} ${styles.passwordGroupPassword} ${styles['mb-4']}`}>
              <label htmlFor="password" className={styles.label}>Password</label>
              <div className={styles.passwordInputWrapper}> 
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'} 
                  required
                  className={styles.inputField}
                  placeholder="••••••••"
                  onChange={handleChange}
                  value={formData.password}
                />
                
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={styles.togglePasswordButton}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            
              {/* Password Validation Requirements (Floating) */}
              {formData.password.length > 0 && !isPasswordValid && ( 
                  <ul className={`${styles.validationList} ${styles.validationFloat} ${getStaggerClass(1300)}`}>
                      <ValidationItem isValid={passwordValidation.isLengthValid}>
                          At least 8 characters long
                      </ValidationItem>
                      <ValidationItem isValid={passwordValidation.hasUppercase}>
                          Contains at least 1 uppercase letter (A-Z)
                      </ValidationItem>
                      <ValidationItem isValid={passwordValidation.hasLowercase}>
                          Contains at least 1 lowercase letter (a-z)
                      </ValidationItem>
                      <ValidationItem isValid={passwordValidation.hasNumber}>
                          Contains at least 1 number (0-9)
                      </ValidationItem>
                      <ValidationItem isValid={passwordValidation.hasSpecialChar}>
                          Contains at least 1 special character (!@#$...)
                      </ValidationItem>
                  </ul>
              )}
            </div>

            {/* Confirm Password Field (UPDATED CONTAINER for floating status) */}
            <div className={`${getStaggerClass(1400)} ${styles.passwordGroupContainer} ${styles['mb-4']}`}> 
              <label htmlFor="confirmPassword" className={styles.label}>Confirm Password</label>
              <div className={styles.passwordInputWrapper}> 
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  className={styles.inputField}
                  placeholder="••••••••"
                  onChange={handleChange}
                  value={formData.confirmPassword}
                />
                
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className={styles.togglePasswordButton}
                  aria-label={showConfirmPassword ? 'Hide confirmation password' : 'Show confirmation password'}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />} 
                </button>
              </div>
              
              {/* Password Match Status (NOW FLOATING) */}
              {/* MODIFIED: The message is now only displayed if the passwords do NOT match. */}
              {formData.confirmPassword.length > 0 && 
               formData.password.length > 0 && 
               formData.password !== formData.confirmPassword && (
                <div className={`${styles.validationFloat} ${styles.matchStatus}`} 
                     data-match={false}>
                    {'Passwords do not match.'}
                </div>
              )}
            </div>

            {/* Display Status Message */}
            {statusMessage && (
              <p 
                className={`${styles.statusMessage} ${statusMessage.startsWith('**Success!') ? styles.statusMessageSuccess : styles.statusMessageError}`}
                dangerouslySetInnerHTML={{ __html: statusMessage.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}
              />
            )}

            <button
              type="submit"
              className={`${styles.signupButton} ${getStaggerClass(1600)}`} 
              disabled={isSubmitting || !isFormValid}
            >
              {isSubmitting ? 'Creating Account...' : 'Sign Up'}
            </button>

            {/* ... rest of the form */}
            <div className={`${styles.separatorWrapper} ${getStaggerClass(1800)}`}> 
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
              className={`${styles.loginLink} ${getStaggerClass(2000)}`} 
            >
              Log In
            </a>
          </form>
        </main>
      </div>
    </div>
  );
}