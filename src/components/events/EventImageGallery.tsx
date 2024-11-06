import React from 'react';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';

interface EventImageGalleryProps {
  images: Array<{
    original: string;
    thumbnail: string;
    description?: string;
  }>;
}

export default function EventImageGallery({ images }: EventImageGalleryProps) {
  return (
    <div className="rounded-xl overflow-hidden">
      <ImageGallery
        items={images}
        showPlayButton={false}
        showFullscreenButton={true}
        showNav={true}
        showThumbnails={true}
        thumbnailPosition="bottom"
        slideInterval={4000}
        slideDuration={450}
        lazyLoad={true}
        additionalClass="event-gallery"
      />
    </div>
  );
}