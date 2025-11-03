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
  host_response_rate: z.coerce.number().min(0).max(100),
  host_acceptance_rate: z.coerce.number().min(0).max(100),
  host_listings_count: z.coerce.number().int().min(0, "Listings count cannot be negative"),
  host_total_listings_count: z.coerce.number().int().min(0, "Total listings count cannot be negative"),
  host_has_profile_pic: z.enum(['t', 'f']),
  host_identity_verified: z.enum(['t', 'f']),
  minimum_nights: z.coerce.number().int().min(1),
  maximum_nights: z.coerce.number().int().min(1),
  minimum_minimum_nights: z.coerce.number().int().min(1),
  maximum_minimum_nights: z.coerce.number().int().min(1),
  minimum_maximum_nights: z.coerce.number().int().min(1),
  maximum_maximum_nights: z.coerce.number().int().min(1),
  minimum_nights_avg_ntm: z.coerce.number().min(0),
  maximum_nights_avg_ntm: z.coerce.number().min(0),
  has_availability: z.enum(['t', 'f']),
  host_days_active: z.coerce.number().int().min(0),
  amenities_count: z.coerce.number().int().min(0),
  neighbourhood_cleansed: z.string().min(1, "Neighbourhood is required"),
  property_type: z.string().min(1, "Property type is required"),
});

export type PredictionInput = z.infer<typeof predictionSchema>;
