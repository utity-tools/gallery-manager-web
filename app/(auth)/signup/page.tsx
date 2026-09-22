import type { Metadata } from "next";
import Link from "next/link";
import SignupForm from "@/components/auth/SignupForm";

export const metadata: Metadata = {
  title: "Sign up | Gallery Manager",
};

export default function SignupPage() {
  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight">Create your account</h1>
      <p className="mt-2 text-sm text-gray-500">Set up your gallery in less than a minute.</p>

      <div className="mt-8">
        <SignupForm />
      </div>

      <p className="mt-8 text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-accent-600 hover:text-accent-700">
          Log in
        </Link>
      </p>
    </>
  );
}
