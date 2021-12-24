import { Socket } from 'socket.io';

export enum UserType
{
    GUEST = 'GUEST',
    USERNAME = 'USERNAME',
    NONE = 'NONE'
}

export interface UserInterface
{
    id: string;
    username: string;
    type: UserType
    socket?: Socket
}

export interface UserDTO
{
    id: string;
    username: string;
    type: UserType
}