import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface TimeSlot {
  id: string;
  time: string;
  date: string;
  available: boolean;
  type: 'available' | 'booked' | 'blocked' | 'trial';
  student?: string;
  studentEmail?: string;
  duration: number; // em minutos
  price?: number;
  whatsapp?: string;
}

export interface ScheduleSettings {
  prices: {
    trial: number;
    package4: number;
    package8: number;
    quarterly: number;
  };
  workingHours: {
    start: string;
    end: string;
  };
  whatsappNumber: string;
}

interface ScheduleContextType {
  timeSlots: TimeSlot[];
  scheduleSettings: ScheduleSettings;
  addTimeSlot: (slot: Omit<TimeSlot, 'id'>) => void;
  updateTimeSlot: (id: string, updates: Partial<TimeSlot>) => void;
  removeTimeSlot: (id: string) => void;
  bookSlot: (id: string, studentInfo: { name: string; email: string }) => void;
  cancelBooking: (id: string) => void;
  blockSlot: (id: string) => void;
  unblockSlot: (id: string) => void;
  updateSettings: (settings: Partial<ScheduleSettings>) => void;
  getAvailableSlots: (date?: string) => TimeSlot[];
  getStudentBookings: (studentEmail: string) => TimeSlot[];
}

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

export const useSchedule = () => {
  const context = useContext(ScheduleContext);
  if (!context) {
    throw new Error('useSchedule must be used within a ScheduleProvider');
  }
  return context;
};

interface ScheduleProviderProps {
  children: ReactNode;
}

export const ScheduleProvider: React.FC<ScheduleProviderProps> = ({ children }) => {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([
    {
      id: '1',
      time: '08:00',
      date: '2025-07-27',
      available: true,
      type: 'available',
      duration: 50
    },
    {
      id: '2',
      time: '09:00',
      date: '2025-07-27',
      available: false,
      type: 'booked',
      student: 'Maria Silva',
      studentEmail: 'aluno@teste.com',
      duration: 50,
      whatsapp: '+5511999999999'
    },
    {
      id: '3',
      time: '10:00',
      date: '2025-07-27',
      available: true,
      type: 'trial',
      duration: 25
    },
    {
      id: '4',
      time: '11:00',
      date: '2025-07-27',
      available: true,
      type: 'available',
      duration: 50
    },
    {
      id: '5',
      time: '14:00',
      date: '2025-07-27',
      available: true,
      type: 'available',
      duration: 50
    },
    {
      id: '6',
      time: '15:00',
      date: '2025-07-27',
      available: true,
      type: 'available',
      duration: 50
    },
    {
      id: '7',
      time: '16:00',
      date: '2025-07-27',
      available: false,
      type: 'blocked',
      duration: 50
    },
    {
      id: '8',
      time: '17:00',
      date: '2025-07-27',
      available: true,
      type: 'available',
      duration: 50
    },
    {
      id: '9',
      time: '18:00',
      date: '2025-07-27',
      available: false,
      type: 'booked',
      student: 'João Santos',
      studentEmail: 'aluno@teste.com',
      duration: 50,
      whatsapp: '+5511999999999'
    }
  ]);

  const [scheduleSettings, setScheduleSettings] = useState<ScheduleSettings>({
    prices: {
      trial: 5,
      package4: 15,
      package8: 13,
      quarterly: 12
    },
    workingHours: {
      start: '08:00',
      end: '19:00'
    },
    whatsappNumber: '+5511999999999'
  });

  const addTimeSlot = (slot: Omit<TimeSlot, 'id'>) => {
    const newSlot: TimeSlot = {
      ...slot,
      id: Date.now().toString()
    };
    setTimeSlots(prev => [...prev, newSlot]);
  };

  const updateTimeSlot = (id: string, updates: Partial<TimeSlot>) => {
    setTimeSlots(prev => prev.map(slot => 
      slot.id === id ? { ...slot, ...updates } : slot
    ));
  };

  const removeTimeSlot = (id: string) => {
    setTimeSlots(prev => prev.filter(slot => slot.id !== id));
  };

  const bookSlot = (id: string, studentInfo: { name: string; email: string }) => {
    updateTimeSlot(id, {
      available: false,
      type: 'booked',
      student: studentInfo.name,
      studentEmail: studentInfo.email,
      whatsapp: scheduleSettings.whatsappNumber
    });
  };

  const cancelBooking = (id: string) => {
    updateTimeSlot(id, {
      available: true,
      type: 'available',
      student: undefined,
      studentEmail: undefined,
      whatsapp: undefined
    });
  };

  const blockSlot = (id: string) => {
    updateTimeSlot(id, {
      available: false,
      type: 'blocked',
      student: undefined,
      studentEmail: undefined
    });
  };

  const unblockSlot = (id: string) => {
    updateTimeSlot(id, {
      available: true,
      type: 'available'
    });
  };

  const updateSettings = (settings: Partial<ScheduleSettings>) => {
    setScheduleSettings(prev => ({ ...prev, ...settings }));
  };

  const getAvailableSlots = (date?: string) => {
    return timeSlots.filter(slot => 
      slot.available && 
      (!date || slot.date === date)
    );
  };

  const getStudentBookings = (studentEmail: string) => {
    return timeSlots.filter(slot => 
      slot.studentEmail === studentEmail && 
      slot.type === 'booked'
    );
  };

  return (
    <ScheduleContext.Provider value={{
      timeSlots,
      scheduleSettings,
      addTimeSlot,
      updateTimeSlot,
      removeTimeSlot,
      bookSlot,
      cancelBooking,
      blockSlot,
      unblockSlot,
      updateSettings,
      getAvailableSlots,
      getStudentBookings
    }}>
      {children}
    </ScheduleContext.Provider>
  );
};