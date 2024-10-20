import { signIn, signOut, useSession } from "next-auth/react";

const Login = () => {
  const { data: session } = useSession();

  if (session) {
    return (
      <div>
        <h1>Welcome, {session.user?.name}</h1>
        <button onClick={() => signOut()}>Sign out</button>
        {/* Redirect to landing page */}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl">Please sign in</h1>
      <button onClick={() => signIn("google")} className="mt-4">
        Sign in with Google
      </button>
      <button onClick={() => signIn("github")} className="mt-4">
        Sign in with GitHub
      </button>
    </div>
  );
};

export default Login;
