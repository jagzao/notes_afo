/**
 * Properties Repository - CRUD operations for typed properties
 */

import type {
  PropertyDefinition,
  PropertyValue,
  CreatePropertyInput,
  UpdatePropertyInput,
  PropertyValueInput,
} from '@keep-plus-plus/types';
import { getDatabase } from '../db/database';
import { generateId, getDeviceId } from '../utils/id';

export class PropertiesRepository {
  /**
   * Create a new property definition for a note
   */
  async createDefinition(
    noteId: string,
    input: CreatePropertyInput
  ): Promise<PropertyDefinition> {
    const db = getDatabase();
    const now = new Date();

    // Check if property with same key already exists for this note
    const existing = await this.findDefinitionByKey(noteId, input.key);
    if (existing) {
      throw new Error(`Property with key "${input.key}" already exists for this note`);
    }

    // Get current max order for this note
    const existingProps = await this.findDefinitionsByNote(noteId);
    const maxOrder = existingProps.length > 0 ? Math.max(...existingProps.map((p) => p.order)) : -1;

    const property: PropertyDefinition = {
      id: generateId(),
      noteId,
      key: input.key.trim(),
      type: input.type,
      label: input.label.trim(),
      options: input.options,
      required: input.required || false,
      order: maxOrder + 1,
      createdAt: now,
      updatedAt: now,
    };

    await db.add('properties', property);
    return property;
  }

  /**
   * Get a property definition by ID
   */
  async findDefinitionById(id: string): Promise<PropertyDefinition | null> {
    const db = getDatabase();
    const property = await db.get('properties', id);
    return property || null;
  }

  /**
   * Get a property definition by key for a note
   */
  async findDefinitionByKey(noteId: string, key: string): Promise<PropertyDefinition | null> {
    const db = getDatabase();
    const tx = db.transaction('properties', 'readonly');
    const index = tx.store.index('by-note');
    const properties = await index.getAll(noteId);

    return properties.find((p) => p.key === key) || null;
  }

  /**
   * Get all property definitions for a note
   */
  async findDefinitionsByNote(noteId: string): Promise<PropertyDefinition[]> {
    const db = getDatabase();
    const tx = db.transaction('properties', 'readonly');
    const index = tx.store.index('by-note');

    const properties = await index.getAll(noteId);
    return properties.sort((a, b) => a.order - b.order);
  }

  /**
   * Update a property definition
   */
  async updateDefinition(id: string, input: UpdatePropertyInput): Promise<PropertyDefinition> {
    const db = getDatabase();
    const property = await this.findDefinitionById(id);

    if (!property) {
      throw new Error(`Property definition not found: ${id}`);
    }

    const updatedProperty: PropertyDefinition = {
      ...property,
      ...(input.label && { label: input.label.trim() }),
      ...(input.options !== undefined && { options: input.options }),
      ...(input.required !== undefined && { required: input.required }),
      updatedAt: new Date(),
    };

    await db.put('properties', updatedProperty);
    return updatedProperty;
  }

  /**
   * Delete a property definition and its values
   */
  async deleteDefinition(id: string): Promise<void> {
    const db = getDatabase();
    const property = await this.findDefinitionById(id);

    if (!property) {
      throw new Error(`Property definition not found: ${id}`);
    }

    // Delete all values for this property
    const values = await this.findValuesByKey(property.noteId, property.key);
    const tx = db.transaction(['properties', 'propertyValues'], 'readwrite');

    for (const value of values) {
      await tx.objectStore('propertyValues').delete(value.id);
    }

    await tx.objectStore('properties').delete(id);
    await tx.done;
  }

  /**
   * Reorder property definitions for a note
   */
  async reorderDefinitions(noteId: string, propertyIds: string[]): Promise<void> {
    const db = getDatabase();
    const properties = await this.findDefinitionsByNote(noteId);

    const tx = db.transaction('properties', 'readwrite');

    for (let i = 0; i < propertyIds.length; i++) {
      const property = properties.find((p) => p.id === propertyIds[i]);
      if (property) {
        property.order = i;
        property.updatedAt = new Date();
        await tx.store.put(property);
      }
    }

    await tx.done;
  }

