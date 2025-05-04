type RequestStatus = 'Pendente' | 'Recusado' | 'Aprovado';
type ScheduleStatus = 'Completo' | 'Incompleto';

export interface ClassroomRequestData {
    id: number;
    uc: string;
    shift: string;
    shiftsize: number;
    classroomId: number;
    classroom: string;
    teacherId: number;
    nome: string;
    date: string;
    response: RequestStatus;
    alternativeclassroomId: number;
    alternativeclassroom: string;
    archive: boolean;
}

export interface ShiftRequestDataDict {
    [key: number]: ShiftRequestData
}

export interface ShiftRequestData {
    id: number;
    uc: string;
    shiftId: number;
    shift: string;
    studentId: number;
    nome: string;
    date: string;
    response: RequestStatus;
    alternativeShiftId: number;
    alternativeShift: string;
    archive: boolean;
}

export interface ClassroomRequestDataDict {
    [key: number]: ClassroomRequestData
}

export interface Student {
    id: number;
    name: string;
    email: string;
    password: string;
    specialStatus?: boolean;
    enrolled: number[];
    horario: ScheduleStatus;
    ano: number;
    numMat: number;
    data: string;
}
 
export interface Director {
    id: string;
    name: string;
    email: string;
    password: string;
}

export interface Course {
    id: number;
    name: string;
    abbreviation: string;
    year: number;
    semester: number;
    degreeId: number;
}

export interface Course {
    id: number;
    name: string;
    abbreviation: string;
    year: number;
    semester: number;
    degreeId: number;
}
  
export interface Shift {
    id: number;
    courseId: number;
    classroomId: number;
    day: string;
    from: number;
    to: number;
    type: string;
    name: string;
    teacherId: number;
    totalStudentsRegistered: number;
}

export interface Allocation {
    id: number;
    shiftId: number;
    studentId: number;
}

export interface Classroom {
    id: number;
    name: string;
    capacity: number;
    buildingId: number;
    abbreviation: string;
}
export interface CalendarShift {
    day: string;
    from: string;
    to: string;
    name: string;
    type: string;
    classroomId: number;
    classroomName: string;
    courseId: number;
    shiftName: string;
    teacher: string;
    fullName: string;
}

export interface Teacher {
    id: number;
    name: string;
    email: string;
    password: string;
}