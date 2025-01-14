// import AuthForm from "../../components/AuthForm";

// export default function SignUpPage() {
//   return <AuthForm isSignIn={false} />;
// }
// app/signup/page.js

import AuthForm from '../../components/AuthForm';

export default function SignUp() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-md p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">Sign Up</h2>
        <AuthForm isSignUp={true} />
      </div>
    </div>
  );
}
