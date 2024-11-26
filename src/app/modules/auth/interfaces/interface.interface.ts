import { UserStatuses } from "./enums";

export interface IUser {
    id: number;
    names: string;
    username: string;
    password: string;
    profilePicture?: string;
    profilePictureUrl?: string;
    userStatus: IUserStatus;
    isActive?: boolean;
}

export interface ResponseRegister {
    user: IUser
}

export interface updateTokenWebPushRequest {
    tokenWebPush: string
}

export interface LoginResponse {
    user: IUser,
    accessToken: string,
    refreshToken: string
}

export interface Country {
    name: {
        common: string;
        official: string;
        nativeName?: { [key: string]: { common: string; official: string } };
    };
    independent: boolean;
    status: string;
    unMember: boolean;
    currencies: {
        [key: string]: 
            { 
                name: string;
                symbol: string 
            }
        };
    idd: { root: string; suffixes: string[] | null };
    flags: { png: string; svg: string; alt: string };
    coatOfArms: { png: string; svg: string };
    startOfWeek: string;
    capitalInfo: { latlng: number[]   
   };
}

export interface IUserStatus {
    id?: number;
    userId?: number;
    status: UserStatuses;
    message?: string | null;  
    isStatusVisible?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }