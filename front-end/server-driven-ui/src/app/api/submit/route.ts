import { NextRequest, NextResponse } from 'next/server';
import {
  sanitizeFormData,
  isValidEmail,
  containsInjectionAttempt,
} from '../../../utils/security';

export async function POST(request: NextRequest) {
  try {
    // Validate request
    if (!request.body) {
      return NextResponse.json(
        {
          success: false,
          message: 'Request body is required',
          error: 'MISSING_BODY',
        },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Validate required fields
    if (!body.formData) {
      return NextResponse.json(
        {
          success: false,
          message: 'Form data is required',
          error: 'MISSING_FORM_DATA',
        },
        { status: 400 }
      );
    }

    // Sanitize and validate form data
    const sanitizedFormData = sanitizeFormData(body.formData);

    // Check for injection attempts
    for (const [key, value] of Object.entries(sanitizedFormData)) {
      if (containsInjectionAttempt(value)) {
        return NextResponse.json(
          {
            success: false,
            message: 'Invalid input detected',
            error: 'INVALID_INPUT',
          },
          { status: 400 }
        );
      }
    }

    // Enhanced email validation
    if (sanitizedFormData.email && !isValidEmail(sanitizedFormData.email)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid email format',
          error: 'INVALID_EMAIL',
        },
        { status: 422 }
      );
    }

    // Simulate some processing time
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simulate potential processing errors
    if (body.formData.email && body.formData.email.includes('error')) {
      return NextResponse.json(
        {
          success: false,
          message: 'Email validation failed',
          error: 'EMAIL_VALIDATION_ERROR',
        },
        { status: 422 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Form submitted successfully',
      timestamp: new Date().toISOString(),
      data: body,
    });
  } catch (error) {
    // Handle different types of errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid JSON in request body',
          error: 'INVALID_JSON',
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error occurred',
        error: 'INTERNAL_ERROR',
      },
      { status: 500 }
    );
  }
}
