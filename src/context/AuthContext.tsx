"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { account } from "@/lib/appwrite";
import { Models, AppwriteException } from "appwrite";
import { useRouter } from "next/navigation";

interface UserData {
  legalName: string;
  nickname?: string;
  birthdate?: string;
  gender?: string;
  phone?: string;
}

interface AuthContextType {
  user: Models.User<Models.Preferences> | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, userData: UserData) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // IIFE to handle async operation
    (async () => {
      try {
        const userData = await account.get();
        setUser(userData);
      } catch {
        setUser(null);
      } finally {
        // Delay setting loading to false to prevent hydration mismatch
        setTimeout(() => {
          setLoading(false);
        }, 0);
      }
    })();
  }, []);

  const generateUserId = () => {
    const timestamp = new Date().getTime().toString(36);
    const random = Math.random().toString(36).substring(2, 4);
    return `u${timestamp}${random}`;
  };

  const signup = async (email: string, password: string, userData: UserData) => {
    try {
      setLoading(true);
      setError(null);
      
      const userId = generateUserId();
      console.log("Generated userId:", userId);

      // Step 1: Create the user account
      await account.create(
        userId,
        email,
        password,
        userData.legalName
      );

      try {
        // Step 2: Create session
        await account.createEmailPasswordSession(email, password);
        
        // Step 3: Update preferences
        await account.updatePrefs({
          ...userData,
          email,
          isPhoneVerified: false,
          isEmailVerified: false
        });
        
        // Step 4: Get user data and update state
        const updatedUser = await account.get();
        setUser(updatedUser);
        
        router.push("/dashboard");
      } catch (sessionError) {
        console.error("Session creation error:", sessionError);
        setError("Account created. Please try logging in.");
        router.push("/login");
      }
    } catch (e) {
      console.error("Signup error:", e);
      if (e instanceof AppwriteException) {
        setError(e.message);
      } else {
        setError("An error occurred during signup");
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Create session and verify it works
      const session = await account.createEmailPasswordSession(email, password);
      console.log("Session created:", session);
      
      // Get user data
      const userData = await account.get();
      console.log("User data:", userData);
      setUser(userData);
      
      router.push("/dashboard");
    } catch (e) {
      console.error("Login error:", e);
      if (e instanceof AppwriteException) {
        setError(e.message);
      } else {
        setError("Invalid email or password");
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Set user to null before deleting session to prevent authentication errors
      setUser(null);
      
      try {
        await account.deleteSession("current");
      } catch (e) {
        // Ignore session deletion errors since we're logging out anyway
        console.log("Session deletion error (ignorable):", e);
      }
      
      router.push("/login");
    } catch (e) {
      if (e instanceof AppwriteException) {
        setError(e.message);
      } else {
        setError("Error logging out");
      }
      // Even if there's an error, keep user logged out
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout, signup, clearError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};