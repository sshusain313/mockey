'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Mockup, MockupPlaceholder, sampleMockups } from '@/lib/mockup-utils';

// Define the context state type
interface MockupContextType {
  mockups: Mockup[];
  selectedMockup: Mockup | null;
  userImage: string | null;
  isAdmin: boolean;
  setMockups: (mockups: Mockup[]) => void;
  setSelectedMockup: (mockup: Mockup | null) => void;
  setUserImage: (image: string | null) => void;
  toggleAdminMode: () => void;
  addMockup: (mockup: Omit<Mockup, "id">) => void;
}

// Create the context with a default value
const MockupContext = createContext<MockupContextType | undefined>(undefined);

// Create a provider component
export const MockupProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [mockups, setMockups] = useState<Mockup[]>(sampleMockups);
  const [selectedMockup, setSelectedMockup] = useState<Mockup | null>(null);
  const [userImage, setUserImage] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // Function to toggle between admin and user modes
  const toggleAdminMode = () => {
    setIsAdmin(!isAdmin);
  };

  // Function to add a new mockup
  const addMockup = (mockup: Omit<Mockup, "id">) => {
    const newMockup: Mockup = {
      ...mockup,
      id: `mockup-${Date.now()}`,
    };
    setMockups([...mockups, newMockup]);
  };

  return (
    <MockupContext.Provider
      value={{
        mockups,
        selectedMockup,
        userImage,
        isAdmin,
        setMockups,
        setSelectedMockup,
        setUserImage,
        toggleAdminMode,
        addMockup
      }}
    >
      {children}
    </MockupContext.Provider>
  );
};


// Create a custom hook for using this context
export const useMockup = () => {
  const context = useContext(MockupContext);
  if (context === undefined) {
    throw new Error('useMockup must be used within a MockupProvider');
  }
  return context;
};
