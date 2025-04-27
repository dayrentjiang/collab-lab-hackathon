import { SignInButton } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white px-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome to CollabLab
          </h1>
          <p className="mt-2 text-gray-600">
            Sign in to start collaborating on meaningful projects
          </p>
        </div>

        <div className="mt-8">
          <SignInButton mode="modal">
            <button className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all shadow-md hover:shadow-lg">
              Sign in to your account
            </button>
          </SignInButton>

          <p className="mt-6 text-center text-sm text-gray-500">
            Don&apos;t have an account yet?{" "}
            <SignInButton mode="modal">
              <span className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer">
                Sign up here
              </span>
            </SignInButton>
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-center text-xs text-gray-500">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
