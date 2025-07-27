import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface FeedbackData {
  id: string;
  studentId: string;
  studentName: string;
  rating: number;
  comment: string;
  timestamp: Date;
}

interface FeedbackContextType {
  feedbacks: FeedbackData[];
  hasFeedback: (studentId: string) => boolean;
  submitFeedback: (studentId: string, studentName: string, rating: number, comment: string) => void;
  getFeedbackByStudent: (studentId: string) => FeedbackData | undefined;
  getAllFeedbacks: () => FeedbackData[];
}

const FeedbackContext = createContext<FeedbackContextType | undefined>(undefined);

export const useFeedback = () => {
  const context = useContext(FeedbackContext);
  if (!context) {
    throw new Error('useFeedback must be used within a FeedbackProvider');
  }
  return context;
};

interface FeedbackProviderProps {
  children: ReactNode;
}

export const FeedbackProvider: React.FC<FeedbackProviderProps> = ({ children }) => {
  const [feedbacks, setFeedbacks] = useState<FeedbackData[]>([]);

  const hasFeedback = (studentId: string): boolean => {
    return feedbacks.some(feedback => feedback.studentId === studentId);
  };

  const submitFeedback = (studentId: string, studentName: string, rating: number, comment: string) => {
    const newFeedback: FeedbackData = {
      id: Date.now().toString(),
      studentId,
      studentName,
      rating,
      comment,
      timestamp: new Date()
    };

    setFeedbacks(prev => prev.filter(f => f.studentId !== studentId).concat(newFeedback));
  };

  const getFeedbackByStudent = (studentId: string): FeedbackData | undefined => {
    return feedbacks.find(feedback => feedback.studentId === studentId);
  };

  const getAllFeedbacks = (): FeedbackData[] => {
    return feedbacks.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  };

  return (
    <FeedbackContext.Provider value={{
      feedbacks,
      hasFeedback,
      submitFeedback,
      getFeedbackByStudent,
      getAllFeedbacks
    }}>
      {children}
    </FeedbackContext.Provider>
  );
};