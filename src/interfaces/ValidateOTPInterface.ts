interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    emailVerified: boolean;
    refreshToken: string | null;
    createdAt: string;
    updatedAt: string;
  }
  
 export interface ValidateOTPResponseInterface {
    success: boolean;
    message: string;
    user: User;
  }
  