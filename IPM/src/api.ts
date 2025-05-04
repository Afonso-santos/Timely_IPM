import axios from 'axios'
import * as types from './types'

const API = axios.create({
  baseURL: 'http://localhost:3000',
  responseType: 'json',
  headers: {
    'Content-Type': 'application/json',
  },
})

const API_BASE = 'http://localhost:3000';

/** Get the schedules' visibility */
export async function getSchedulesVisibility(): Promise<boolean> {
  const response = await API.get('/schedule-visibility')
  return response.data.visibility
}

/** Update the schedules' visibility */
export async function updateSchedulesVisibility(visibility: boolean): Promise<void> {
  console.log('Updating schedules visibility to:', visibility)
  await API.put('/schedule-visibility', { visibility: visibility })
}

/**
 * Fetch all shift requests and return as a dictionary by ID
 */
export async function list_ShiftRequests(): Promise<types.ShiftRequestDataDict> {
  const response = await API.get<types.ShiftRequestData[]>('/shiftRequests')
  const data = response.data
  const dict: types.ShiftRequestDataDict = {}
  data.forEach((item) => {
    dict[item.id] = item
  })
  return dict
}

/**
 * Fetch all classroom requests and return as a dictionary by ID
 */
export async function list_ClassroomRequests(): Promise<types.ClassroomRequestDataDict> {
  const response = await API.get<types.ClassroomRequestData[]>('/classroomRequests')
  const data = response.data
  const dict: types.ClassroomRequestDataDict = {}
  data.forEach((item) => {
    dict[item.id] = item
  })
  return dict
}

/**
 * Fetch all students
 */
export async function listStudents(): Promise<types.Student[]> {
  const response = await API.get<types.Student[]>('/students')
  return response.data
}

/**
 * Fetch all courses
 */
export async function listCourses(): Promise<types.Course[]> {
  const response = await API.get<types.Course[]>('/courses')
  return response.data
}

/**
 * Fetch all shifts
 */
export const getShifts = async (): Promise<types.Shift[]> => {
  const response = await API.get<types.Shift[]>('/shifts');
  return response.data;
};

/**
 * Fetch all courses
 */
export const getCourses = async (): Promise<types.Course[]> => {
  const response = await API.get<types.Course[]>('/courses');
  return response.data;
};

/**
 * Fetch all allocations
 */
export const getAllocations = async (): Promise<types.Allocation[]> => {
  const response = await API.get<types.Allocation[]>('/allocations');
  return response.data;
};

/**
 * Fetch all shift requests
 */
export const getShiftRequests = async (): Promise<types.ShiftRequestData[]> => {
  const response = await API.get<types.ShiftRequestData[]>('/shiftRequests');
  return response.data;
};

/**
 * Fetch all classrooms
 */
export const getClassrooms = async (): Promise<types.Classroom[]> => {
  const response = await API.get<types.Classroom[]>('/classrooms');
  return response.data;
}

/**
 * Fetch request status statistics
 */
export async function listRequestStatusStatistics(): Promise<any> {
  const response = await API.get<types.ShiftRequestData[]>('/shiftRequests')
  const data = response.data

  let pending = 0
  let approved = 0
  let denied = 0

  for (const item of data) {
    if (item.response === 'Pendente') {
      pending++
    } else if (item.response === 'Aprovado') {
      approved++
    } else if (item.response === 'Recusado') {
      denied++
    }
  }

  const total = pending + approved + denied
  if (total > 0) {
    pending = Math.round((pending / total) * 100)
    approved = Math.round((approved / total) * 100)
    denied = Math.round((denied / total) * 100)
  }

  return { pending: pending, approved: approved, denied: denied }
}

/**
 * Fetch users with conflicts by year statistics
 */
export async function listUsersWithConflictsByYearStatistics(): Promise<any> {
  const response = await API.get<any>('/conflicts')
  const data = response.data
  let firstYearConflicts = 0
  let secondYearConflicts = 0
  let thirdYearConflicts = 0

  for (const item of data) {
    const studentId = item.studentId
    const student = await API.get<[types.Student]>(`/students?id=${studentId}`)
    const studentData = student.data[0]
    if (studentData.ano === 1) {
      firstYearConflicts++
    } else if (studentData.ano === 2) {
      secondYearConflicts++
    } else if (studentData.ano === 3) {
      thirdYearConflicts++
    }
  }

  return {
    firstYear: firstYearConflicts,
    secondYear: secondYearConflicts,
    thirdYear: thirdYearConflicts,
  }
}

/**
 * Fetch requests by year statistics
 */
export async function listRequestsByYearStatistics(): Promise<any> {
  const response = await API.get<types.ShiftRequestData[]>('/shiftRequests')
  const data = response.data

  let firstYearRequests = 0
  let secondYearRequests = 0
  let thirdYearRequests = 0

  for (const item of data) {
    const studentId = item.studentId
    const student = await API.get<[types.Student]>(`/students?id=${studentId}`)
    const studentData = student.data[0]
    if (studentData.ano === 1) {
      firstYearRequests++
    } else if (studentData.ano === 2) {
      secondYearRequests++
    } else if (studentData.ano === 3) {
      thirdYearRequests++
    }
  }

  return {
    firstYear: firstYearRequests,
    secondYear: secondYearRequests,
    thirdYear: thirdYearRequests,
  }
}

