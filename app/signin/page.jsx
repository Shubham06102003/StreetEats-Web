import AuthForm from '../../components/AuthForm';

export default function SignIn() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex justify-center items-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md dark:text-white">
        <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-white mb-6">
          Sign In
        </h2>
        <AuthForm isSignUp={false} />
      </div>
    </div>
  );
}
