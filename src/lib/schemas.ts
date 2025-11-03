import { z } from "zod";

export const predictionSchema = z.object({
  latitude: z.coerce.number().min(-90, "Invalid latitude").max(90, "Invalid latitude"),
  longitude: z.coerce.number().min(-180, "Invalid longitude").max(180, "Invalid longitude"),
  room_type: z.string().min(1, "Room type is required"),
  accommodates: z.coerce.number().int().min(1, "Must accommodate at least 1 person"),
  bathrooms: z.coerce.number().min(0, "Bathrooms cannot be negative"),
  bedrooms: z.coerce.number().min(0, "Bedrooms cannot be negative"),
  beds: z.coerce.number().min(0, "Beds cannot be negative"),
  host_response_time: z.string().min(1, "Host response time is required"),
  host_listings_count: z.coerce.number().int().min(0, "Listings count cannot be negative"),
  number_of_reviews: z.coerce.number().int().min(0, "Number of reviews cannot be negative"),
  review_scores_rating: z.coerce.number().min(0).max(100, "Rating must be between 0 and 100"),
  review_scores_accuracy: z.coerce.number().min(0).max(10, "Score must be between 0 and 10"),
  review_scores_cleanliness: z.coerce.number().min(0).max(10, "Score must be between 0 and 10"),
  review_scores_checkin: z.coerce.number().min(0).max(10, "Score must be between 0 and 10"),
  review_scores_communication: z.coerce.number().min(0).max(10, "Score must be between 0 and 10"),
  review_scores_location: z.coerce.number().min(0).max(10, "Score must be between 0 and 10"),
  review_scores_value: z.coerce.number().min(0).max(10, "Score must be between 0 and 10"),
});

export type PredictionInput = z.infer<typeof predictionSchema>;
