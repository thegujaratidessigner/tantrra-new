export interface CarouselVideo {
  id: string;
  src: string;
  title: string;
  description?: string;
}

// Add or remove videos here — the carousel component reads this array.
// To add a new video: place the MP4 in public/videos/carousel/, then
// add an entry below. The carousel hides automatically when this is empty.
export const carouselVideos: CarouselVideo[] = [
  {
    id: 'video-01',
    src: '/videos/carousel/video-01.mp4',
    title: 'Sacred Rituals',
    description: 'Glimpses of traditional sacred ceremonies',
  },
  {
    id: 'video-02',
    src: '/videos/carousel/video-02.mp4',
    title: 'Spiritual Guidance',
    description: 'Moments of devotion and spiritual connection',
  },
  {
    id: 'video-03',
    src: '/videos/carousel/video-03.mp4',
    title: 'Divine Offerings',
    description: 'Sacred offerings prepared with intention',
  },
  {
    id: 'video-04',
    src: '/videos/carousel/video-04.mp4',
    title: 'Temple Darshan',
    description: 'Sacred temple visits and blessings',
  },
  {
    id: 'video-05',
    src: '/videos/carousel/video-05.mp4',
    title: 'Puja Ceremony',
    description: 'Traditional puja performed with devotion',
  },
  {
    id: 'video-06',
    src: '/videos/carousel/video-06.mp4',
    title: 'Spiritual Journey',
    description: 'Meaningful moments from our sacred path',
  },
];
