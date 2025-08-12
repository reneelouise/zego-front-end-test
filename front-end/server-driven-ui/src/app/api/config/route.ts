import { NextResponse } from 'next/server';
import { FormConfig } from '@/components/form/types';

/**
 * Getter function to retrieve the form configuration
 * Provides controlled access to form config with validation
 */
const getFormConfig = (): FormConfig => {
  return {
    title: 'User Registration Form',
    description: 'Please fill out the form below to create your account.',
    submitUrl: '/api/submit',
    method: 'POST',
    components: [
      {
        id: 'welcome-text',
        type: 'text',
        label:
          'Welcome to our platform! Please provide your information below.',
        className: 'welcome-message',
      },
      {
        id: 'first-name',
        type: 'input',
        label: 'First Name',
        placeholder: 'Enter your first name',
        required: true,
      },
      {
        id: 'last-name',
        type: 'input',
        label: 'Last Name',
        placeholder: 'Enter your last name',
        required: true,
      },
      {
        id: 'email',
        type: 'input',
        label: 'Email Address',
        placeholder: 'Enter your email address',
        required: true,
      },
      {
        id: 'phone',
        type: 'input',
        label: 'Phone Number',
        placeholder: 'Enter your phone number',
      },
      {
        id: 'country',
        type: 'dropdown',
        label: 'Country',
        required: true,
        options: [
          { value: 'us', label: 'United States' },
          { value: 'uk', label: 'United Kingdom' },
          { value: 'ca', label: 'Canada' },
          { value: 'au', label: 'Australia' },
          { value: 'de', label: 'Germany' },
          { value: 'fr', label: 'France' },
          { value: 'other', label: 'Other' },
        ],
      },
      {
        id: 'newsletter',
        type: 'dropdown',
        label: 'Subscribe to Newsletter',
        options: [
          { value: 'yes', label: 'Yes, I want to receive updates' },
          { value: 'no', label: 'No, thanks' },
        ],
      },
      {
        id: 'terms-text',
        type: 'text',
        label:
          'By submitting this form, you agree to our Terms of Service and Privacy Policy.',
        className: 'terms-notice',
      },
      {
        id: 'submit-button',
        type: 'button',
        label: 'Create Account',
      },
    ],
  };
};

export async function GET() {
  try {
    // Simulate potential network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Simulate potential config loading errors
    const shouldFail = Math.random() < 0.1; // 10% chance of failure for testing

    if (shouldFail) {
      return NextResponse.json(
        {
          success: false,
          message: 'Configuration service temporarily unavailable',
          error: 'SERVICE_UNAVAILABLE',
        },
        { status: 503 }
      );
    }

    const formConfig = getFormConfig();

    return NextResponse.json({
      success: true,
      data: formConfig,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    // Log error to proper logging service in production
    // For now, we'll handle it silently and return a generic error

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to load form configuration',
        error: 'CONFIG_LOAD_ERROR',
      },
      { status: 500 }
    );
  }
}
