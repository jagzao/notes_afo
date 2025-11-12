import React, { createContext, useContext, useCallback } from 'react';
import type {
  PropertyDefinition,
  PropertyValue,
  CreatePropertyInput,
  UpdatePropertyInput,
  PropertyValueInput,
} from '@keep-plus-plus/types';
import { propertiesRepository } from '@keep-plus-plus/storage';

interface PropertiesContextValue {
  // Property Definition operations
  createProperty: (noteId: string, input: CreatePropertyInput) => Promise<PropertyDefinition>;
  updateProperty: (id: string, input: UpdatePropertyInput) => Promise<PropertyDefinition>;
  deleteProperty: (id: string) => Promise<void>;
  getPropertiesForNote: (noteId: string) => Promise<PropertyDefinition[]>;
  reorderProperties: (noteId: string, propertyIds: string[]) => Promise<void>;
  // Property Value operations
  setPropertyValue: (noteId: string, key: string, input: PropertyValueInput) => Promise<PropertyValue>;
  deletePropertyValue: (noteId: string, key: string) => Promise<void>;
  // Combined operations
  getPropertiesWithValues: (
    noteId: string
  ) => Promise<Array<{ definition: PropertyDefinition; value: PropertyValue | null }>>;
}

const PropertiesContext = createContext<PropertiesContextValue | undefined>(undefined);

export const PropertiesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const createProperty = useCallback(
    async (noteId: string, input: CreatePropertyInput): Promise<PropertyDefinition> => {
      try {
        const property = await propertiesRepository.createDefinition(noteId, input);
        return property;
      } catch (err) {
        console.error('Failed to create property:', err);
        throw err;
      }
    },
    []
  );

  const updateProperty = useCallback(
    async (id: string, input: UpdatePropertyInput): Promise<PropertyDefinition> => {
      try {
        const property = await propertiesRepository.updateDefinition(id, input);
        return property;
      } catch (err) {
        console.error('Failed to update property:', err);
        throw err;
      }
    },
    []
  );

  const deleteProperty = useCallback(async (id: string): Promise<void> => {
    try {
      await propertiesRepository.deleteDefinition(id);
    } catch (err) {
      console.error('Failed to delete property:', err);
      throw err;
    }
  }, []);

  const getPropertiesForNote = useCallback(async (noteId: string): Promise<PropertyDefinition[]> => {
    try {
      return await propertiesRepository.findDefinitionsByNote(noteId);
    } catch (err) {
      console.error('Failed to get properties for note:', err);
      throw err;
    }
  }, []);

  const reorderProperties = useCallback(
    async (noteId: string, propertyIds: string[]): Promise<void> => {
      try {
        await propertiesRepository.reorderDefinitions(noteId, propertyIds);
      } catch (err) {
        console.error('Failed to reorder properties:', err);
        throw err;
      }
    },
    []
  );

  const setPropertyValue = useCallback(
    async (noteId: string, key: string, input: PropertyValueInput): Promise<PropertyValue> => {
      try {
        return await propertiesRepository.setValue(noteId, key, input);
      } catch (err) {
        console.error('Failed to set property value:', err);
        throw err;
      }
    },
    []
  );

  const deletePropertyValue = useCallback(async (noteId: string, key: string): Promise<void> => {
    try {
      await propertiesRepository.deleteValue(noteId, key);
    } catch (err) {
      console.error('Failed to delete property value:', err);
      throw err;
    }
  }, []);

  const getPropertiesWithValues = useCallback(
    async (
      noteId: string
    ): Promise<Array<{ definition: PropertyDefinition; value: PropertyValue | null }>> => {
      try {
        return await propertiesRepository.findAllPropertiesWithValues(noteId);
      } catch (err) {
        console.error('Failed to get properties with values:', err);
        throw err;
      }
    },
    []
  );

  const value: PropertiesContextValue = {
    createProperty,
    updateProperty,
    deleteProperty,
    getPropertiesForNote,
    reorderProperties,
    setPropertyValue,
    deletePropertyValue,
    getPropertiesWithValues,
  };

  return <PropertiesContext.Provider value={value}>{children}</PropertiesContext.Provider>;
};

export const useProperties = (): PropertiesContextValue => {
  const context = useContext(PropertiesContext);
  if (!context) {
    throw new Error('useProperties must be used within PropertiesProvider');
  }
  return context;
};
