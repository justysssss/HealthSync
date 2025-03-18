"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/context/AuthContext"
import Link from "next/link"
import { HeartPulse, Info } from "lucide-react"

interface AuthPageProps {
  type: "login" | "signup"
}

export default function AuthPage({ type }: AuthPageProps) {
  const { login, signup, loading, error, clearError } = useAuth()

  // Form states
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [legalName, setLegalName] = useState("")
  const [nickname, setNickname] = useState("")
  const [birthdate, setBirthdate] = useState("")
  const [gender, setGender] = useState("")
  const [phone, setPhone] = useState("")

  // Form validation
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!email) errors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(email)) errors.email = "Invalid email format"

    if (!password) errors.password = "Password is required"
    else if (password.length < 8) errors.password = "Password must be at least 8 characters"

    if (type === "signup") {
      if (!legalName) errors.legalName = "Full name is required"
      if (!birthdate) errors.birthdate = "Birth date is required"
      if (!gender) errors.gender = "Gender is required"
      if (!phone) errors.phone = "Phone number is required"
      else if (!/^\+?[\d\s-]+$/.test(phone)) errors.phone = "Invalid phone number"
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()

    if (!validateForm()) return

    try {
      if (type === "signup") {
        await signup(email, password, {
          legalName,
          nickname,
          birthdate,
          gender,
          phone,
        })
      } else {
        await login(email, password)
      }
    } catch (error) {
      // Error handling is done in the AuthContext
      console.error("Auth error:", error)
    }
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Left side - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-cyan-600 flex-col justify-center items-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=800&width=800')] bg-cover bg-center opacity-10"></div>
        <div className="relative z-10 max-w-md text-center">
          <div className="flex justify-center mb-8">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-full">
              <HeartPulse size={64} className="text-cyan-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-6">HealthSync</h1>
          <p className="text-xl text-white/90 mb-8">
            Your health journey, synchronized. Access your medical records, schedule appointments, and connect with
            healthcare professionals all in one place.
          </p>
          <div className="grid grid-cols-3 gap-4 mt-12">
            <div className="bg-white/20 p-4 rounded-lg backdrop-blur-sm">
              <h3 className="text-white font-medium">Secure Access</h3>
            </div>
            <div className="bg-white/20 p-4 rounded-lg backdrop-blur-sm">
              <h3 className="text-white font-medium">24/7 Support</h3>
            </div>
            <div className="bg-white/20 p-4 rounded-lg backdrop-blur-sm">
              <h3 className="text-white font-medium">Privacy First</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex justify-center items-center p-6">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex lg:hidden justify-center mb-8">
            <div className="flex items-center gap-2">
              <HeartPulse size={32} className="text-cyan-600" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">HealthSync</h1>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <div className="flex items-center justify-center mb-6">
              <div className="w-12 h-1 bg-cyan-600 rounded-full"></div>
            </div>

            <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
              {type === "signup" ? "Create Your Health Account" : "Welcome Back"}
            </h2>

            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-300 rounded-md">
                <p className="flex items-center">
                  <Info className="h-5 w-5 mr-2" />
                  {error}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {type === "signup" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={legalName}
                      onChange={(e) => setLegalName(e.target.value)}
                      className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                      placeholder="Enter your full name"
                    />
                    {validationErrors.legalName && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.legalName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Nickname (Optional)
                    </label>
                    <input
                      type="text"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                      placeholder="Enter your preferred name"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Birth Date
                      </label>
                      <input
                        type="date"
                        value={birthdate}
                        onChange={(e) => setBirthdate(e.target.value)}
                        className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 
                                 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                      />
                      {validationErrors.birthdate && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.birthdate}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gender</label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 
                                 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                      >
                        <option value="">Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                      {validationErrors.gender && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.gender}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                      placeholder="+1 (555) 123-4567"
                    />
                    {validationErrors.phone && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.phone}</p>
                    )}
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  placeholder="your.email@example.com"
                />
                {validationErrors.email && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.email}</p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                  {type === "login" && (
                    <Link href="/forgot-password" className="text-sm text-cyan-600 hover:text-cyan-500">
                      Forgot password?
                    </Link>
                  )}
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
                {validationErrors.password && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.password}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full p-3.5 rounded-lg text-white font-medium ${
                  loading ? "bg-cyan-400 cursor-not-allowed" : "bg-cyan-600 hover:bg-cyan-700"
                } transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  <span>{type === "signup" ? "Create Health Account" : "Sign In"}</span>
                )}
              </button>

              {type === "signup" && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                  By creating an account, you agree to our{" "}
                  <Link href="/terms" className="text-cyan-600 hover:text-cyan-500">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-cyan-600 hover:text-cyan-500">
                    Privacy Policy
                  </Link>
                </p>
              )}
            </form>

            <div className="mt-6 pt-5 border-t border-gray-200 dark:border-gray-700">
              <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                {type === "signup" ? (
                  <>
                    Already have an account?{" "}
                    <Link href="/login" className="text-cyan-600 hover:text-cyan-500 font-medium">
                      Sign in
                    </Link>
                  </>
                ) : (
                  <>
                    Don&apos;t have an account?{" "}
                    <Link href="/sign-up" className="text-cyan-600 hover:text-cyan-500 font-medium">
                      Create one
                    </Link>
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>
              Need help?{" "}
              <a href="#" className="text-cyan-600 hover:text-cyan-500">
                Contact Support
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

