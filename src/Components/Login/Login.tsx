"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  FiArrowRight,
  FiCheckCircle,
  FiEye,
  FiEyeOff,
  FiFileText,
  FiLock,
  FiMail,
  FiShield,
} from "react-icons/fi";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const payload = { email, password, rememberMe };

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Unable to sign in");

      const nextPath = new URLSearchParams(window.location.search).get("next");
      router.replace(nextPath?.startsWith("/") ? nextPath : "/");
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to sign in");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative h-dvh overflow-hidden bg-slate-50 text-slate-800">
      {/* Background gradients */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-indigo-500/20 blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 h-[600px] w-[600px] rounded-full bg-violet-600/20 blur-[140px]" />
        <div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-[120px]" />
      </div>

      {/* Grid background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(99, 102, 241, 0.1) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 flex h-full items-center justify-center p-3 sm:p-4 lg:p-5">
        <div className="grid h-full w-full max-w-6xl overflow-hidden rounded-[24px] border border-white/60 bg-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.08)] backdrop-blur-2xl lg:grid-cols-2 lg:rounded-[32px]">
          {/* =========================
              LEFT BRANDING SECTION
          ========================== */}
          <motion.section
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative hidden min-h-0 overflow-hidden border-r border-slate-200/50 p-8 lg:flex lg:flex-col lg:justify-between xl:p-10"
          >
            {/* Decorative circles */}
            <div className="absolute right-[-100px] top-[-100px] h-[300px] w-[300px] rounded-full border border-indigo-200/50" />
            <div className="absolute right-[-50px] top-[-50px] h-[200px] w-[200px] rounded-full border border-violet-200/50" />

            <div>
              {/* Logo */}
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/30">
                  <FiFileText className="text-xl text-white" />
                </div>

                <div>
                  <h1 className="text-lg font-semibold tracking-tight text-slate-900">
                    Quotation
                  </h1>
                  <p className="text-xs text-slate-500">Business Portal</p>
                </div>
              </div>

              {/* Hero */}
              <div className="mt-12 max-w-lg xl:mt-20">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                  Secure Business Workspace
                </div>

                <h2 className="text-4xl font-semibold leading-tight tracking-tight text-slate-900 xl:text-5xl">
                  Create.<br />Manage.<br />
                  <span className="bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 bg-clip-text text-transparent">
                    Grow.
                  </span>
                </h2>

                <p className="mt-6 max-w-md text-sm leading-7 text-slate-600">
                  Manage quotations, projects, customers and business
                  documents from one secure workspace.
                </p>
              </div>

              {/* Features */}
              <div className="mt-8 space-y-3 xl:mt-10 xl:space-y-4">
                <Feature icon={<FiCheckCircle />} title="Professional quotations" description="Create clean and consistent quotations." />
                <Feature icon={<FiShield />} title="Secure workspace" description="Keep your business information protected." />
                <Feature icon={<FiFileText />} title="PDF ready" description="Generate professional quotation documents." />
              </div>
            </div>

            {/* Footer */}
            <p className="text-xs text-slate-400">
              © {new Date().getFullYear()} Quotation Portal. All rights reserved.
            </p>
          </motion.section>

          {/* =========================
              LOGIN SECTION
          ========================== */}
          <motion.section
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex min-h-0 items-center justify-center overflow-hidden p-5 sm:p-7 lg:p-8 xl:p-10"
          >
            <div className="w-full max-w-md">
              {/* Mobile logo */}
              <div className="mb-6 flex items-center gap-3 lg:hidden">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/30">
                  <FiFileText className="text-xl text-white" />
                </div>
                <div>
                  <h1 className="font-semibold text-slate-900">Quotation</h1>
                  <p className="text-xs text-slate-500">Business Portal</p>
                </div>
              </div>

              {/* Heading */}
              <div className="mb-6">
                <p className="mb-3 text-sm font-medium text-indigo-600">
                  Welcome back
                </p>

                <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                  Sign in to your
                  <br />
                  <span className="text-slate-500">workspace.</span>
                </h2>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                    {error}
                  </p>
                )}

                {/* Email */}
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">
                    Email address
                  </label>
                  <div className="group relative">
                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-400 transition group-focus-within:text-indigo-500" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      required
                      autoComplete="email"
                      className="h-12 w-full rounded-2xl border border-white/60 bg-white/70 pl-12 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-indigo-200 hover:bg-white/90 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                      Password
                    </label>
                  </div>
                  <div className="group relative">
                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-400 transition group-focus-within:text-indigo-500" />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      autoComplete="current-password"
                      className="h-12 w-full rounded-2xl border border-white/60 bg-white/70 pl-12 pr-12 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-indigo-200 hover:bg-white/90 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                    />
                    <button
                      type="button"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-lg text-slate-400 transition hover:text-slate-600"
                    >
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>

                {/* Remember */}
                <div className="flex items-center justify-between">
                  <label className="flex cursor-pointer items-center gap-3">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="peer sr-only"
                    />
                    <span className="flex h-5 w-5 items-center justify-center rounded-md border border-slate-300 bg-white transition peer-checked:border-indigo-500 peer-checked:bg-indigo-500">
                      <FiCheckCircle className="hidden text-xs text-white peer-checked:block" />
                    </span>
                    <span className="text-sm text-slate-600">Remember me</span>
                  </label>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group flex h-12 w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-500/30 active:translate-y-0"
                >
                  {isSubmitting ? "Signing in..." : "Sign In"}
                  <FiArrowRight className="text-lg transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </form>

              {/* Divider */}
              <div className="my-5 flex items-center gap-4">
                <div className="h-px flex-1 bg-slate-200" />

                <span className="text-xs text-slate-400">
                  Secure access
                </span>

                <div className="h-px flex-1 bg-slate-200" />
              </div>

              {/* Security info */}
              <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                <FiShield className="text-indigo-500" />
                Your connection is protected
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </main>
  );
}

/* =========================
   FEATURE COMPONENT
========================= */

function Feature({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
        {icon}
      </div>

      <div>
        <p className="text-sm font-medium text-slate-800">{title}</p>

        <p className="mt-1 text-xs text-slate-500">{description}</p>
      </div>
    </div>
  );
}
