import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

export interface Student {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone: string | null;
  custom_price_per_lesson: number | null;
  remaining_lessons: number;
  total_lessons_purchased: number;
  registration_date: string;
  notes: string | null;
  status: 'active' | 'inactive' | 'suspended';
  created_at: string;
  updated_at: string;
}

export interface Lesson {
  id: string;
  student_id: string;
  teacher_id: string;
  scheduled_date: string;
  scheduled_time: string;
  duration_minutes: number;
  price_paid: number | null;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
  notes: string | null;
  meeting_link: string | null;
  created_at: string;
  updated_at: string;
  student?: Student;
}

interface StudentsContextType {
  students: Student[];
  lessons: Lesson[];
  currentStudent: Student | null;
  addStudent: (studentData: Omit<Student, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateStudent: (id: string, studentData: Partial<Student>) => Promise<void>;
  updateStudentPrice: (id: string, price: number) => Promise<void>;
  scheduleLesson: (lessonData: Omit<Lesson, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateLessonStatus: (id: string, status: Lesson['status']) => Promise<void>;
  getStudentLessons: (studentId: string) => Lesson[];
  isLoading: boolean;
  refreshData: () => Promise<void>;
}

const StudentsContext = createContext<StudentsContextType | undefined>(undefined);

export const useStudents = () => {
  const context = useContext(StudentsContext);
  if (!context) {
    throw new Error('useStudents must be used within a StudentsProvider');
  }
  return context;
};

interface StudentsProviderProps {
  children: ReactNode;
}

export const StudentsProvider: React.FC<StudentsProviderProps> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, profile } = useAuth();

  // Get current student if user is a student
  const currentStudent = profile?.role === 'student' ? 
    students.find(s => s.user_id === user?.id) || null : null;

  const fetchStudents = async () => {
    if (!user) return;

    try {
      let query = supabase.from('students').select('*');
      
      // If user is a student, only fetch their own data
      if (profile?.role === 'student') {
        query = query.eq('user_id', user.id);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching students:', error);
        return;
      }

      setStudents((data || []) as Student[]);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchLessons = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('lessons')
        .select(`
          *,
          student:students(*)
        `)
        .order('scheduled_date', { ascending: false })
        .order('scheduled_time', { ascending: false });

      if (error) {
        console.error('Error fetching lessons:', error);
        return;
      }

      setLessons((data || []) as Lesson[]);
    } catch (error) {
      console.error('Error fetching lessons:', error);
    }
  };

  const refreshData = async () => {
    setIsLoading(true);
    await Promise.all([fetchStudents(), fetchLessons()]);
    setIsLoading(false);
  };

  useEffect(() => {
    if (user && profile) {
      refreshData();
    }
  }, [user, profile]);

  const addStudent = async (studentData: Omit<Student, 'id' | 'created_at' | 'updated_at'>): Promise<void> => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('students')
        .insert(studentData);

      if (error) {
        console.error('Error adding student:', error);
        toast.error('Erro ao adicionar aluno');
        return;
      }

      toast.success('Aluno adicionado com sucesso!');
      await fetchStudents();
    } catch (error) {
      console.error('Error adding student:', error);
      toast.error('Erro ao adicionar aluno');
    }
  };

  const updateStudent = async (id: string, studentData: Partial<Student>): Promise<void> => {
    try {
      const { error } = await supabase
        .from('students')
        .update(studentData)
        .eq('id', id);

      if (error) {
        console.error('Error updating student:', error);
        toast.error('Erro ao atualizar aluno');
        return;
      }

      toast.success('Aluno atualizado com sucesso!');
      await fetchStudents();
    } catch (error) {
      console.error('Error updating student:', error);
      toast.error('Erro ao atualizar aluno');
    }
  };

  const updateStudentPrice = async (id: string, price: number): Promise<void> => {
    try {
      const { error } = await supabase
        .from('students')
        .update({ custom_price_per_lesson: price })
        .eq('id', id);

      if (error) {
        console.error('Error updating student price:', error);
        toast.error('Erro ao atualizar preço do aluno');
        return;
      }

      toast.success('Preço personalizado atualizado!');
      await fetchStudents();
    } catch (error) {
      console.error('Error updating student price:', error);
      toast.error('Erro ao atualizar preço do aluno');
    }
  };

  const scheduleLesson = async (lessonData: Omit<Lesson, 'id' | 'created_at' | 'updated_at'>): Promise<void> => {
    try {
      const { error } = await supabase
        .from('lessons')
        .insert(lessonData);

      if (error) {
        console.error('Error scheduling lesson:', error);
        toast.error('Erro ao agendar aula');
        return;
      }

      toast.success('Aula agendada com sucesso!');
      await fetchLessons();
    } catch (error) {
      console.error('Error scheduling lesson:', error);
      toast.error('Erro ao agendar aula');
    }
  };

  const updateLessonStatus = async (id: string, status: Lesson['status']): Promise<void> => {
    try {
      const { error } = await supabase
        .from('lessons')
        .update({ status })
        .eq('id', id);

      if (error) {
        console.error('Error updating lesson status:', error);
        toast.error('Erro ao atualizar status da aula');
        return;
      }

      toast.success('Status da aula atualizado!');
      await fetchLessons();
    } catch (error) {
      console.error('Error updating lesson status:', error);
      toast.error('Erro ao atualizar status da aula');
    }
  };

  const getStudentLessons = (studentId: string): Lesson[] => {
    return lessons.filter(lesson => lesson.student_id === studentId);
  };

  return (
    <StudentsContext.Provider value={{
      students,
      lessons,
      currentStudent,
      addStudent,
      updateStudent,
      updateStudentPrice,
      scheduleLesson,
      updateLessonStatus,
      getStudentLessons,
      isLoading,
      refreshData
    }}>
      {children}
    </StudentsContext.Provider>
  );
};