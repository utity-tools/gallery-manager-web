import type { Metadata } from "next";
import Link from "next/link";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Log in | Gallery Manager",
};

export default function LoginPage() {
  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
      <p className="mt-2 text-sm text-gray-500">Log in to manage your gallery.</p>

      <div className="mt-8">
        <LoginForm />
      </div>

      <p className="mt-8 text-center text-sm text-gray-500">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-medium text-accent-600 hover:text-accent-700">
          Sign up
        </Link>
      </p>
    </>
  );
}
