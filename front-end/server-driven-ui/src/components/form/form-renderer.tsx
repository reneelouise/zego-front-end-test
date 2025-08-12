import React, { useCallback, Suspense } from 'react';
import type { UIComponent, FormData } from './types';
import { Text } from '../text';
import { Input } from '../input';
import { Dropdown } from '../dropdown';
import { Button } from '../button';
import { getAutoCompleteValue, shouldAutoFocus } from './utils';

// Error boundary component for individual form components
const ComponentErrorFallback: React.FC<{
  componentId: string;
  error?: Error;
}> = ({ componentId, error }) => (
  <div
    role="alert"
    aria-live="assertive"
    style={{
      backgroundColor: '#fef2f2',
      border: '1px solid #fecaca',
      color: '#dc2626',
      padding: '0.5rem',
      borderRadius: '0.25rem',
      margin: '0.5rem 0',
      fontSize: '0.75rem',
    }}
  >
    <strong>Component Error:</strong> Failed to render component &quot;
    {componentId}&quot;.
    {error && <div>Error: {error.message}</div>}
  </div>
);

interface ComponentRendererProps {
  component: UIComponent;
  formData: FormData;
  fieldErrors: Record<string, string>;
  isSubmitting: boolean;
  onFieldChange: (fieldId: string, value: string) => void;
}

export const ComponentRenderer: React.FC<ComponentRendererProps> = React.memo(
  ({ component, formData, fieldErrors, isSubmitting, onFieldChange }) => {
    const renderComponent = useCallback(() => {
      try {
        switch (component.type) {
          case 'text':
            return <Text id={component.id} label={component.label || ''} />;

          case 'input':
            return (
              <Input
                id={component.id}
                label={component.label}
                placeholder={component.placeholder}
                required={component.required}
                disabled={component.disabled || isSubmitting}
                value={(formData[component.id] as string) || ''}
                onChange={(value: string) => onFieldChange(component.id, value)}
                error={fieldErrors[component.id]}
                autoComplete={getAutoCompleteValue(component.id)}
                autoFocus={shouldAutoFocus(component.id, fieldErrors)}
              />
            );

          case 'dropdown':
            return (
              <Dropdown
                id={component.id}
                label={component.label}
                required={component.required}
                disabled={component.disabled || isSubmitting}
                options={component.options || []}
                value={(formData[component.id] as string) || ''}
                onChange={(value: string) => onFieldChange(component.id, value)}
                error={fieldErrors[component.id]}
                autoFocus={shouldAutoFocus(component.id, fieldErrors)}
              />
            );

          case 'button':
            return (
              <Button
                id={component.id}
                label={component.label || ''}
                loading={isSubmitting}
                type="submit"
                ariaLabel={component.label || 'Submit form'}
                ariaDescribedBy={
                  fieldErrors[component.id]
                    ? `${component.id}-error`
                    : undefined
                }
              />
            );

          case 'form':
            return (
              <div className={component.className}>
                {component.children?.map(child => (
                  <ComponentRenderer
                    key={child.id}
                    component={child}
                    formData={formData}
                    fieldErrors={fieldErrors}
                    isSubmitting={isSubmitting}
                    onFieldChange={onFieldChange}
                  />
                ))}
              </div>
            );

          default:
            return <ComponentErrorFallback componentId={component.id} />;
        }
      } catch (error) {
        return (
          <ComponentErrorFallback
            componentId={component.id}
            error={error as Error}
          />
        );
      }
    }, [component, formData, fieldErrors, isSubmitting, onFieldChange]);

    return (
      <Suspense fallback={<div>Loading component...</div>}>
        {renderComponent()}
      </Suspense>
    );
  }
);

ComponentRenderer.displayName = 'ComponentRenderer';
