import React from 'react';
import type { FormConfig, FormData } from './types';
import { useForm } from '../../hooks/use-form.hook';
import { ComponentRenderer } from './form-renderer';
import { useFormInstructions, useFormComponents } from './form-logic';
import {
  FormContainer,
  FormTitle,
  FormDescription,
  ErrorMessage,
  SuccessMessage,
  FormInstructions,
  LoadingOverlay,
  FormActions,
  ResetButton,
} from './form-styles';

interface FormProps {
  config: FormConfig;
  onSubmit?: (data: FormData) => Promise<void>;
}

export const Form: React.FC<FormProps> = ({ config, onSubmit }) => {
  const {
    formData,
    isSubmitting,
    error,
    success,
    fieldErrors,
    handleFieldChange,
    handleSubmit,
    resetForm,
  } = useForm(config, onSubmit);

  // Business logic hooks
  const formInstructions = useFormInstructions(config);
  const formComponents = useFormComponents(
    config,
    formData,
    fieldErrors,
    isSubmitting,
    handleFieldChange
  );

  return (
    <FormContainer
      data-automation="form-container"
      onSubmit={handleSubmit}
      aria-labelledby="form-title"
      aria-describedby="form-description"
      aria-live="polite"
      noValidate
      className={isSubmitting ? 'submitting' : ''}
      style={{ position: 'relative' }}
    >
      {/* Loading overlay */}
      {isSubmitting && (
        <LoadingOverlay aria-hidden="true">
          <div>Submitting form...</div>
        </LoadingOverlay>
      )}

      <FormTitle id="form-title" data-automation="form-title">
        {config.title}
      </FormTitle>

      {config.description && (
        <FormDescription
          id="form-description"
          data-automation="form-description"
        >
          {config.description}
        </FormDescription>
      )}

      {/* Form instructions for screen readers */}
      <FormInstructions
        role="note"
        aria-live="polite"
        data-automation="form-instructions"
      >
        {formInstructions}
      </FormInstructions>

      {/* Error Message */}
      {error && (
        <ErrorMessage
          id="form-error"
          data-automation="form-error"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <strong>Error:</strong> {error}
        </ErrorMessage>
      )}

      {/* Success Message */}
      {success && (
        <SuccessMessage
          id="form-success"
          data-automation="form-success"
          role="alert"
          aria-live="polite"
          aria-atomic="true"
        >
          <strong>Success:</strong> {success}
        </SuccessMessage>
      )}

      {/* Rendered Components */}
      {formComponents.map(
        ({
          key,
          component,
          formData,
          fieldErrors,
          isSubmitting,
          onFieldChange,
        }) => (
          <ComponentRenderer
            key={key}
            component={component}
            formData={formData}
            fieldErrors={fieldErrors}
            isSubmitting={isSubmitting}
            onFieldChange={onFieldChange}
          />
        )
      )}

      {/* Form Actions */}
      {(Object.keys(formData).length > 0 || success) && (
        <FormActions>
          <ResetButton
            type="button"
            onClick={resetForm}
            disabled={isSubmitting}
            data-automation="form-reset-button"
          >
            {success ? 'Start Over' : 'Reset Form'}
          </ResetButton>
        </FormActions>
      )}
    </FormContainer>
  );
};
