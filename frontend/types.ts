export interface UserType {
  id: number;
  username: string;
  email: string;
  role: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

export interface DocumentType {
  id: number;
  title: string;
  description?: string;
  category_id?: number;
}
