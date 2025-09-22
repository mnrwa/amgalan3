"use client";

import React, { useState } from 'react';
import { useAuth } from '../../contexts/auth-context';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    await register({ username, email, password });
    router.push('/dashboard');
  }

  return (
    <div className="card" style={{maxWidth:480, margin:'0 auto'}}>
      <h2>Create account</h2>
      <form onSubmit={handle} className="field">
        <input value={username} onChange={(e)=>setUsername(e.target.value)} placeholder="Username" required />
        <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" required />
        <input value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password" type="password" required />
        <button className="btn" type="submit">Register</button>
      </form>
    </div>
  )
}
