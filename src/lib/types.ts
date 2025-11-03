export type RoomType = 'Entire home/apt' | 'Private room' | 'Shared room' | 'Hotel room';
export type HostResponseType = 'within an hour' | 'within a few hours' | 'within a day' | 'a few days or more';

export type PredictionInput = {
  latitude: number;
  longitude: number;
  room_type: RoomType;
  accommodates: number;
  bathrooms: number;
  bedrooms: number;
  beds: number;
  host_response_time: HostResponseType;
  host_response_rate: number;
  host_acceptance_rate: number;
  host_listings_count: number;
  host_total_listings_count: number;
  host_has_profile_pic: 't' | 'f';
  host_identity_verified: 't' | 'f';
  minimum_nights: number;
  maximum_nights: number;
  minimum_minimum_nights: number;
  maximum_minimum_nights: number;
  minimum_maximum_nights: number;
  maximum_maximum_nights: number;
  minimum_nights_avg_ntm: number;
  maximum_nights_avg_ntm: number;
  has_availability: 't' | 'f';
  host_days_active: number;
  amenities_count: number;
  neighbourhood_cleansed: string;
  property_type: string;
  number_of_reviews: number;
  review_scores_rating: number;
  review_scores_accuracy: number;
  review_scores_cleanliness: number;
  review_scores_checkin: number;
  review_scores_communication: number;
  review_scores_location: number;
  review_scores_value: number;
};

export type PredictionResponse = {
  predicao: 'baixo' | 'medio' | 'luxo';
  probabilidades: {
    baixo: number;
    medio: number;
    luxo: number;
  };
  explicacao_LIME: string[];
};
