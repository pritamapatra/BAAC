import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex justify-center items-center h-screen">
      <SignIn />
      <div className="absolute bottom-8">
        <a href="/forgot-password" className="text-orange-500 hover:underline">
          Forgot Password?
        </a>
      </div>
    </div>
  );
}