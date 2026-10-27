
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const API_URL = "http://127.0.0.1:8000";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [message, setMessage] = useState("Verifying your email...");
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setMessage("Verification token is missing.");
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function verifyEmail() {
      try {
        const response = await fetch(
          `${API_URL}/accounts/verify-email/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token }),
          }
        );

        const data = await response.json();

        if (cancelled) return;

        if (response.ok) {
          setSuccess(true);
          setMessage(data.message || "Email verified successfully.");
        } else {
          setMessage(
            data.error || "Verification failed. Your link may have expired."
          );
        }
      } catch {
        if (!cancelled) {
          setMessage("Could not connect to the server. Please try again.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    verifyEmail();

    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md rounded-xl border p-8 text-center">
        <h1 className="mb-4 text-2xl font-bold">
          Email Verification
        </h1>

        <p role="status">{message}</p>

        {loading && <p className="mt-3">Please wait...</p>}

        {success && (
          <a
            href="/"
            className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-3 text-white"
          >
            Continue to NEURONEX
          </a>
        )}
      </div>
    </main>
  );
}
