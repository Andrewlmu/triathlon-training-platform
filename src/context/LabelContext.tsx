"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { WorkoutLabel } from '@/types/workout';
import { useSession } from 'next-auth/react';

interface LabelContextType {
  labels: WorkoutLabel[];
  isLoading: boolean;
  addLabel: (label: Omit<WorkoutLabel, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<WorkoutLabel>;
  updateLabel: (id: string, label: Partial<WorkoutLabel>) => Promise<WorkoutLabel>;
  deleteLabel: (id: string) => Promise<boolean>;
  createDefaultLabels: () => Promise<void>;
  resetToDefaultLabels: () => Promise<void>;
}

const LabelContext = createContext<LabelContextType>({
  labels: [],
  isLoading: true,
  addLabel: async () => ({ id: '', name: '', color: '', userId: '' }),
  updateLabel: async () => ({ id: '', name: '', color: '', userId: '' }),
  deleteLabel: async () => false,
  createDefaultLabels: async () => { },
  resetToDefaultLabels: async () => { },
});

export const useLabels = () => useContext(LabelContext);

export const LabelProvider = ({ children }: { children: ReactNode }) => {
  const [labels, setLabels] = useState<WorkoutLabel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = useSession();

  // Fetch labels when session changes
  useEffect(() => {
    const fetchLabels = async () => {
      if (!session) {
        setLabels([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetch('/api/labels');

        if (!response.ok) {
          throw new Error('Failed to fetch labels');
        }

        const data = await response.json();
        setLabels(data);
      } catch (error) {
        console.error('Error fetching labels:', error);
        setLabels([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLabels();
  }, [session]);

  // Add a new label
  const addLabel = async (labelData: Omit<WorkoutLabel, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<WorkoutLabel> => {
    if (!session?.user?.id) {
      throw new Error('You must be logged in to add a label');
    }

    try {
      const response = await fetch('/api/labels', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(labelData),
      });

      if (!response.ok) {
        throw new Error('Failed to create label');
      }

      const newLabel = await response.json();
      setLabels(prev => [...prev, newLabel]);
      return newLabel;
    } catch (error) {
      console.error('Error adding label:', error);
      throw error;
    }
  };

  // Update a label
  const updateLabel = async (id: string, labelData: Partial<WorkoutLabel>): Promise<WorkoutLabel> => {
    if (!session?.user?.id) {
      throw new Error('You must be logged in to update a label');
    }

    try {
      const response = await fetch(`/api/labels/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(labelData),
      });

      if (!response.ok) {
        throw new Error('Failed to update label');
      }

      const updatedLabel = await response.json();
      setLabels(prev =>
        prev.map(label => label.id === id ? updatedLabel : label)
      );
      return updatedLabel;
    } catch (error) {
      console.error('Error updating label:', error);
      throw error;
    }
  };

  // Delete a label
  const deleteLabel = async (id: string): Promise<boolean> => {
    if (!session?.user?.id) {
      throw new Error('You must be logged in to delete a label');
    }

    try {
      const response = await fetch(`/api/labels/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete label');
      }

      setLabels(prev => prev.filter(label => label.id !== id));
      return true;
    } catch (error) {
      console.error('Error deleting label:', error);
      return false;
    }
  };

  // Create default labels for a new user
  const createDefaultLabels = async (): Promise<void> => {
    if (!session?.user?.id) return;
    
    try {
      setIsLoading(true);
      
      // First, fetch existing labels to check what we already have
      const response = await fetch('/api/labels');
      const existingLabels = await response.json() as WorkoutLabel[];
      
      // Create a map of existing label names to avoid duplicates
      const existingLabelNames = new Set(existingLabels.map((label: WorkoutLabel) => label.name));
      
      const defaultLabels = [
        { name: 'Recovery', color: '#9CA3AF' },     // Gray
        { name: 'Zone 2', color: '#3B82F6' },       // Blue
        { name: 'Tempo', color: '#10B981' },        // Green
        { name: 'Sweet Spot', color: '#84CC16' },   // Yellow-green
        { name: 'Threshold', color: '#FBBF24' },    // Yellow
        { name: 'VO2 Max', color: '#EF4444' },      // Red
        { name: 'Anaerobic', color: '#DC2626' },    // Darker red
        { name: 'Sprints', color: '#991B1B' },      // Darkest red
      ];
      
      const createdLabels: WorkoutLabel[] = [];
      for (const label of defaultLabels) {
        // Only create labels that don't already exist with the same name
        if (!existingLabelNames.has(label.name)) {
          const newLabel = await addLabel(label);
          createdLabels.push(newLabel);
        } else {
          // Find and include the existing label
          const existingLabel = existingLabels.find((l: WorkoutLabel) => l.name === label.name);
          if (existingLabel) createdLabels.push(existingLabel);
        }
      }
      
      setLabels([
        ...existingLabels, 
        ...createdLabels.filter((l: WorkoutLabel) => !existingLabelNames.has(l.name))
      ]);
    } catch (error) {
      console.error('Error creating default labels:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset to default labels
  const resetToDefaultLabels = async (): Promise<void> => {
    if (!session?.user?.id) {
      throw new Error('You must be logged in to reset labels');
    }

    try {
      setIsLoading(true);

      // Delete all existing labels
      const response = await fetch('/api/labels');
      const existingLabels = await response.json();

      // Delete each existing label
      for (const label of existingLabels) {
        await deleteLabel(label.id);
      }

      // Create default labels with expanded set
      const defaultLabels = [
        { name: 'Recovery', color: '#9CA3AF' },     // Gray
        { name: 'Zone 2', color: '#3B82F6' },       // Blue
        { name: 'Tempo', color: '#10B981' },        // Green
        { name: 'Sweet Spot', color: '#84CC16' },   // Yellow-green
        { name: 'Threshold', color: '#FBBF24' },    // Yellow
        { name: 'VO2 Max', color: '#EF4444' },      // Red
        { name: 'Anaerobic', color: '#DC2626' },    // Darker red
        { name: 'Sprints', color: '#991B1B' },      // Darkest red
      ];

      // Create each default label
      const newLabels = [];
      for (const label of defaultLabels) {
        const newLabel = await addLabel(label);
        newLabels.push(newLabel);
      }

      setLabels(newLabels);
    } catch (error) {
      console.error('Error resetting labels:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LabelContext.Provider value={{
      labels,
      isLoading,
      addLabel,
      updateLabel,
      deleteLabel,
      createDefaultLabels,
      resetToDefaultLabels
    }}>
      {children}
    </LabelContext.Provider>
  );
};