  /**
   * Set a property value
   */
  async setValue(noteId: string, key: string, input: PropertyValueInput): Promise<PropertyValue> {
    const db = getDatabase();
    const now = new Date();

    // Check if property definition exists
    const definition = await this.findDefinitionByKey(noteId, key);
    if (!definition) {
      throw new Error(`Property definition not found for key "${key}"`);
    }

    // Validate type matches
    if (definition.type !== input.type) {
      throw new Error(`Property type mismatch: expected ${definition.type}, got ${input.type}`);
    }

    // Find existing value or create new
    const existingValue = await this.findValueByKey(noteId, key);
    const valueId = existingValue?.id || generateId();

    const propertyValue: PropertyValue = {
      id: valueId,
      noteId,
      key,
      valueText: undefined,
      valueNumber: undefined,
      valueDate: undefined,
      valueBool: undefined,
      valueSelect: undefined,
      valueUrl: undefined,
      updatedAt: now,
      deviceId: getDeviceId(),
    };

    // Set the appropriate value field based on type
    switch (input.type) {
      case 'text':
        propertyValue.valueText = input.value;
        break;
      case 'number':
        propertyValue.valueNumber = input.value;
        break;
      case 'date':
        propertyValue.valueDate = input.value;
        break;
      case 'checkbox':
        propertyValue.valueBool = input.value;
        break;
      case 'select':
        propertyValue.valueSelect = [input.value];
        break;
      case 'multiselect':
        propertyValue.valueSelect = input.value;
        break;
      case 'url':
        propertyValue.valueUrl = input.value;
        break;
    }

    await db.put('propertyValues', propertyValue);
    return propertyValue;
  }

  /**
   * Get a property value by key for a note
   */
  async findValueByKey(noteId: string, key: string): Promise<PropertyValue | null> {
    const db = getDatabase();
    const tx = db.transaction('propertyValues', 'readonly');
    const index = tx.store.index('by-note');
    const values = await index.getAll(noteId);

    return values.find((v) => v.key === key) || null;
  }

  /**
   * Get all property values for a note
   */
  async findValuesByNote(noteId: string): Promise<PropertyValue[]> {
    const db = getDatabase();
    const tx = db.transaction('propertyValues', 'readonly');
    const index = tx.store.index('by-note');

    return index.getAll(noteId);
  }

  /**
   * Get all property values by key (across all notes)
   */
  async findValuesByKey(noteId: string, key: string): Promise<PropertyValue[]> {
    const db = getDatabase();
    const tx = db.transaction('propertyValues', 'readonly');
    const index = tx.store.index('by-note');
    const values = await index.getAll(noteId);

    return values.filter((v) => v.key === key);
  }

  /**
   * Delete a property value
   */
  async deleteValue(noteId: string, key: string): Promise<void> {
    const db = getDatabase();
    const value = await this.findValueByKey(noteId, key);

    if (value) {
      await db.delete('propertyValues', value.id);
    }
  }

  /**
   * Delete all properties for a note (when note is deleted)
   */
  async deleteAllForNote(noteId: string): Promise<void> {
    const db = getDatabase();
    const definitions = await this.findDefinitionsByNote(noteId);
    const values = await this.findValuesByNote(noteId);

    const tx = db.transaction(['properties', 'propertyValues'], 'readwrite');

    for (const definition of definitions) {
      await tx.objectStore('properties').delete(definition.id);
    }

    for (const value of values) {
      await tx.objectStore('propertyValues').delete(value.id);
    }

    await tx.done;
  }

  /**
   * Get property with its value
   */
  async findPropertyWithValue(
    noteId: string,
    key: string
  ): Promise<{ definition: PropertyDefinition; value: PropertyValue | null } | null> {
    const definition = await this.findDefinitionByKey(noteId, key);
    if (!definition) {
      return null;
    }

    const value = await this.findValueByKey(noteId, key);
    return { definition, value };
  }

  /**
   * Get all properties with their values for a note
   */
  async findAllPropertiesWithValues(
    noteId: string
  ): Promise<Array<{ definition: PropertyDefinition; value: PropertyValue | null }>> {
    const definitions = await this.findDefinitionsByNote(noteId);
    const values = await this.findValuesByNote(noteId);

    return definitions.map((definition) => ({
      definition,
      value: values.find((v) => v.key === definition.key) || null,
    }));
  }
}

// Export singleton instance
export const propertiesRepository = new PropertiesRepository();
