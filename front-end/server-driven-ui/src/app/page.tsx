'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Form } from '../components/form/form';
import { FormConfig, FormData } from '../components/form/types';

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem 1rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  color: white;
  text-align: center;
`;

const LoadingSpinner = styled.div`
  width: 3rem;
  height: 3rem;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  color: white;
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
`;

const ErrorIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.8;
`;

const RetryButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 1rem;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.5);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ErrorDetails = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.375rem;
  padding: 1rem;
  margin-top: 1rem;
  font-size: 0.875rem;
  font-family: monospace;
  max-width: 100%;
  overflow-x: auto;
`;

export default function Home() {
  const [config, setConfig] = useState<FormConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const loadConfig = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/config');

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `Failed to fetch configuration: ${response.status} ${response.statusText}`
        );
      }

      const result = await response.json();

      // Handle new API response format
      if (result.success === false) {
        throw new Error(result.message || 'Failed to load configuration');
      }

      const formConfig = result.data || result; // Fallback for old format

      setConfig(formConfig);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Failed to load form configuration';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConfig();
  }, []);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    loadConfig();
  };

  const handleFormSubmit = async (data: FormData) => {
    try {
      if (!config) return;

      const result = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formData: data,
          timestamp: new Date().toISOString(),
          formId: config.title,
        }),
      });

      if (!result.ok) {
        const errorData = await result.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${result.status}`
        );
      }

      const response = await result.json();

      // Success is handled by the Form component
    } catch (error) {
      throw error; // Let the Form component handle the error display
    }
  };

  if (loading) {
    return (
      <AppContainer>
        <LoadingContainer>
          <LoadingSpinner />
          <div>Loading form configuration...</div>
          {retryCount > 0 && (
            <div
              style={{
                fontSize: '0.875rem',
                opacity: 0.8,
                marginTop: '0.5rem',
              }}
            >
              Retry attempt {retryCount}
            </div>
          )}
        </LoadingContainer>
      </AppContainer>
    );
  }

  if (error) {
    return (
      <AppContainer>
        <ErrorContainer>
          <ErrorIcon>⚠️</ErrorIcon>
          <h2>Error Loading Form</h2>
          <p>{error}</p>

          {/* Show technical details in development */}
          {process.env.NODE_ENV === 'development' && (
            <ErrorDetails>
              <strong>Technical Details:</strong>
              <br />
              Retry Count: {retryCount}
              <br />
              Error: {error}
            </ErrorDetails>
          )}

          <RetryButton onClick={handleRetry} disabled={loading}>
            {loading ? 'Retrying...' : 'Try Again'}
          </RetryButton>

          {retryCount >= 3 && (
            <div
              style={{ marginTop: '1rem', fontSize: '0.875rem', opacity: 0.8 }}
            >
              Having trouble? Please check your internet connection or contact
              support.
            </div>
          )}
        </ErrorContainer>
      </AppContainer>
    );
  }

  if (!config) {
    return (
      <AppContainer>
        <ErrorContainer>
          <ErrorIcon>❓</ErrorIcon>
          <h2>No Form Configuration</h2>
          <p>No form configuration was found.</p>
          <RetryButton onClick={handleRetry}>Retry</RetryButton>
        </ErrorContainer>
      </AppContainer>
    );
  }

  return (
    <AppContainer>
      <Form config={config} onSubmit={handleFormSubmit} />
    </AppContainer>
  );
}