/**
 * Fetch students with incomplete schedules by year statistics
 */
export async function listStudentsWithIncompleteSchedulesByYearStatistics(): Promise<any> {
  const response = await API.get<types.Student[]>('/students')
  const data = response.data

  let firstYearStudents = 0
  let secondYearStudents = 0
  let thirdYearStudents = 0

  for (const student of data) {
    if (student.horario == 'Incompleto') {
      if (student.ano === 1) {
        firstYearStudents++
      } else if (student.ano === 2) {
        secondYearStudents++
      } else if (student.ano === 3) {
        thirdYearStudents++
      }
    }
  }

  return {
    firstYear: firstYearStudents,
    secondYear: secondYearStudents,
    thirdYear: thirdYearStudents,
  }
}

/**
 * Fetch the percentage of students with conflicts
 */
export async function getPercentageOfStudentsWithConflicts(): Promise<number> {
  const response = await API.get<any>('/conflicts')
  const data = response.data

  const totalStudentsResponse = await API.get<types.Student[]>('/students')
  const totalStudentsData = totalStudentsResponse.data

  let totalStudents = totalStudentsData.length
  let studentsWithConflicts = data.length / 2

  return Math.round((studentsWithConflicts / totalStudents) * 100)
}

export async function login(email: string, password: string) {
  try {
    const studentRes = (await API.get<types.Student[]>(`/students?email=${email}`)).data[0]
    if (studentRes?.password == password) {
      return {
        id: studentRes.id,
        name: studentRes.name,
        type: 'student',
        email: email,
      }
    }

    const directorRes = (await API.get<types.Director[]>(`/directors?email=${email}`)).data[0]
    if (directorRes?.password == password) {
      return {
        id: directorRes.id,
        name: directorRes.name,
        type: 'director',
        email: email,
      }
    }

    return false
  } catch (error) {
    return false
  }
}

// Atualizar resposta de pedido de troca (PUT)
export const updateShiftRequest = async (id: number, updatedRequest: Partial<types.ShiftRequestData>) => {
  await axios.patch(`${API_BASE}/shiftRequests/${id}`, updatedRequest);
};

// Atualizar alocação de aluno a turno
export const updateAllocation = async (id: number, updatedAllocation: Partial<types.Allocation>) => {
  await axios.patch(`${API_BASE}/allocations/${id}`, updatedAllocation);
};

// Criar nova alocação (caso necessário)
export const createAllocation = async (allocation: types.Allocation) => {
  await axios.post(`${API_BASE}/allocations`, allocation);
};

// Eliminar alocação (caso o aluno saia de um turno)
export const deleteAllocation = async (id: number) => {
  await axios.delete(`${API_BASE}/allocations/${id}`);
};

/**
 * Fetch all shifts for a specific student and return them in calendar format
 */
export async function getStudentShiftsCalendarFormatted(studentId: number): Promise<types.CalendarShift[]> {
  // Fetch all allocations, shifts, classrooms, and courses in parallel
  const [allocations, shifts, classrooms, courses, teachers] = await Promise.all([
    API.get<types.Allocation[]>('/allocations'),
    API.get<types.Shift[]>('/shifts'),
    API.get<types.Classroom[]>('/classrooms'),
    API.get<types.Course[]>('/courses'),
    API.get<types.Teacher[]>('/teachers'),
  ]);

  // Filter allocations for the given student
  const studentAllocations = allocations.data.filter(a => a.studentId === studentId);

  // Map allocation shiftIds to actual shift data
  const studentShifts = studentAllocations
    .map(a => shifts.data.find(s => s.id === a.shiftId))
    .filter((s): s is types.Shift => s !== undefined); // type narrowing

    // Convert to calendar format
    const calendarShifts: types.CalendarShift[] = studentShifts.map(shift => {
    const classroom = classrooms.data.find(c => c.id === shift.classroomId);
    const course = courses.data.find(c => c.id === shift.courseId);

    // Fetch teacher name
    const teacher = teachers.data.find(t => t.id == shift.teacherId);

    return {
      day: shift.day,
      from: shift.from,
      to: shift.to,
      name: `${course?.abbreviation ?? 'Unknown'} - ${shift.name}`,
      type: shift.type,
      classroomId: shift.classroomId,
      classroomName: "CP" + classroom?.buildingId + " - " + classroom?.name ?? 'Unknown',
      courseId: shift.courseId,
      shiftName: shift.name,
      teacher: teacher?.name ?? 'Unknown',
      fullName: `${course?.name ?? 'Unknown'}`,
    };
  });

  return calendarShifts;
}
