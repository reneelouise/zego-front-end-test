import { useState, useCallback, useRef } from 'react';
import type { FormData, FormConfig } from '../components/form/types';
import { validateForm } from '../utils/validation';

interface UseFormReturn {
  formData: FormData;
  isSubmitting: boolean;
  error: string | null;
  success: string | null;
  fieldErrors: Record<string, string>;
  handleFieldChange: (fieldId: string, value: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  resetForm: () => void;
}

export const useForm = (
  config: FormConfig,
  onSubmit?: (data: FormData) => Promise<void>
): UseFormReturn => {
  const [formData, setFormData] = useState<FormData>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Use ref to track if component is mounted to prevent state updates after unmount
  const isMountedRef = useRef(true);

  const handleFieldChange = useCallback(
    (fieldId: string, value: string) => {
      if (!isMountedRef.current) return;

      setFormData(prev => ({ ...prev, [fieldId]: value }));

      // Clear error when user starts typing
      setError(null);

      // Clear field-specific error
      if (fieldErrors[fieldId]) {
        setFieldErrors(prev => ({ ...prev, [fieldId]: '' }));
      }

      // Reset success state when user modifies form
      if (success) {
        setSuccess(null);
      }
    },
    [fieldErrors, success]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!isMountedRef.current) return;

      // Validate form
      const validationErrors = validateForm(config, formData);
      if (Object.keys(validationErrors).length > 0) {
        setFieldErrors(validationErrors);
        setError('Please fix the errors below');

        // Focus on first error field for accessibility
        const firstErrorField = Object.keys(validationErrors)[0];
        const errorElement = document.getElementById(firstErrorField);
        if (errorElement) {
          errorElement.focus();
          // Check if scrollIntoView is available (not available in JSDOM)
          if (typeof errorElement.scrollIntoView === 'function') {
            errorElement.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
            });
          }
        }
        return;
      }

      setIsSubmitting(true);
      setError(null);
      setSuccess(null);
      setFieldErrors({});

      try {
        if (onSubmit) {
          await onSubmit(formData);
          if (isMountedRef.current) {
            setSuccess('Form submitted successfully!');
            // Reset form after successful submission
            setTimeout(() => {
              if (isMountedRef.current) {
                setFormData({});
                setFieldErrors({});
              }
            }, 2000); // Reset after 2 seconds to show success message
          }
        } else {
          // Default submission to API
          const response = await fetch(config.submitUrl, {
            method: config.method || 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              formData,
              timestamp: new Date().toISOString(),
              formId: config.title,
            }),
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
              errorData.message ||
                `Server error: ${response.status} ${response.statusText}`
            );
          }

          await response.json();

          if (isMountedRef.current) {
            setSuccess('Form submitted successfully!');
            // Reset form after successful submission
            setTimeout(() => {
              if (isMountedRef.current) {
                setFormData({});
                setFieldErrors({});
              }
            }, 2000); // Reset after 2 seconds to show success message
          }
        }
      } catch (error) {
        if (!isMountedRef.current) return;

        // User-friendly error messages
        let errorMessage = 'An unexpected error occurred. Please try again.';

        if (error instanceof Error) {
          if (error.message.includes('fetch')) {
            errorMessage =
              'Network error. Please check your connection and try again.';
          } else if (error.message.includes('Server error')) {
            errorMessage = error.message;
          } else {
            errorMessage = error.message;
          }
        }

        setError(errorMessage);
      } finally {
        if (isMountedRef.current) {
          setIsSubmitting(false);
        }
      }
    },
    [config, formData, onSubmit]
  );

  // Reset form function
  const resetForm = useCallback(() => {
    if (!isMountedRef.current) return;

    setFormData({});
    setFieldErrors({});
    setError(null);
    setSuccess(null);
    setIsSubmitting(false);
  }, []);

  // Cleanup on unmount
  const cleanup = useCallback(() => {
    isMountedRef.current = false;
  }, []);

  // Add cleanup to window unload to prevent memory leaks
  if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', cleanup);
  }

  return {
    formData,
    isSubmitting,
    error,
    success,
    fieldErrors,
    handleFieldChange,
    handleSubmit,
    resetForm,
  };
};
