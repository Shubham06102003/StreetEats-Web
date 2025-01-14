// components/AuthForm.js
"use client"
import { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase'; // Import Firebase Auth and Firestore instances

export default function AuthForm({ isSignUp = true }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isSignUp) {
        // Sign Up
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Store user data in Firestore with role
        await setDoc(doc(db, 'users', user.uid), {
          email,
          role,
        });

        // Redirect to dashboard based on the role
        router.push(role === 'admin' ? '/admin-dashboard' : '/customer-dashboard');
      } else {
        // Sign In
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Fetch user role from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const { role } = userDoc.data();

          // Redirect based on the role stored in Firestore
          router.push(role === 'admin' ? '/admin-dashboard' : '/customer-dashboard');
        } else {
          throw new Error('User data not found.');
        }
      }
    } catch (err) {
      setError('Authentication failed. Please try again.');
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          required
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          required
        />
      </div>

      {isSignUp && (
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          >
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      )}

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button type="submit" className="w-full py-2 px-4 bg-blue-500 text-white rounded-md">
        {isSignUp ? 'Sign Up' : 'Sign In'}
      </button>
    </form>
  );
}
