import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import { ThemeContext } from '../contexts/ThemeContext';
import { Trash2, Send, Plus } from 'lucide-react';

interface Newsletter {
  _id: string;
  subject: string;
  content: string;
  status: 'draft' | 'sending' | 'sent' | 'failed';
  sentDate?: string;
  recipientCount?: number;
}

function NewsletterManager() {
  const { darkMode } = React.useContext(ThemeContext);
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [subscriberCount, setSubscriberCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newNewsletter, setNewNewsletter] = useState({ subject: '', content: '' });

  const fetchData = async () => {
    try {
      const [newslettersRes, subscribersRes] = await Promise.all([
        fetch(`${API_BASE_URL}/newsletters`, {
          credentials: 'include'
        }),
        fetch(`${API_BASE_URL}/newsletters/subscribers/count`, {
          credentials: 'include'
        })
      ]);

      if (!newslettersRes.ok || !subscribersRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const newslettersData = await newslettersRes.json();
      const subscribersData = await subscribersRes.json();

      setNewsletters(newslettersData);
      setSubscriberCount(subscribersData.count);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/newsletters`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ ...newNewsletter, status: 'draft' }),
      });

      if (!res.ok) {
        throw new Error('Failed to create newsletter');
      }

      await fetchData();
      setNewNewsletter({ subject: '', content: '' });
    } catch (err) {
      console.error('Error creating newsletter:', err);
      setError('Failed to create newsletter');
    }
  };

  const handleDeleteNewsletter = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this newsletter?')) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/newsletters/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error('Failed to delete newsletter');
      }

      await fetchData();
    } catch (err) {
      console.error('Error deleting newsletter:', err);
      setError('Failed to delete newsletter');
    }
  };

  const handleSendNewsletter = async (id: string) => {
    if (!window.confirm('Are you sure you want to send this newsletter?')) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/newsletters/${id}/send`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error('Failed to send newsletter');
      }

      await fetchData();
    } catch (err) {
      console.error('Error sending newsletter:', err);
      setError('Failed to send newsletter');
    }
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div className={`p-6 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}`}>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Newsletter Manager</h1>
          <div className="text-sm">
            Active Subscribers: <span className="font-bold">{subscriberCount}</span>
          </div>
        </div>

        {/* Create New Newsletter Form */}
        <form onSubmit={handleCreateNewsletter} className="mb-8 space-y-4">
          <div>
            <input
              type="text"
              placeholder="Newsletter Subject"
              value={newNewsletter.subject}
              onChange={(e) => setNewNewsletter(prev => ({ ...prev, subject: e.target.value }))}
              className={`w-full p-2 rounded border ${
                darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'
              }`}
              required
            />
          </div>
          <div>
            <textarea
              placeholder="Newsletter Content"
              value={newNewsletter.content}
              onChange={(e) => setNewNewsletter(prev => ({ ...prev, content: e.target.value }))}
              className={`w-full p-2 rounded border h-32 ${
                darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'
              }`}
              required
            />
          </div>
          <button
            type="submit"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            <Plus size={16} />
            Create Draft
          </button>
        </form>

        {/* Newsletters List */}
        <div className="space-y-4">
          {newsletters.map((newsletter) => (
            <div
              key={newsletter._id}
              className={`p-4 rounded-lg border ${
                darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold">{newsletter.subject}</h3>
                  <p className="text-sm text-gray-500">
                    Status: <span className="capitalize">{newsletter.status}</span>
                    {newsletter.sentDate && ` • Sent: ${new Date(newsletter.sentDate).toLocaleDateString()}`}
                    {newsletter.recipientCount && ` • Recipients: ${newsletter.recipientCount}`}
                  </p>
                </div>
                <div className="flex gap-2">
                  {newsletter.status === 'draft' && (
                    <button
                      onClick={() => handleSendNewsletter(newsletter._id)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded"
                      title="Send Newsletter"
                    >
                      <Send size={16} />
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteNewsletter(newsletter._id)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded"
                    title="Delete Newsletter"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <p className="text-sm whitespace-pre-wrap">{newsletter.content}</p>
            </div>
          ))}
          {newsletters.length === 0 && (
            <p className="text-center text-gray-500">No newsletters found</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default NewsletterManager;
