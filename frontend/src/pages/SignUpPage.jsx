import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { Crown, Mail, Lock, User, Sparkles, ArrowRight, Heart, Star, AlertCircle, Loader2, ShieldCheck, RefreshCw, CheckCircle2, KeyRound, Eye, EyeOff } from "lucide-react";

export default function SignUpPage() {
  const { register, verifyRegistration, resendVerificationCode, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Form state
  const [step, setStep] = useState(1); // 1 = registration form, 2 = verification
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Verification code state
  const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""]);
  const [fallbackCode, setFallbackCode] = useState(""); // Only shown if email fails
  const [emailFailed, setEmailFailed] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef([]);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // Cooldown timer for resend
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
    setError("");
  };

  // Handle verification code input
  const handleCodeChange = (index, value) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);
    setError("");

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleCodeKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleCodePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const newCode = pastedData.split("").concat(Array(6).fill("")).slice(0, 6);
      setVerificationCode(newCode);
      // Focus the last filled input or the first empty one
      const focusIndex = Math.min(pastedData.length, 5);
      inputRefs.current[focusIndex]?.focus();
    }
  };

  // Step 1: Submit registration form
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    const result = await register(formData.name, formData.email, formData.password);
    
    if (result.success && result.requiresVerification) {
      setStep(2);
      setEmailFailed(result.emailFailed || false);
      setFallbackCode(result.emailFailed ? result.verificationCode : "");
      setResendCooldown(30);
      setSuccess(result.emailFailed 
        ? "Email delivery failed. Use the code below."
        : "Verification code sent to your email!");
    } else if (!result.success) {
      setError(result.message);
    }
  };

  // Step 2: Verify code
  const handleVerify = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const code = verificationCode.join("");
    if (code.length !== 6) {
      setError("Please enter the complete 6-digit code");
      return;
    }

    const result = await verifyRegistration(formData.email, code);
    
    if (result.success) {
      navigate("/");
    } else {
      setError(result.message);
    }
  };

  // Resend verification code
  const handleResend = async () => {
    if (resendCooldown > 0) return;
    
    setError("");
    setSuccess("");
    
    const result = await resendVerificationCode(formData.email);
    
    if (result.success) {
      setEmailFailed(result.emailFailed || false);
      setFallbackCode(result.emailFailed ? result.verificationCode : "");
      setVerificationCode(["", "", "", "", "", ""]);
      setResendCooldown(30);
      setSuccess(result.emailFailed 
        ? "Email delivery failed. Use the code below."
        : "New verification code sent!");
    } else {
      setError(result.message);
    }
  };

  // Go back to registration form
  const handleBack = () => {
    setStep(1);
    setVerificationCode(["", "", "", "", "", ""]);
    setFallbackCode("");
    setEmailFailed(false);
    setError("");
    setSuccess("");
  };

  if (isAuthenticated) return null;

  return (
    <section className="relative mx-auto max-w-md px-4 py-12 md:px-8 overflow-hidden">
      {/* Floating decorations */}
      <div className="floating-shape floating-shape-1 -right-20 top-10" />
      <div className="floating-shape floating-shape-2 -left-16 bottom-20" />
      <div className="floating-shape floating-shape-3 right-10 bottom-40" />
      
      <div className="card-cute p-[3px]">
        <div className="rounded-[2rem] bg-white p-8 relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
            <div className="absolute inset-0 dots-pattern" />
          </div>
          
          <div className="relative">
            {/* Step indicator */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${step === 1 ? 'bg-royal text-white' : 'bg-mint/30 text-royal'}`}>
                {step > 1 ? <CheckCircle2 className="h-3.5 w-3.5" /> : <span className="w-4 h-4 rounded-full bg-white/30 grid place-items-center text-[10px]">1</span>}
                <span>Details</span>
              </div>
              <div className="w-8 h-0.5 bg-royal/20 rounded-full" />
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${step === 2 ? 'bg-royal text-white' : 'bg-royal/10 text-royal/50'}`}>
                <span className="w-4 h-4 rounded-full bg-white/30 grid place-items-center text-[10px]">2</span>
                <span>Verify</span>
              </div>
            </div>

            {/* Header */}
            <div className="text-center mb-6">
              <div className={`inline-flex items-center justify-center h-16 w-16 rounded-2xl shadow-soft mb-4 transition-all ${step === 1 ? 'bg-gradient-to-br from-lilac to-blush' : 'bg-gradient-to-br from-mint to-sky'}`}>
                {step === 1 ? <Crown className="h-8 w-8 text-royal" /> : <ShieldCheck className="h-8 w-8 text-royal" />}
              </div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-ink/50 flex items-center justify-center gap-2">
                <Sparkles className="h-3 w-3 text-banana-400" />
                {step === 1 ? "Create Account" : "Verify Email"}
                <Sparkles className="h-3 w-3 text-banana-400" />
              </p>
              <h1 className="mt-2 text-2xl font-bold text-royal">
                {step === 1 ? "Join the royal court" : "Enter verification code"}
              </h1>
              <p className="mt-2 text-sm text-ink/60">
                {step === 1 
                  ? "Create your account to support the chonky royals."
                  : `We sent a 6-digit code to ${formData.email}`
                }
              </p>
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-4 rounded-2xl bg-coral/10 border border-coral/20 px-4 py-3 text-sm text-coral flex items-center gap-2">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Success message */}
            {success && (
              <div className="mb-4 rounded-2xl bg-mint/20 border border-mint/30 px-4 py-3 text-sm text-royal flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-mint" />
                {success}
              </div>
            )}

            {/* Fallback code display - Only shown when email fails */}
            {step === 2 && emailFailed && fallbackCode && (
              <div className="mb-4 rounded-2xl bg-banana-100/50 border border-banana-200 px-4 py-3 text-sm text-royal">
                <div className="flex items-center gap-2 mb-1">
                  <KeyRound className="h-4 w-4 text-banana-500" />
                  <span className="font-semibold">Email Delivery Issue</span>
                </div>
                <p className="text-xs text-ink/60">We couldn't send the email. Use this code instead:</p>
                <p className="mt-2 text-2xl font-bold tracking-[0.3em] text-center text-royal">{fallbackCode}</p>
              </div>
            )}

            {/* Step 1: Registration Form */}
            {step === 1 && (
              <form className="space-y-4" onSubmit={handleSubmit}>
                <label className="block text-sm font-semibold text-ink/60">
                  <span className="flex items-center gap-2 mb-2">
                    <User className="h-4 w-4" />
                    Full Name
                  </span>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your royal name"
                    className="input-soft"
                    required
                  />
                </label>

                <label className="block text-sm font-semibold text-ink/60">
                  <span className="flex items-center gap-2 mb-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </span>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="royal@example.com"
                    className="input-soft"
                    required
                  />
                </label>

                <label className="block text-sm font-semibold text-ink/60">
                  <span className="flex items-center gap-2 mb-2">
                    <Lock className="h-4 w-4" />
                    Password
                  </span>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="input-soft pr-12"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-ink/40 hover:text-royal transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </label>

                <label className="block text-sm font-semibold text-ink/60">
                  <span className="flex items-center gap-2 mb-2">
                    <Lock className="h-4 w-4" />
                    Confirm Password
                  </span>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="input-soft pr-12"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-ink/40 hover:text-royal transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </label>

                <label className="flex items-start gap-2 text-sm text-ink/70 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 rounded border-royal/20 text-royal focus:ring-royal/30"
                    required
                  />
                  <span>
                    I agree to the{" "}
                    <button type="button" className="text-royal transition hover:text-ink animated-underline">
                      Terms of Service
                    </button>{" "}
                    and{" "}
                    <button type="button" className="text-royal transition hover:text-ink animated-underline">
                      Privacy Policy
                    </button>
                  </span>
                </label>

                <button 
                  type="submit" 
                  className="btn-primary w-full flex items-center justify-center gap-2 group"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Sending code...</span>
                    </>
                  ) : (
                    <>
                      <span>Continue</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Step 2: Verification Code */}
            {step === 2 && (
              <form className="space-y-6" onSubmit={handleVerify}>
                {/* 6-digit code input */}
                <div>
                  <label className="block text-sm font-semibold text-ink/60 mb-3 text-center">
                    Enter 6-digit verification code
                  </label>
                  <div className="flex justify-center gap-2" onPaste={handleCodePaste}>
                    {verificationCode.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => (inputRefs.current[index] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleCodeChange(index, e.target.value)}
                        onKeyDown={(e) => handleCodeKeyDown(index, e)}
                        className="w-12 h-14 text-center text-2xl font-bold rounded-xl border-2 border-royal/20 bg-white focus:border-royal focus:ring-2 focus:ring-royal/20 transition-all text-royal"
                        autoFocus={index === 0}
                      />
                    ))}
                  </div>
                </div>

                {/* Resend code */}
                <div className="text-center">
                  <p className="text-sm text-ink/60 mb-2">Didn't receive the code?</p>
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendCooldown > 0 || loading}
                    className={`inline-flex items-center gap-2 text-sm font-semibold transition-all ${
                      resendCooldown > 0 
                        ? 'text-ink/40 cursor-not-allowed' 
                        : 'text-royal hover:text-ink'
                    }`}
                  >
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
                  </button>
                </div>

                <div className="flex gap-3">
                  <button 
                    type="button"
                    onClick={handleBack}
                    className="btn-secondary flex-1 flex items-center justify-center gap-2"
                    disabled={loading}
                  >
                    Back
                  </button>
                  <button 
                    type="submit" 
                    className="btn-primary flex-1 flex items-center justify-center gap-2 group"
                    disabled={loading || verificationCode.join("").length !== 6}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <span>Verify</span>
                        <ShieldCheck className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            <div className="divider-elegant my-6">
              <Star className="h-4 w-4 text-banana-400" />
            </div>

            <div className="text-center text-sm text-ink/70">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-royal transition hover:text-ink inline-flex items-center gap-1 animated-underline"
              >
                Login
                <Heart className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
