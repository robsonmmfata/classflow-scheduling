import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useAuth } from './AuthContext';

export interface PackageLimitation {
  packageType: 'trial' | 'package4' | 'package8' | 'monthly';
  totalLessons: number;
  usedLessons: number;
  lessonDuration: number; // em minutos
  expiryDate?: Date;
  active: boolean;
}

interface PackageLimitationContextType {
  userPackages: PackageLimitation[];
  addPackage: (packageType: PackageLimitation['packageType']) => void;
  useLesson: (packageType: PackageLimitation['packageType'], duration: number) => boolean;
  canBookLesson: (packageType: PackageLimitation['packageType'], duration: number) => boolean;
  getRemainingLessons: (packageType: PackageLimitation['packageType']) => number;
  hasActivePackage: (packageType: PackageLimitation['packageType']) => boolean;
  getAvailablePackages: () => PackageLimitation[];
}

const PackageLimitationContext = createContext<PackageLimitationContextType | undefined>(undefined);

export const usePackageLimitation = () => {
  const context = useContext(PackageLimitationContext);
  if (!context) {
    throw new Error('usePackageLimitation must be used within a PackageLimitationProvider');
  }
  return context;
};

interface PackageLimitationProviderProps {
  children: ReactNode;
}

export const PackageLimitationProvider: React.FC<PackageLimitationProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [userPackages, setUserPackages] = useState<PackageLimitation[]>([]);

  // Load user packages from localStorage or API
  useEffect(() => {
    if (user) {
      const savedPackages = localStorage.getItem(`packages_${user.id}`);
      if (savedPackages) {
        const packages = JSON.parse(savedPackages).map((pkg: any) => ({
          ...pkg,
          expiryDate: pkg.expiryDate ? new Date(pkg.expiryDate) : undefined
        }));
        setUserPackages(packages);
      }
    }
  }, [user]);

  // Save packages to localStorage
  const savePackages = (packages: PackageLimitation[]) => {
    if (user) {
      localStorage.setItem(`packages_${user.id}`, JSON.stringify(packages));
      setUserPackages(packages);
    }
  };

  const getPackageConfig = (packageType: PackageLimitation['packageType']): Omit<PackageLimitation, 'usedLessons' | 'active'> => {
    const configs = {
      trial: {
        packageType: 'trial' as const,
        totalLessons: 1,
        lessonDuration: 25,
      },
      package4: {
        packageType: 'package4' as const,
        totalLessons: 4,
        lessonDuration: 50,
      },
      package8: {
        packageType: 'package8' as const,
        totalLessons: 8,
        lessonDuration: 50,
      },
      monthly: {
        packageType: 'monthly' as const,
        totalLessons: 12,
        lessonDuration: 50,
        expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
      },
    };
    
    return configs[packageType];
  };

  const addPackage = (packageType: PackageLimitation['packageType']) => {
    const config = getPackageConfig(packageType);
    const newPackage: PackageLimitation = {
      ...config,
      usedLessons: 0,
      active: true,
    };

    const updatedPackages = [...userPackages];
    const existingIndex = updatedPackages.findIndex(pkg => pkg.packageType === packageType && pkg.active);
    
    if (existingIndex >= 0) {
      // Update existing package
      updatedPackages[existingIndex] = {
        ...updatedPackages[existingIndex],
        totalLessons: updatedPackages[existingIndex].totalLessons + newPackage.totalLessons,
      };
    } else {
      // Add new package
      updatedPackages.push(newPackage);
    }

    savePackages(updatedPackages);
  };

  const useLesson = (packageType: PackageLimitation['packageType'], duration: number): boolean => {
    const packageIndex = userPackages.findIndex(
      pkg => pkg.packageType === packageType && pkg.active
    );

    if (packageIndex === -1) return false;

    const pkg = userPackages[packageIndex];
    
    // Check if duration exceeds package limit
    if (duration > pkg.lessonDuration) return false;
    
    // Check if package has remaining lessons
    if (pkg.usedLessons >= pkg.totalLessons) return false;

    // Check expiry date
    if (pkg.expiryDate && new Date() > pkg.expiryDate) return false;

    // Use lesson
    const updatedPackages = [...userPackages];
    updatedPackages[packageIndex] = {
      ...pkg,
      usedLessons: pkg.usedLessons + 1,
      active: pkg.usedLessons + 1 < pkg.totalLessons
    };

    savePackages(updatedPackages);
    return true;
  };

  const canBookLesson = (packageType: PackageLimitation['packageType'], duration: number): boolean => {
    const pkg = userPackages.find(p => p.packageType === packageType && p.active);
    if (!pkg) return false;

    // Check duration limit
    if (duration > pkg.lessonDuration) return false;

    // Check remaining lessons
    if (pkg.usedLessons >= pkg.totalLessons) return false;

    // Check expiry date
    if (pkg.expiryDate && new Date() > pkg.expiryDate) return false;

    return true;
  };

  const getRemainingLessons = (packageType: PackageLimitation['packageType']): number => {
    const pkg = userPackages.find(p => p.packageType === packageType && p.active);
    return pkg ? pkg.totalLessons - pkg.usedLessons : 0;
  };

  const hasActivePackage = (packageType: PackageLimitation['packageType']): boolean => {
    return userPackages.some(pkg => 
      pkg.packageType === packageType && 
      pkg.active && 
      pkg.usedLessons < pkg.totalLessons &&
      (!pkg.expiryDate || new Date() <= pkg.expiryDate)
    );
  };

  const getAvailablePackages = (): PackageLimitation[] => {
    return userPackages.filter(pkg => 
      pkg.active && 
      pkg.usedLessons < pkg.totalLessons &&
      (!pkg.expiryDate || new Date() <= pkg.expiryDate)
    );
  };

  return (
    <PackageLimitationContext.Provider value={{
      userPackages,
      addPackage,
      useLesson,
      canBookLesson,
      getRemainingLessons,
      hasActivePackage,
      getAvailablePackages
    }}>
      {children}
    </PackageLimitationContext.Provider>
  );
};