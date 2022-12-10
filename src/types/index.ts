export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  type: 'teacher' | 'student';
}

export interface CreateClassroomFormData {
  name: string;
}

export interface JoinClassroomFormData {
  code: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  type: 'teacher' | 'student';
}

export interface Classroom {
  id: string;
  name: string;
  code: string;
  timestamp: Date;
  teacher: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

export interface Enroll {
  id: string;
  classroomId: string;
  timestamp: string;
  student: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

export * from './task';
export * from './game';
export * from './submissions';
