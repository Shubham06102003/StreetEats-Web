// import AuthForm from "../../components/AuthForm";

// export default function SignInPage() {
//   return <AuthForm isSignIn={true} />;
// }
// app/signin/page.js

import AuthForm from '../../components/AuthForm';

export default function SignIn() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-md p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">Sign In</h2>
        <AuthForm isSignUp={false} />
      </div>
    </div>
  );
}
