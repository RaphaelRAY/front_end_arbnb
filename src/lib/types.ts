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
  host_listings_count: number;
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
