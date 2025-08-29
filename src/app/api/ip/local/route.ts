import { NextRequest, NextResponse } from 'next/server';
import { networkInterfaces } from 'os';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/auth.config';

export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const interfaces = networkInterfaces();
    const addresses: { name: string; address: string; family: string; internal: boolean }[] = [];

    // Collect all IP addresses from all network interfaces
    Object.entries(interfaces).forEach(([name, nets]) => {
      if (nets) {
        nets.forEach((net) => {
          // Only include IPv4 and IPv6 addresses
          if (net.family === 'IPv4' || net.family === 'IPv6') {
            addresses.push({
              name,
              address: net.address,
              family: net.family,
              internal: net.internal
            });
          }
        });
      }
    });

    // Filter out loopback addresses and sort: external IPv4 first, then external IPv6, then internal
    const filteredAddresses = addresses.filter(addr => {
      // Filter out loopback addresses (127.0.0.1, ::1)
      if (addr.address === '127.0.0.1' || addr.address === '::1') {
        return false;
      }
      return true;
    });

    filteredAddresses.sort((a, b) => {
      // Put non-internal addresses first
      if (a.internal !== b.internal) {
        return a.internal ? 1 : -1;
      }
      // Then IPv4 before IPv6
      if (a.family !== b.family) {
        return a.family === 'IPv4' ? -1 : 1;
      }
      // For IPv4, prioritize 192.168.* and 10.* addresses
      if (a.family === 'IPv4' && b.family === 'IPv4') {
        const aIsPrivate = a.address.startsWith('192.168.') || a.address.startsWith('10.');
        const bIsPrivate = b.address.startsWith('192.168.') || b.address.startsWith('10.');
        if (aIsPrivate !== bIsPrivate) {
          return aIsPrivate ? -1 : 1;
        }
      }
      return 0;
    });

    return NextResponse.json({ addresses: filteredAddresses });
  } catch (error) {
    console.error('Error getting local IP addresses:', error);
    return NextResponse.json(
      { error: 'Failed to get local IP addresses' },
      { status: 500 }
    );
  }
}
