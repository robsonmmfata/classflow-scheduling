import { useState, useCallback } from 'react';
import { z } from 'zod';

type ValidationErrors<T> = Partial<Record<keyof T, string>>;

interface UseFormValidationOptions<T> {
  schema: z.ZodSchema<T>;
  initialValues: T;
  onSubmit: (values: T) => void | Promise<void>;
}

export function useFormValidation<T extends Record<string, any>>({
  schema,
  initialValues,
  onSubmit,
}: UseFormValidationOptions<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<ValidationErrors<T>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setValue = useCallback((field: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  const setFieldTouched = useCallback((field: keyof T, isTouched: boolean = true) => {
    setTouched(prev => ({ ...prev, [field]: isTouched }));
  }, []);

  const validateField = useCallback((field: keyof T, value: any) => {
    try {
      // Validate individual field by creating a partial object and validating the whole schema
      const testValue = { ...values, [field]: value };
      schema.parse(testValue);
      setErrors(prev => ({ ...prev, [field]: undefined }));
      return null;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldError = error.issues.find(issue => issue.path.includes(field as string));
        if (fieldError) {
          const errorMessage = fieldError.message || 'Campo inválido';
          setErrors(prev => ({ ...prev, [field]: errorMessage }));
          return errorMessage;
        }
      }
    }
    return null;
  }, [schema, values]);

  const validateAll = useCallback(() => {
    try {
      schema.parse(values);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: ValidationErrors<T> = {};
        error.issues.forEach((issue) => {
          const field = issue.path[0] as keyof T;
          if (field) {
            newErrors[field] = issue.message;
          }
        });
        setErrors(newErrors);
        return false;
      }
    }
    return false;
  }, [schema, values]);

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    // Mark all fields as touched
    const allTouched: Partial<Record<keyof T, boolean>> = {};
    Object.keys(values).forEach((key) => {
      allTouched[key as keyof T] = true;
    });
    setTouched(allTouched);

    if (!validateAll()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } catch (error) {
      console.error('Erro no envio do formulário:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validateAll, onSubmit]);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  const getFieldError = useCallback((field: keyof T) => {
    return touched[field] ? errors[field] : undefined;
  }, [touched, errors]);

  const isFieldInvalid = useCallback((field: keyof T) => {
    return touched[field] && !!errors[field];
  }, [touched, errors]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    setValue,
    setFieldTouched,
    validateField,
    validateAll,
    handleSubmit,
    resetForm,
    getFieldError,
    isFieldInvalid,
  };
}