import { Socket } from 'socket.io';

export interface UserInterface
{
    id: string;
    username: string;
    socket?: Socket
}