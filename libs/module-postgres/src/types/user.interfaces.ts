export interface User {
  id: string;
  name: string;
  surname: string;
  age: number;
}

export interface CreateUserResult {
  result: User[];
  message: string;
}

export interface UpdateUserResult {
  result: User[];
  message: string;
}

export interface DeleteUserResult {
  result: User[];
  message: string;
}
