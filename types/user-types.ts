import { Timestamp } from "firebase/firestore";

export interface User {
  id: string;
  name: string;
  email: string;
  image: string;
  username: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends AuthCredentials {
  registrationId?: string;
}