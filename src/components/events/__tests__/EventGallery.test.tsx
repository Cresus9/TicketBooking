import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '../../../test/utils';
import EventGallery from '../EventGallery';

describe('EventGallery', () => {
  const mockImages = [
    { url: 'image1.jpg', alt: 'Image 1' },
    { url: 'image2.jpg', alt: 'Image 2' },
    { url: 'image3.jpg', alt: 'Image 3' }
  ];

  it('renders all images as thumbnails', () => {
    render(<EventGallery images={mockImages} />);
    const thumbnails = screen.getAllByRole('button');
    expect(thumbnails).toHaveLength(mockImages.length);
  });

  it('displays the first image by default', () => {
    render(<EventGallery images={mockImages} />);
    const mainImage = screen.getByAltText('Image 1');
    expect(mainImage).toBeInTheDocument();
  });

  it('changes main image when thumbnail is clicked', () => {
    render(<EventGallery images={mockImages} />);
    const thumbnails = screen.getAllByRole('button');
    fireEvent.click(thumbnails[1]);
    const newMainImage = screen.getByAltText('Image 2');
    expect(newMainImage).toBeInTheDocument();
  });

  it('opens lightbox when main image is clicked', () => {
    render(<EventGallery images={mockImages} />);
    const mainImage = screen.getByAltText('Image 1');
    fireEvent.click(mainImage);
    const lightbox = screen.getByRole('dialog');
    expect(lightbox).toBeInTheDocument();
  });
});