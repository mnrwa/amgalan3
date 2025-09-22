"use client";

import React from 'react';
import { useAuth } from '../../contexts/auth-context';

export default function DashboardPage(){
  const { user } = useAuth();
  return (
    <div className="card">
      <h2>Welcome, {user?.username}</h2>
      <p className="muted">From here you can manage your documents.</p>
      <div style={{marginTop:12}}>
        <a className="btn ghost" href="/documents">Go to Documents</a>
      </div>
    </div>
  )
}
