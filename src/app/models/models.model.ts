import { ChatType } from "../modules/auth/interfaces/enums";
import { IUser } from "../modules/auth/interfaces/interface.interface";

export interface IContact {
    id?: number;
    userId: number;
    contactUserId: number;
    status: string;
    user?: IUser;
    contactUser?: IUser;
}

export interface IChat {
    id?: number;
    chatType?: ChatType,
    chatMembers?: IChatMembers[],
    messages?: IMessage[]
}

export interface IChatMembers {
    id?: number;
    chatId?: number;
    userId?: number;
    chat?: IChat;
    user?: IUser;
    joinedAt?: Date;
}

export interface IMessage {
    id?: number;
    senderId?: number;
    sender?: IUser;
    chatId?: number;
    chat?: IChat;
    content?: string;
    attachmentUrl?: string;
    sentAt?: Date;
}

export interface IUserStatus {
    id?: number;
    senderId?: number;
    sender: IUser;
    receiverId?: number;
    receiver: IUser;
    content: string;
    createAt: Date;
}