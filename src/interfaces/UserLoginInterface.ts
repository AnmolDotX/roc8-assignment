export interface IUser {
    id: number;
    name: string;
    refreshToken: string;
    email: string;
    emailVerified: boolean;
    createdAt: string; 
    updatedAt: string; 
    checkedCategories: Category[];
}

export interface IUserLoginResponse {
    success: boolean;
    message: string;
    user: IUser;
}

interface Category {
    id: number;
    name: string;
    isChecked: boolean;
}
