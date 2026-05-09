export interface CustomerReview {
  _id: string;
  _type: 'customerReview';
  customerName: string;
  city?: string;
  rating: number;
  reviewText: string;

  outletRef?: {
    _ref: string;
    _type: 'reference';
  };
  date?: string;
  avatar?: {
    _type: 'image';
    asset: {
      _ref: string;
      _type: 'reference';
    };
  };
  isVerified: boolean;
  isFeatured: boolean;
}

export interface AggregateRating {
  averageRating: number;
  totalReviews: number;
  distribution: {
    five: number;
    four: number;
    three: number;
    two: number;
    one: number;
  };
}
