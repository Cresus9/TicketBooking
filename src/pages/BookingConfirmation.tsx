import React, { useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Check, Download, Calendar, MapPin, Clock, Share2, Copy, CheckCircle2 } from 'lucide-react';
import TicketDisplay from '../components/booking/TicketDisplay';
import { generateQRData } from '../utils/ticketService';
import { useAuth } from '../context/AuthContext';

export default function BookingConfirmation() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const { user } = useAuth();
  const ticketRef = useRef<HTMLDivElement>(null);
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);

  // Mock booking data - in a real app, this would come from an API
  const booking = {
    id: bookingId,
    event: {
      title: 'Afro Nation Ghana 2024',
      date: 'Dec 15, 2024',
      time: '18:00',
      location: 'Accra Sports Stadium',
      imageUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea'
    },
    tickets: [
      { type: 'VIP', quantity: 2, price: 150, currency: 'GHS' }
    ],
    total: 300,
    currency: 'GHS',
    status: 'confirmed'
  };

  const qrData = generateQRData(bookingId || '', booking.tickets[0].type);

  const handleDownloadTicket = async () => {
    if (!ticketRef.current) return;

    const { generatePDF } = await import('../utils/ticketService');
    const pdfBlob = await generatePDF(ticketRef.current);
    
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ticket-${bookingId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setShowCopiedMessage(true);
      setTimeout(() => setShowCopiedMessage(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShare = async () => {
    const shareText = `Check out my ticket for ${booking.event.title}!\n${booking.event.date} at ${booking.event.location}`;
    const shareUrl = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Ticket for ${booking.event.title}`,
          text: shareText,
          url: shareUrl
        });
      } catch (error) {
        // Fallback to clipboard if sharing fails or is cancelled
        await copyToClipboard(`${shareText}\n${shareUrl}`);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      await copyToClipboard(`${shareText}\n${shareUrl}`);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
        <p className="text-gray-600">
          Your booking has been confirmed. The tickets have been sent to your email.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
        <div ref={ticketRef}>
          <TicketDisplay
            bookingId={bookingId || ''}
            eventTitle={booking.event.title}
            eventDate={booking.event.date}
            eventTime={booking.event.time}
            eventLocation={booking.event.location}
            ticketType={booking.tickets[0].type}
            ticketHolder={user?.name || ''}
            qrData={qrData}
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <button
          onClick={handleDownloadTicket}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <Download className="h-5 w-5" />
          Download Ticket
        </button>
        <button
          onClick={handleShare}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 relative"
        >
          {showCopiedMessage ? (
            <>
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              Copied to Clipboard
            </>
          ) : (
            <>
              {navigator.share ? <Share2 className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
              {navigator.share ? 'Share Ticket' : 'Copy to Clipboard'}
            </>
          )}
        </button>
      </div>

      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Important Information</h3>
        <ul className="space-y-2 text-gray-600">
          <li>• Please arrive at least 30 minutes before the event starts</li>
          <li>• Have your ticket QR code ready for scanning at the entrance</li>
          <li>• Follow the event's dress code and guidelines</li>
          <li>• For any queries, contact our support team</li>
        </ul>
      </div>

      <div className="mt-8 text-center">
        <Link
          to="/dashboard"
          className="text-indigo-600 hover:text-indigo-700 font-medium"
        >
          View all your bookings →
        </Link>
      </div>
    </div>
  );
}