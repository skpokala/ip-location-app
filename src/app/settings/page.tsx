'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';

interface TOTPStatus {
  enabled: boolean;
  secret?: string;
}

export default function SettingsPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [totpStatus, setTotpStatus] = useState<TOTPStatus>({ enabled: false });
  const [showTOTPSetup, setShowTOTPSetup] = useState(false);
  const [qrCode, setQrCode] = useState<string>('');
  const [totpSecret, setTotpSecret] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState<string>('');

  useEffect(() => {
    fetchTOTPStatus();
  }, []);

  const fetchTOTPStatus = async () => {
    try {
      const response = await fetch('/api/auth/totp-setup');
      if (response.ok) {
        const status = await response.json();
        setTotpStatus(status);
      }
    } catch (error) {
      console.error('Failed to fetch TOTP status:', error);
    }
  };

  async function handlePasswordChange(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const oldPassword = formData.get('oldPassword') as string;
    const newPassword = formData.get('newPassword') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to change password');
      }

      setSuccess('Password changed successfully');
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to change password');
    } finally {
      setIsLoading(false);
    }
  }

  const handleEnableTOTP = async () => {
    try {
      const response = await fetch('/api/auth/totp-setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'enable' }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to enable TOTP');
      }

      setQrCode(data.qrCode);
      setTotpSecret(data.secret);
      setShowTOTPSetup(true);
      setSuccess('TOTP setup initiated. Please scan the QR code and verify.');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to enable TOTP');
    }
  };

  const handleDisableTOTP = async () => {
    try {
      const response = await fetch('/api/auth/totp-setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'disable' }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to disable TOTP');
      }

      setTotpStatus({ enabled: false });
      setSuccess('TOTP disabled successfully');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to disable TOTP');
    }
  };

  const handleVerifyTOTP = async () => {
    if (!verificationCode) {
      setError('Please enter the verification code');
      return;
    }

    try {
      const response = await fetch('/api/auth/totp-setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'verify', code: verificationCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to verify TOTP');
      }

      setTotpStatus({ enabled: true });
      setShowTOTPSetup(false);
      setSuccess('TOTP enabled successfully!');
      setVerificationCode('');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to verify TOTP');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Settings</h2>
        </div>

        <div className="mt-8 space-y-6">
          {/* Password Change Section */}
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handlePasswordChange}>
              <h3 className="text-lg font-medium text-gray-900">Change Password</h3>
              
              <div>
                <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700">
                  Current Password
                </label>
                <input
                  id="oldPassword"
                  name="oldPassword"
                  type="password"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {isLoading ? 'Changing Password...' : 'Change Password'}
                </button>
              </div>
            </form>
          </div>

          {/* TOTP Section */}
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Two-Factor Authentication</h3>
            
            {!totpStatus.enabled ? (
              <div>
                <p className="text-sm text-gray-600 mb-4">
                  Enable two-factor authentication using TOTP for enhanced security.
                </p>
                <button
                  onClick={handleEnableTOTP}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Enable TOTP
                </button>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-600 mb-4">
                  Two-factor authentication is currently enabled.
                </p>
                <button
                  onClick={handleDisableTOTP}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Disable TOTP
                </button>
              </div>
            )}
          </div>

          {/* TOTP Setup Modal */}
          {showTOTPSetup && (
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
              <h3 className="text-lg font-medium text-gray-900 mb-4">TOTP Setup</h3>
              
              <div className="text-center mb-4">
                <p className="text-sm text-gray-600 mb-4">
                  Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
                </p>
                {qrCode && (
                  <img src={qrCode} alt="TOTP QR Code" className="mx-auto mb-4" />
                )}
                <p className="text-xs text-gray-500 mb-4">
                  Secret: {totpSecret}
                </p>
                <p className="text-sm text-gray-600">
                  Enter the 6-digit code from your authenticator app to complete setup:
                </p>
              </div>

              <div className="mb-4">
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  maxLength={6}
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleVerifyTOTP}
                  className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Verify & Enable
                </button>
                <button
                  onClick={() => setShowTOTPSetup(false)}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Sign Out Section */}
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Error and Success Messages */}
        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="mt-4 bg-green-50 border border-green-200 rounded-md p-4">
            <p className="text-green-800 text-sm">{success}</p>
          </div>
        )}
      </div>
    </div>
  );
}