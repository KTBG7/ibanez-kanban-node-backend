export type SubtaskType = {
    title: string;
    isCompleted: boolean;
};

export type TaskType = {
    title: string;
    description: string;
    status: string;
    subtasks: Array<SubtaskType>;
};

export type ColumnType = {
    name: string;
    tasks: Array<TaskType>;
};

export type BoardType = {
    name: string;
    columns: Array<ColumnType>,
};

export type UserType = {
    username: string,
    password: string,
    boards: Array<BoardType>,
}