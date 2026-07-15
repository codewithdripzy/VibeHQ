"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { VibeHQLogo } from "@/components/landing/VibeHQLogo";
import { useAuth } from "@/contexts/auth.context";
import { useToast } from "@/contexts/toast.context";
import { ApiError } from "@/services/api.service";
import { Icon } from "@iconify/react";
import type { FirebaseApp } from "firebase/app";
import type { Auth } from "firebase/auth";

let firebaseApp: FirebaseApp | null = null;
let firebaseAuth: Auth | null = null;

async function getFirebaseAuth() {
  if (firebaseAuth) return firebaseAuth;
  const { initializeApp, getApps, getApp } = await import("firebase/app");
  const { getAuth } = await import("firebase/auth");

  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  };

  if (!getApps().length) {
    firebaseApp = initializeApp(config);
  } else {
    firebaseApp = getApp();
  }
  firebaseAuth = getAuth(firebaseApp);
  return firebaseAuth;
}

type AuthMode = "login" | "signup";

function AuthForm() {
  const searchParams = useSearchParams();
  const initialMode = searchParams.get("mode") === "signup" ? "signup" : "login";
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [socialLoading, setSocialLoading] = useState<"google" | "github" | null>(null);

  const { login, register, loginWithGoogle, loginWithGithub, error: authError, clearError } = useAuth();
  const { toast } = useToast();

  const displayError = localError || authError;

  const resetFields = () => {
    setEmail("");
    setPassword("");
    setFirstName("");
    setLastName("");
    setLocalError(null);
    clearError();
  };

  const handleModeSwitch = (newMode: AuthMode) => {
    resetFields();
    setMode(newMode);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setSubmitting(true);
    try {
      if (mode === "login") {
        await login(email, password);
        toast("Welcome back!", "success");
      } else {
        await register(firstName, lastName, email, password);
        toast("Account created successfully!", "success");
      }
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Something went wrong";
      toast(message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setLocalError(null);
    setSocialLoading("google");
    try {
      const auth = await getFirebaseAuth();
      const { signInWithPopup, GoogleAuthProvider } = await import("firebase/auth");

      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      await loginWithGoogle(idToken);
      toast("Signed in with Google!", "success");
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setLocalError(err.message);
        toast(err.message, "error");
      } else if (typeof err === "object" && err !== null && "code" in err) {
        const firebaseErr = err as { code: string };
        console.log(firebaseErr);
        if (firebaseErr.code !== "auth/popup-closed-by-user") {
          setLocalError("Google sign-in failed. Please try again.");
          toast("Google sign-in failed", "error");
        }
      }
    } finally {
      setSocialLoading(null);
    }
  };

  const handleGithub = async () => {
    setLocalError(null);
    setSocialLoading("github");
    try {
      const auth = await getFirebaseAuth();
      const { signInWithPopup, OAuthProvider } = await import("firebase/auth");
      const provider = new OAuthProvider("github.com");
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      await loginWithGithub(idToken);
      toast("Signed in with GitHub!", "success");
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setLocalError(err.message);
        toast(err.message, "error");
      } else if (typeof err === "object" && err !== null && "code" in err) {
        const firebaseErr = err as { code: string };
        if (firebaseErr.code !== "auth/popup-closed-by-user") {
          setLocalError("GitHub sign-in failed. Please try again.");
          toast("GitHub sign-in failed", "error");
        }
      }
    } finally {
      setSocialLoading(null);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side — image */}
      <div className="hidden lg:flex lg:w-2/3 relative overflow-hidden">
        <img
          src="/bg-alt.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-black/60" />

        <div className="relative z-10 flex flex-col justify-between p-10 w-full">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <VibeHQLogo size={28} />
            <span className="text-lg font-bold text-white">VibeHQ</span>
          </Link>

          <div>
            <motion.h1
              className="text-4xl xl:text-5xl font-semibold tracking-tight mb-4 font-[family-name:var(--font-stack-sans-notch)]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
            >
              Your AI company.
              <br />
              <span className="font-serif italic font-normal">Running itself.</span>
            </motion.h1>
            <motion.p
              className="text-gray-400 text-sm max-w-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] as const }}
            >
              Hire employees, build products, serve customers — all autonomous.
            </motion.p>
          </div>
        </div>
      </div>

      {/* Right side — form */}
      <div className="flex w-full lg:w-1/3 flex-col items-center justify-center px-6 py-12 bg-black">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2 mb-10">
          <VibeHQLogo size={28} />
          <span className="text-lg font-bold text-white">VibeHQ</span>
        </div>

        <motion.div
          className="w-full max-w-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }}
        >
          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-3xl font-semibold text-white tracking-tight mb-1 font-[family-name:var(--font-stack-sans-notch)]">
              {mode === "login" ? "Welcome back" : "Create your account"}
            </h2>
            <p className="text-sm text-gray-400">
              {mode === "login"
                ? "Sign in to access your AI company."
                : "Get started with your autonomous AI company."}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex mb-8 bg-[#111] rounded-full p-1 border border-white/5">
            {(["login", "signup"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => handleModeSwitch(tab)}
                className={`relative flex-1 py-2.5 text-sm font-medium rounded-full transition-colors ${mode === tab ? "text-white" : "text-gray-500 hover:text-gray-300"
                  }`}
              >
                {mode === tab && (
                  <motion.div
                    layoutId="auth-tab"
                    className="absolute inset-0 bg-[#1C1C1E] border border-white/10 rounded-full"
                    transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                  />
                )}
                <span className="relative z-10">{tab === "login" ? "Log in" : "Sign up"}</span>
              </button>
            ))}
          </div>

          {/* Error */}
          <AnimatePresence>
            {displayError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 overflow-hidden"
              >
                <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
                  {displayError}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {mode === "signup" && (
                <motion.div
                  key="name-fields"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1.5">
                        First name
                      </label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Alex"
                        required
                        className="w-full px-4 py-3 rounded-xl bg-[#111] border border-white/10 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/10 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1.5">
                        Last name
                      </label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Johnson"
                        required
                        className="w-full px-4 py-3 rounded-xl bg-[#111] border border-white/10 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/10 transition-colors"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@company.com"
                required
                className="w-full px-4 py-3 rounded-xl bg-[#111] border border-white/10 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/10 transition-colors"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-gray-400">Password</label>
                {mode === "login" && (
                  <a href="#" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
                    Forgot password?
                  </a>
                )}
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full px-4 py-3 rounded-xl bg-[#111] border border-white/10 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/10 transition-colors"
              />
            </div>

            <motion.button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl bg-white text-black text-sm font-medium mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={submitting ? {} : { scale: 1.01 }}
              whileTap={submitting ? {} : { scale: 0.99 }}
            >
              {submitting ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
                  {mode === "login" ? "Logging in..." : "Creating account..."}
                </span>
              ) : (
                mode === "login" ? "Log in" : "Create account"
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-black px-3 text-gray-500">or continue with</span>
            </div>
          </div>

          {/* Social login */}
          <div className="grid grid-cols-2 gap-3">
            <motion.button
              type="button"
              onClick={handleGoogle}
              disabled={submitting || socialLoading !== null}
              className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[#111] border border-white/10 text-sm text-gray-300 hover:bg-[#1a1a1a] transition-colors disabled:opacity-50 cursor-pointer"
              whileHover={submitting || socialLoading ? {} : { scale: 1.02 }}
              whileTap={submitting || socialLoading ? {} : { scale: 0.98 }}
            >
              {socialLoading === "google" ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-transparent" />
              ) : (
                <Icon icon="logos:google-icon" className="w-4 h-4" />
              )}
              {socialLoading === "google" ? "Signing in..." : "Google"}
            </motion.button>
            <motion.button
              type="button"
              onClick={handleGithub}
              disabled={submitting || socialLoading !== null}
              className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[#111] border border-white/10 text-sm text-gray-300 hover:bg-[#1a1a1a] transition-colors disabled:opacity-50 cursor-pointer"
              whileHover={submitting || socialLoading ? {} : { scale: 1.02 }}
              whileTap={submitting || socialLoading ? {} : { scale: 0.98 }}
            >
              {socialLoading === "github" ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-transparent" />
              ) : (
                <Icon icon="mdi:github" className="w-4 h-4" />
              )}
              {socialLoading === "github" ? "Signing in..." : "GitHub"}
            </motion.button>
          </div>

          {/* Footer text */}
          <p className="text-center text-sm text-gray-500 mt-5">
            {mode === "login" ? (
              <>
                Don&apos;t have an account?{" "}
                <button
                  onClick={() => handleModeSwitch("signup")}
                  className="text-white hover:underline"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => handleModeSwitch("login")}
                  className="text-white hover:underline cursor-pointer"
                >
                  Log in
                </button>
              </>
            )}
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense>
      <AuthForm />
    </Suspense>
  );
}
