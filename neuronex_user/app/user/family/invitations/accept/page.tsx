
"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function verifyEmail() {
      if (!token) {
        setError("Verification token is missing or invalid.");
        setLoading(false);
        return;
      }

      try {
        const API =
          process.env.NEXT_PUBLIC_API_URL ||
          "http://127.0.0.1:8000";

        const response = await fetch(
          `${API}/accounts/verify-email/?token=${encodeURIComponent(token)}`,
          {
            method: "GET",
          }
        );

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            data.error ||
              data.detail ||
              "Email verification failed."
          );
        }

        setMessage(
          data.message || "Email verified successfully!"
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong."
        );
      } finally {
        setLoading(false);
      }
    }

    verifyEmail();
  }, [token]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <section className="w-full max-w-md rounded-xl border bg-white p-8 shadow-sm">
        <h1 className="mb-4 text-2xl font-bold text-gray-900">
          Email Verification
        </h1>

        {loading && (
          <p className="text-gray-600">
            Verifying your email...
          </p>
        )}

        {error && (
          <p role="alert" className="rounded-md bg-red-50 p-3 text-red-700">
            {error}
          </p>
        )}

        {message && (
          <p role="status" className="rounded-md bg-green-50 p-3 text-green-700">
            {message}
          </p>
        )}

        {!loading && (
          <button
            onClick={() => router.push("/accounts/login")}
            className="mt-5 w-full rounded-md bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700"
          >
            Go to Login
          </button>
        )}
      </section>
    </main>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <main className="p-8 text-center">
          Loading verification page...
        </main>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
