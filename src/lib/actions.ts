'use server';

import { predictionSchema } from './schemas';
import type { PredictionResponse } from './types';

export type ActionState = {
  message: string | null;
  result: PredictionResponse | null;
  errors: {
    [key: string]: string[];
  } | null;
};

export async function predictPriceClass(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const rawData = Object.fromEntries(formData.entries());

  const validatedFields = predictionSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      message: 'Validation failed. Please check your inputs.',
      result: null,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { api_url, ...predictionData } = validatedFields.data;

  // This is a server-to-server request.
  // The Next.js server will make this request.
  // This will fail if the API is only running on the user's localhost and not accessible from the Next.js server environment.
  try {
    const response = await fetch(`${api_url}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...predictionData,
        host_response_rate: predictionData.host_response_rate / 100,
        host_acceptance_rate: predictionData.host_acceptance_rate / 100,
        host_has_profile_pic: predictionData.host_has_profile_pic === 't',
        host_identity_verified: predictionData.host_identity_verified === 't',
        has_availability: predictionData.has_availability === 't',
      }),
    });

    if (response.status === 422) {
      const errorBody = await response.json();
      const firstError = errorBody.detail?.[0];
      const errorMessage = firstError
        ? `${firstError.loc.join('.')} - ${firstError.msg}`
        : 'Unknown validation issue.';

      return {
        message: `API Validation Error: ${errorMessage}`,
        result: null,
        errors: { _form: [errorMessage] },
      };
    }

    if (!response.ok) {
      const errorText = await response.text();
      return {
        message: `An API error occurred: ${response.status} ${response.statusText}. ${errorText}`,
        result: null,
        errors: null,
      };
    }

    const result: PredictionResponse = await response.json();

    return {
      message: 'Prediction successful!',
      result: result,
      errors: null,
    };
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('ECONNREFUSED')) {
        return {
          message:
            'Could not connect to the prediction service. Please ensure the API server is running on ' +
            api_url,
          result: null,
          errors: null,
        };
      }
      return {
        message: `A network error occurred: ${error.message}`,
        result: null,
        errors: null,
      };
    }
    return {
      message: 'An unknown error occurred.',
      result: null,
      errors: null,
    };
  }
}
