type RequestStatus = 'Pendente' | 'Recusado' | 'Aprovado';
type ScheduleStatus = 'Completo' | 'Incompleto';

export interface ClassroomRequestData {
    id: number;
    uc: string;
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
  
export interface Course {
    id: number;
    name: string;
    abbreviation: string;
    year: number;
    semester: number;
    degreeId: number;
}