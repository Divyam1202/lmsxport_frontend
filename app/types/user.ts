export interface User {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: "admin" | "student" | "instructor";
    courses?: string[];
    complaint: string[];
    comparePassword(candidatePassword: string): Promise<boolean>;
  }