import {Message, User} from "@prisma/client"


export type TUserWithChat = User & {
    conversation: TConversation[]
}


export type TConversation = {
    id: string,
    message: Message[];
    users: User[];
}