import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions, enableTOTP, disableTOTP, getTOTPStatus } from '../auth.config';
import { authenticator } from 'otplib';
import QRCode from 'qrcode';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const status = getTOTPStatus();
    return NextResponse.json(status);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to get TOTP status' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { action, code } = await req.json();

    if (action === 'enable') {
      // Generate new TOTP secret
      const secret = authenticator.generateSecret();
      enableTOTP(secret);
      
      // Generate QR code
      const otpauth = authenticator.keyuri(session.user.username, 'IP Location App', secret);
      const qrCode = await QRCode.toDataURL(otpauth);
      
      return NextResponse.json({
        secret,
        qrCode,
        message: 'TOTP enabled successfully'
      });
    } else if (action === 'disable') {
      disableTOTP();
      return NextResponse.json({
        message: 'TOTP disabled successfully'
      });
    } else if (action === 'verify') {
      const status = getTOTPStatus();
      if (!status.enabled || !status.secret) {
        return NextResponse.json(
          { error: 'TOTP not enabled' },
          { status: 400 }
        );
      }

      const isValid = authenticator.verify({ token: code, secret: status.secret });
      if (!isValid) {
        return NextResponse.json(
          { error: 'Invalid TOTP code' },
          { status: 400 }
        );
      }

      return NextResponse.json({
        message: 'TOTP code verified successfully'
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process TOTP request' },
      { status: 500 }
    );
  }
}
