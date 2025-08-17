'use client';

import { version } from '../version';

export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-gray-100 dark:bg-gray-900 py-4 text-center text-sm text-gray-600 dark:text-gray-400">
      <p>IP Location App v{version}</p>
    </footer>
  );
}