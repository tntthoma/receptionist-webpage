'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

interface Call {
  id: string;
  callerName: string;
  callerPhone: string;
  duration: string;
  timestamp: Date;
  status: 'answered' | 'missed' | 'forwarded';
  transcript?: string;
  summary?: string;
}

export default function CallsPage() {
  const [calls, setCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);
  const [filter, setFilter] = useState<'all' | 'answered' | 'missed' | 'forwarded'>('all');

  useEffect(() => {
    // Fetch calls from Retell AI
    // TODO: Replace with actual API call
    const fetchCalls = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Simulated data
        const mockCalls: Call[] = Array.from({ length: 20 }, (_, i) => ({
          id: `call-${i + 1}`,
          callerName: `Kunde ${i + 1}`,
          callerPhone: `+49 123 456 78${String(i).padStart(2, '0')}`,
          duration: `${Math.floor(Math.random() * 10) + 1}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
          timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
          status: ['answered', 'missed', 'forwarded'][Math.floor(Math.random() * 3)] as Call['status'],
          transcript: 'Guten Tag, ich hätte gerne einen Termin für nächste Woche...',
          summary: 'Kunde möchte Termin für nächste Woche buchen. Präferenz: Vormittag.',
        }));

        setCalls(mockCalls);
      } catch (error) {
        console.error('Error fetching calls:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCalls();
  }, []);

  const filteredCalls = filter === 'all'
    ? calls
    : calls.filter(call => call.status === filter);

  const getStatusColor = (status: Call['status']) => {
    switch (status) {
      case 'answered': return 'bg-green-100 text-green-700';
      case 'missed': return 'bg-red-100 text-red-700';
      case 'forwarded': return 'bg-blue-100 text-blue-700';
    }
  };

  const getStatusText = (status: Call['status']) => {
    switch (status) {
      case 'answered': return 'Beantwortet';
      case 'missed': return 'Verpasst';
      case 'forwarded': return 'Weitergeleitet';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Anrufe</h1>
        <p className="text-gray-600 mt-2">
          Vollständige Übersicht aller Anrufe mit Details
        </p>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6 border border-gray-100">
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Alle ({calls.length})
          </button>
          <button
            onClick={() => setFilter('answered')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === 'answered'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Beantwortet ({calls.filter(c => c.status === 'answered').length})
          </button>
          <button
            onClick={() => setFilter('missed')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === 'missed'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Verpasst ({calls.filter(c => c.status === 'missed').length})
          </button>
          <button
            onClick={() => setFilter('forwarded')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === 'forwarded'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Weitergeleitet ({calls.filter(c => c.status === 'forwarded').length})
          </button>
        </div>
      </div>

      {/* Calls List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* List */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 max-h-[calc(100vh-20rem)] overflow-y-auto">
          <div className="divide-y divide-gray-100">
            {filteredCalls.map((call) => (
              <div
                key={call.id}
                onClick={() => setSelectedCall(call)}
                className={`p-4 cursor-pointer transition ${
                  selectedCall?.id === call.id
                    ? 'bg-primary-50'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{call.callerName}</p>
                      <p className="text-sm text-gray-600">{call.callerPhone}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(call.status)}`}>
                    {getStatusText(call.status)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>{call.duration} Min</span>
                  <span>{format(call.timestamp, 'dd.MM.yyyy HH:mm', { locale: de })}</span>
                </div>
                {call.summary && (
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {call.summary}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          {selectedCall ? (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Anruf-Details</h2>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedCall.status)}`}>
                  {getStatusText(selectedCall.status)}
                </span>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-sm font-semibold text-gray-700">Anrufer</label>
                  <p className="text-gray-900 mt-1">{selectedCall.callerName}</p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700">Telefonnummer</label>
                  <p className="text-gray-900 mt-1">{selectedCall.callerPhone}</p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700">Datum & Zeit</label>
                  <p className="text-gray-900 mt-1">
                    {format(selectedCall.timestamp, 'dd. MMMM yyyy, HH:mm', { locale: de })} Uhr
                  </p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700">Dauer</label>
                  <p className="text-gray-900 mt-1">{selectedCall.duration} Minuten</p>
                </div>
              </div>

              {selectedCall.summary && (
                <div className="mb-6">
                  <label className="text-sm font-semibold text-gray-700 block mb-2">Zusammenfassung</label>
                  <div className="bg-primary-50 rounded-lg p-4">
                    <p className="text-gray-900">{selectedCall.summary}</p>
                  </div>
                </div>
              )}

              {selectedCall.transcript && (
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">Transkript</label>
                  <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                    <p className="text-gray-900 whitespace-pre-wrap">{selectedCall.transcript}</p>
                  </div>
                </div>
              )}

              <div className="mt-6 flex space-x-3">
                <button className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition font-medium">
                  Zurückrufen
                </button>
                <button className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition font-medium">
                  Als wichtig markieren
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <p className="text-gray-600">Wählen Sie einen Anruf aus, um Details zu sehen</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
