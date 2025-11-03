
"use server";

import { apiPredictionSchema } from "./schemas";
import type { PredictionResponse } from "./types";

export type ActionState = {
  message: string | null;
  result: PredictionResponse | null;
  errors: {
    [key: string]: string[];
  } | null;
}

export async function predictPriceClass(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const rawData = Object.fromEntries(formData.entries());
  
  const validatedFields = apiPredictionSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      message: "Validation failed. Please check your inputs.",
      result: null,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { api_url, ...predictionData } = validatedFields.data;

  try {
    const response = await fetch(`${api_url}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(predictionData),
    });

    if (response.status === 422) {
      const errorBody = await response.json();
      const firstError = errorBody.detail?.[0];
      const errorMessage = firstError ? `${firstError.loc.join('.')} - ${firstError.msg}`: 'Unknown validation issue.';
      
      return {
        message: `API Validation Error: ${errorMessage}`,
        result: null,
        errors: { _form: [errorMessage] }
      };
    }

    if (!response.ok) {
      const errorText = await response.text();
      return {
        message: `An API error occurred: ${response.status} ${response.statusText}. ${errorText}`,
        result: null,
        errors: null
      };
    }

    const result: PredictionResponse = await response.json();
    
    return {
      message: "Prediction successful!",
      result: result,
      errors: null
    };

  } catch (error) {
    if (error instanceof Error) {
        if (error.message.includes('ECONNREFUSED')) {
            return {
                message: "Could not connect to the prediction service. Please ensure the API server is running on " + api_url,
                result: null,
                errors: null
            };
        }
        return {
            message: `A network error occurred: ${error.message}`,
            result: null,
            errors: null
        };
    }
    return {
      message: "An unknown error occurred.",
      result: null,
      errors: null
    };
  }
}
