import React, { useState, useEffect } from 'react';
import type { PropertyDefinition, PropertyValue, PropertyValueInput } from '@keep-plus-plus/types';
import { useProperties } from '../../context/PropertiesContext';
import styles from './PropertyField.module.css';

interface PropertyFieldProps {
  noteId: string;
  definition: PropertyDefinition;
  value: PropertyValue | null;
  onEdit?: (property: PropertyDefinition) => void;
  onDelete?: (propertyId: string) => void;
}

export const PropertyField: React.FC<PropertyFieldProps> = ({
  noteId,
  definition,
  value,
  onEdit,
  onDelete,
}) => {
  const { setPropertyValue } = useProperties();

  const handleChange = async (input: PropertyValueInput) => {
    try {
      await setPropertyValue(noteId, definition.key, input);
    } catch (error) {
      console.error('Failed to set property value:', error);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(definition.id);
    }
  };

  const renderField = () => {
    switch (definition.type) {
      case 'text':
        return (
          <TextPropertyField
            value={value?.valueText || ''}
            onChange={(v) => handleChange({ type: 'text', value: v })}
          />
        );

      case 'number':
        return (
          <NumberPropertyField
            value={value?.valueNumber}
            onChange={(v) => handleChange({ type: 'number', value: v })}
          />
        );

      case 'date':
        return (
          <DatePropertyField
            value={value?.valueDate}
            onChange={(v) => handleChange({ type: 'date', value: v })}
          />
        );

      case 'checkbox':
        return (
          <CheckboxPropertyField
            value={value?.valueBool || false}
            onChange={(v) => handleChange({ type: 'checkbox', value: v })}
          />
        );

      case 'select':
        return (
          <SelectPropertyField
            options={definition.options || []}
            value={value?.valueSelect?.[0] || ''}
            onChange={(v) => handleChange({ type: 'select', value: v })}
          />
        );

      case 'multiselect':
        return (
          <MultiSelectPropertyField
            options={definition.options || []}
            value={value?.valueSelect || []}
            onChange={(v) => handleChange({ type: 'multiselect', value: v })}
          />
        );

      case 'url':
        return (
          <UrlPropertyField
            value={value?.valueUrl || ''}
            onChange={(v) => handleChange({ type: 'url', value: v })}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className={styles.propertyField}>
      <div className={styles.propertyHeader}>
        <label className={styles.propertyLabel}>
          {definition.label}
          {definition.required && <span className={styles.required}>*</span>}
        </label>
        <div className={styles.propertyActions}>
          {onEdit && (
            <button
              className={styles.editButton}
              onClick={() => onEdit(definition)}
              type="button"
              aria-label="Edit property"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
          )}
          {onDelete && (
            <button
              className={styles.deleteButton}
              onClick={handleDelete}
              type="button"
              aria-label="Delete property"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
      {renderField()}
    </div>
  );
};

// Text Property Field
const TextPropertyField: React.FC<{
  value: string;
  onChange: (value: string) => void;
}> = ({ value, onChange }) => {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleBlur = () => {
    if (localValue !== value) {
      onChange(localValue);
    }
  };

  return (
    <input
      type="text"
      className={styles.input}
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      onBlur={handleBlur}
      placeholder="Enter text..."
    />
  );
};

// Number Property Field
const NumberPropertyField: React.FC<{
  value: number | undefined;
  onChange: (value: number) => void;
}> = ({ value, onChange }) => {
  const [localValue, setLocalValue] = useState(value?.toString() || '');

  useEffect(() => {
    setLocalValue(value?.toString() || '');
  }, [value]);

  const handleBlur = () => {
    const numValue = parseFloat(localValue);
    if (!isNaN(numValue) && numValue !== value) {
      onChange(numValue);
    }
  };

  return (
    <input
      type="number"
      className={styles.input}
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      onBlur={handleBlur}
      placeholder="Enter number..."
    />
  );
};

// Date Property Field
const DatePropertyField: React.FC<{
  value: Date | undefined;
  onChange: (value: Date) => void;
}> = ({ value, onChange }) => {
  const formatDateForInput = (date: Date | undefined): string => {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0] as string;
  };

  const [localValue, setLocalValue] = useState(formatDateForInput(value));

  useEffect(() => {
    setLocalValue(formatDateForInput(value));
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    if (newValue) {
      onChange(new Date(newValue));
    }
  };

  return <input type="date" className={styles.input} value={localValue} onChange={handleChange} />;
};

// Checkbox Property Field
const CheckboxPropertyField: React.FC<{
  value: boolean;
  onChange: (value: boolean) => void;
}> = ({ value, onChange }) => {
  return (
    <div className={styles.checkboxContainer}>
      <input
        type="checkbox"
        className={styles.checkbox}
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className={styles.propertyLabel}>{value ? 'Yes' : 'No'}</span>
    </div>
  );
};

// Select Property Field
const SelectPropertyField: React.FC<{
  options: string[];
  value: string;
  onChange: (value: string) => void;
}> = ({ options, value, onChange }) => {
  return (
    <select className={styles.select} value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">Select an option...</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

// Multi-Select Property Field
const MultiSelectPropertyField: React.FC<{
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
}> = ({ options, value, onChange }) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>(value);

  useEffect(() => {
    setSelectedOptions(value);
  }, [value]);

  const handleToggleOption = (option: string) => {
    const newValue = selectedOptions.includes(option)
      ? selectedOptions.filter((o) => o !== option)
      : [...selectedOptions, option];

    setSelectedOptions(newValue);
    onChange(newValue);
  };

  const handleRemoveOption = (option: string) => {
    const newValue = selectedOptions.filter((o) => o !== option);
    setSelectedOptions(newValue);
    onChange(newValue);
  };

  return (
    <div className={styles.multiSelectContainer}>
      {selectedOptions.length > 0 && (
        <div className={styles.selectedOptions}>
          {selectedOptions.map((option) => (
            <div key={option} className={styles.optionChip}>
              {option}
              <button onClick={() => handleRemoveOption(option)} type="button" aria-label="Remove">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
      <select
        className={styles.select}
        value=""
        onChange={(e) => {
          if (e.target.value) {
            handleToggleOption(e.target.value);
          }
        }}
      >
        <option value="">Add option...</option>
        {options
          .filter((option) => !selectedOptions.includes(option))
          .map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
      </select>
    </div>
  );
};

// URL Property Field
const UrlPropertyField: React.FC<{
  value: string;
  onChange: (value: string) => void;
}> = ({ value, onChange }) => {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleBlur = () => {
    if (localValue !== value) {
      onChange(localValue);
    }
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className={styles.urlContainer}>
      <input
        type="url"
        className={styles.input}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={handleBlur}
        placeholder="https://example.com"
      />
      {value && isValidUrl(value) && (
        <a href={value} target="_blank" rel="noopener noreferrer" className={styles.urlLink}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
          Open link
        </a>
      )}
    </div>
  );
};
