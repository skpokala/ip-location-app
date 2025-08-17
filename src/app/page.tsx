'use client';

import { useEffect, useState } from 'react';

interface IPInfo {
  query: string;
  city: string;
  country: string;
  regionName: string;
  timezone: string;
  isp: string;
  org: string;
  lat: number;
  lon: number;
}

export default function Home() {
  const [ipInfo, setIpInfo] = useState<IPInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIpInfo = async () => {
      try {
        const response = await fetch('http://ip-api.com/json/?fields=query,city,country,regionName,timezone,isp,org,lat,lon');
        if (!response.ok) {
          throw new Error('Failed to fetch IP information');
        }
        const data = await response.json();
        setIpInfo(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch IP information');
      } finally {
        setLoading(false);
      }
    };

    fetchIpInfo();
  }, []);

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <h1 className="text-4xl font-bold">IP Location App</h1>
        <p className="mt-4">Loading IP information...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <h1 className="text-4xl font-bold">IP Location App</h1>
        <p className="mt-4 text-red-500">Error: {error}</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">IP Location App</h1>
      
      {ipInfo && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-md w-full">
          <div className="grid grid-cols-1 gap-4">
            <div className="border-b pb-2">
              <h2 className="text-2xl font-semibold text-center">{ipInfo.query}</h2>
              <p className="text-gray-500 dark:text-gray-400 text-center">Your IP Address</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold">Location</h3>
                <p>{ipInfo.city}, {ipInfo.regionName}</p>
                <p>{ipInfo.country}</p>
              </div>
              
              <div>
                <h3 className="font-semibold">Timezone</h3>
                <p>{ipInfo.timezone}</p>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="font-semibold">Network</h3>
              <p>ISP: {ipInfo.isp}</p>
              <p>Organization: {ipInfo.org}</p>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="font-semibold">Coordinates</h3>
              <p>Latitude: {ipInfo.lat}</p>
              <p>Longitude: {ipInfo.lon}</p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}