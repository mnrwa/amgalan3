export const authApi = {
  login: async (data: { email: string; password: string }) => {
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error((await res.json()).error);
    return res.json();
  },
  register: async (data: { username: string; email: string; password: string }) => {
    const res = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error((await res.json()).error);
    return res.json();
  },
  getMe: async (token: string) => {
    const res = await fetch('http://localhost:5000/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Unauthorized');
    return res.json();
  },
};

export const documentApi = {
  getAll: async (token: string) => {
    const res = await fetch('http://localhost:5000/api/documents', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.json();
  },
  create: async (token: string, data: { title: string; description?: string; category_id?: number }) => {
    let res;
    if ((data as any).file) {
      const form = new FormData();
      form.append('title', data.title);
      if (data.description) form.append('description', data.description);
      if (data.category_id) form.append('category_id', String(data.category_id));
      form.append('file', (data as any).file);
      res = await fetch('http://localhost:5000/api/documents', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form
      });
    } else {
      res = await fetch('http://localhost:5000/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(data)
      });
    }
    return res.json();
  },
  update: async (token: string, id: number, data: { title?: string; description?: string; category_id?: number }) => {
    let res;
    if ((data as any).file) {
      const form = new FormData();
      if (data.title) form.append('title', data.title);
      if (data.description) form.append('description', data.description);
      if (data.category_id) form.append('category_id', String(data.category_id));
      form.append('file', (data as any).file);
      res = await fetch(`http://localhost:5000/api/documents/${id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: form
      });
    } else {
      res = await fetch(`http://localhost:5000/api/documents/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(data)
      });
    }
    return res.json();
  },
  delete: async (token: string, id: number) => {
    const res = await fetch(`http://localhost:5000/api/documents/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.json();
  }
};

export const categoryApi = {
  getAll: async () => {
    const res = await fetch('http://localhost:5000/api/categories');
    return res.json();
  },
  create: async (data: { name: string; description?: string }) => {
    const res = await fetch('http://localhost:5000/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  }
}
