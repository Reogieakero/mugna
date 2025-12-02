"use client";

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import styles from "../signup/SignupPage.module.css";
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'; 

const getStaggerClass = (delay: number) => 
  `${styles.staggerIn} [animation-delay:${delay}ms]`;

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get('id');
  const email = searchParams.get('email'); 
  
  const [verificationCode, setVerificationCode] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  
  const isCodeValidFormat = verificationCode.length === 6 && /^\d+$/.test(verificationCode);

  useEffect(() => {
    if (!userId || !email) {
      router.push('/signup');
    }
  }, [userId, email, router]);

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (/^\d*$/.test(value) && value.length <= 6) {
      setVerificationCode(value);
      setStatusMessage(null); 
    }
  };

  const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userId || !email || !isCodeValidFormat) return;

    setStatusMessage(null); 
    setIsSubmitting(true);

    try {
      const response = await fetch('/verify/api', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: parseInt(userId), code: verificationCode }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatusMessage(`Success! Your account has been verified. Redirecting to login...`); 
        
        setTimeout(() => {
          router.push('/login'); 
        }, 1000); 
        
      } else {
        setStatusMessage(`Error: ${data.error || 'The code is invalid or has expired.'}`);
      }
    } catch (error) {
      setStatusMessage('Network Error: An unexpected network issue occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleResend = async () => {
    if (!userId || !email || isResending) return;
    
    setIsResending(true);
    setStatusMessage(null); 

    try {
      const response = await fetch('/verify/api/resend', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: parseInt(userId), email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatusMessage(`Success! A new code has been sent to ${email}. Check your inbox.`);
      } else {
        setStatusMessage(`Error: ${data.error || 'Failed to resend code.'}`);
      }
    } catch (error) {
      setStatusMessage('Network Error: Could not resend the code.');
    } finally {
      setIsResending(false);
    }
  };

  if (!userId || !email) {
    return null; 
  }
  
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

      <div 
        className={styles.contentWrapper}
        style={{ 
          display: 'flex', 
          justifyContent: 'flex-end',
          alignItems: 'center',       
          width: '100%', 
          height: '100%',
          paddingRight: '2%'
        }}
      >
        
        <main 
          className={`${styles.signupFormMain} ${getStaggerClass(400)}`}
          style={{ maxWidth: '28rem' }} 
        >
          
          <div className={`${styles.headerContainer} ${getStaggerClass(600)}`}> 
            <h1 className={styles.headerTitle}>
              Mugna
            </h1>
            <h1 className={styles.headerSubtitle} style={{ marginBottom: '1.5rem' }}>
              Verify Your Account
            </h1>
          </div>

          <p className={getStaggerClass(800)} style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#475569', fontSize: '0.95rem' }}>
            A 6-digit verification code has been sent to {email}.
            Please enter it below to activate your account.
          </p>

          <form className={styles.formWrapper} onSubmit={handleVerify}>
            
            <div className={`${getStaggerClass(1000)} ${styles['mb-4']}`}> 
              <label htmlFor="code" className={styles.label}>Verification Code</label>
              <input
                id="code"
                name="code"
                type="text"
                required
                className={styles.inputField}
                placeholder="123456"
                onChange={handleCodeChange}
                value={verificationCode}
                maxLength={6}
                inputMode="numeric"
                style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold', letterSpacing: '8px' }}
              />
            </div>

            {statusMessage && (
              <p 
                className={`${styles.statusMessage} ${statusMessage.startsWith('Success!') ? styles.statusMessageSuccess : styles.statusMessageError}`}
                dangerouslySetInnerHTML={{ __html: statusMessage.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}
              />
            )}

            <button
              type="submit"
              className={`${styles.signupButton} ${getStaggerClass(1200)}`} 
              disabled={isSubmitting || !isCodeValidFormat}
            >
              {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : 'Verify Account'}
            </button>
            
            <div className={`${styles.separatorWrapper} ${getStaggerClass(1400)}`}> 
              <div className={styles.separatorLine}>
                <div className={styles.separatorBar}></div>
              </div>
              <div className={styles.separatorTextContainer}>
                <span className={styles.separatorText}>
                  Didn&apos;t receive a code?
                </span>
              </div>
            </div>

            <button
              type="button"
              className={`${styles.loginLink} ${getStaggerClass(1600)}`} 
              onClick={handleResend}
              disabled={isResending}
              style={{ borderColor: '#6b7280', color: '#6b7280' }}
            >
              {isResending ? 'Sending New Code...' : 'Resend Code'}
            </button>

          </form>
        </main>
      </div>
    </div>
  );
}