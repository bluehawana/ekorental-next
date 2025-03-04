'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { MessageCircle, Phone, Mail } from 'lucide-react';

const BACKEND_URL = 'http://localhost:8080';

export default function SupportPage() {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/support/tickets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subject, message }),
      });

      if (!response.ok) throw new Error('Failed to submit support ticket');

      toast.success('Support ticket submitted successfully');
      setSubject('');
      setMessage('');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to submit support ticket');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Contact Support</h1>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <div className="bg-gray-700 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">Contact Information</h2>
            <div className="space-y-4">
              <div className="flex items-center text-gray-300">
                <Phone className="h-5 w-5 mr-3" />
                <span>+46 123 456 789</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Mail className="h-5 w-5 mr-3" />
                <span>support@ekorental.com</span>
              </div>
              <div className="flex items-center text-gray-300">
                <MessageCircle className="h-5 w-5 mr-3" />
                <span>Live chat available 24/7</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-700 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">FAQ</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-white font-medium mb-2">How do I cancel my booking?</h3>
                <p className="text-gray-300">You can cancel your booking from the bookings page up to 24 hours before the start time.</p>
              </div>
              <div>
                <h3 className="text-white font-medium mb-2">What if I return the car late?</h3>
                <p className="text-gray-300">Late returns may incur additional charges. Please contact support if you need to extend your booking.</p>
              </div>
              <div>
                <h3 className="text-white font-medium mb-2">How do refunds work?</h3>
                <p className="text-gray-300">Refunds are processed within 5-7 business days after a cancellation is approved.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Submit a Ticket</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-2">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-gray-600 text-white rounded px-3 py-2"
                placeholder="What can we help you with?"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-gray-600 text-white rounded px-3 py-2"
                rows={6}
                placeholder="Please describe your issue in detail"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 