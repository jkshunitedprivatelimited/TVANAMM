export interface OutletLocation {
  lat: number;
  lng: number;
}

export interface Outlet {
  _id: string;
  _type: 'outlet';
  name: string;
  slug: {
    current: string;
  };
  city: string;
  state: string;
  pincode?: string;
  fullAddress: string;
  phone?: string;
  openingHours?: string;
  location: OutletLocation;
  googleMapsUrl?: string;
  image?: {
    _type: 'image';
    asset: {
      _ref: string;
      _type: 'reference';
    };
  };
  isActive: boolean;
}

/** Outlet with computed distance from user (client-side only) */
export interface OutletWithDistance extends Outlet {
  distanceKm: number;
}
