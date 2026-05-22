export type User = {
    tgId: number;
    token: string;
    createdAt: Date;
    updatedAt: Date;
}

export type TaskResponseDto = {
    id: number
    title: string
    description: string
    deadline: Date | null
    authorId: number
    state: string
}