export interface GigDataType {
  id: number | string; // Facebook IDs are strings, static data uses numbers
  date: string;
  venue: string;
  location: string;
  postcode: string;
  startTime: string;
  url: string;
  // Optional fields that might come from Facebook API
  coverImage?: string;
  title?: string;
  description?: string;
  attendingCount?: number;
  interestedCount?: number;
}