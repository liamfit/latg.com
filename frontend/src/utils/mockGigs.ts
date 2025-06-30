import { GigDataType } from "../types/gig";

// Simple mock gig data for testing different carousel states
export const getMockGigs = (count: number): GigDataType[] => {
  const mockGigs: GigDataType[] = [
    {
      id: "mock-1",
      date: "15-01-2025",
      venue: "The Cross Keys",
      location: "Swanwick",
      postcode: "DE55 1BG",
      startTime: "7:00 PM",
      url: "https://www.facebook.com/events/mock-1/",
      title: "Mock Gig 1",
      description: "Test gig for UI validation",
    },
    {
      id: "mock-2", 
      date: "22-01-2025",
      venue: "Roebuck Inn",
      location: "Burton",
      postcode: "DE14 1BT",
      startTime: "8:00 PM",
      url: "https://www.facebook.com/events/mock-2/",
      title: "Mock Gig 2",
      description: "Test gig for UI validation",
    },
    {
      id: "mock-3",
      date: "29-01-2025", 
      venue: "The Horse & Groom",
      location: "Derby",
      postcode: "DE1 3HN",
      startTime: "9:00 PM",
      url: "https://www.facebook.com/events/mock-3/",
      title: "Mock Gig 3",
      description: "Test gig for UI validation",
    },
    {
      id: "mock-4",
      date: "05-02-2025",
      venue: "The Old Bell", 
      location: "Nottingham",
      postcode: "NG1 1AA",
      startTime: "7:30 PM",
      url: "https://www.facebook.com/events/mock-4/",
      title: "Mock Gig 4",
      description: "Test gig for UI validation",
    },
    {
      id: "mock-5",
      date: "12-02-2025",
      venue: "The Crown & Anchor",
      location: "Leicester", 
      postcode: "LE1 1AA",
      startTime: "8:30 PM",
      url: "https://www.facebook.com/events/mock-5/",
      title: "Mock Gig 5",
      description: "Test gig for UI validation",
    }
  ];

  return mockGigs.slice(0, count);
}; 