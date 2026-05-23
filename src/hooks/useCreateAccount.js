import { useEffect, useEffectEvent, useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "sonner";

export const useCreateAccount = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const { getToken }          = useAuth();

  const createAccount = async (formData) => {
    try {
      setLoading(true);
      setError(null);

      // ✅ get Clerk token
      const token = await getToken();

      const id = toast.loading("Creating...");

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/accounts`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
            
      toast.success("Account created successfully! 🎉", { id }); // replaces the loading toast

      return res.data;

    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create account");
      setError(err.response?.data?.message || "Something went wrong");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createAccount, loading, error };
};