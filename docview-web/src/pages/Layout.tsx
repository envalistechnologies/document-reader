import React from 'react';
import { Link } from 'react-router-dom';

export const COMPANY_NAME = 'Envalis Technologies';
export const CONTACT_EMAIL = 'envalistechnologies@gmail.com';
export const APP_NAME = 'DocReader';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <header className="border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-6 py-6 flex items-center justify-between">
          <Link to="/" className="text-lg font-bold text-gray-900">
            {APP_NAME}
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <Link to="/about" className="text-gray-600 hover:text-gray-900">
              About
            </Link>
            <Link to="/privacy" className="text-gray-600 hover:text-gray-900">
              Privacy
            </Link>
            <Link to="/terms" className="text-gray-600 hover:text-gray-900">
              Terms
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-gray-200 mt-16">
        <div className="max-w-3xl mx-auto px-6 py-8 text-sm text-gray-500 flex items-center justify-between">
          <span>
            © {new Date().getFullYear()} {COMPANY_NAME}
          </span>
          <div className="flex gap-4">
            <Link to="/privacy" className="text-blue-600 hover:underline">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-blue-600 hover:underline">
              Terms of Use
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;