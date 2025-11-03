# **App Name**: AirBnB Insights

## Core Features:

- Price Class Prediction: Predict the price class (baixo, medio, luxo) of a listing based on its features, using the provided API endpoint.
- Feature Importance Explanation: Display the LIME explanation to show which features most influenced the price class prediction. Use the `explicacao_LIME` array from the API response.
- Input Form: Create a user-friendly form to input the required listing features (latitude, longitude, accommodates, etc.). Enforce input validation rules to prevent 422 errors.
- Enum Selection: Provide dropdown menus for `room_type` and `host_response_time` using the official enums to guarantee data is canonical. Provide the option to connect directly to API server endpoints `/enums` (and sub-routes) in order to generate the menu automatically at run-time.
- API Integration: Use `fetch` (JS) or `requests` (Python) to call the `/predict` endpoint with the user-provided data and display the results (predicted class, probabilities, LIME explanation).
- Error Handling: Display user-friendly error messages for common errors like 422 (validation errors) and 500 (internal server errors).

## Style Guidelines:

- Primary color: Soft blue (#7BBEEF), evoking trust and serenity.
- Background color: Very light blue (#F0F8FF), for a clean, airy feel.
- Accent color: Warm orange (#E99228), providing a gentle, friendly contrast.
- Body and headline font: 'PT Sans', a modern sans-serif with a little warmth or personality.
- Use clean, simple icons to represent listing features and error states.
- Use a clear, logical layout with a prominent input form and a well-organized results section.
- Subtle transitions when displaying predictions and explanations.