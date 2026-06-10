import type { Timestamp } from "firebase/firestore";

export interface User {
    id: string;
    name: string;
    username: string;
    displayName: string;
    email: string;
    image: string;

    createdAt: Timestamp;
    updatedAt: Timestamp;
}