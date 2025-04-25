'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { 
  SignInButton, 
  SignUpButton, 
  SignedIn, 
  SignedOut, 
  UserButton
} from "@clerk/nextjs";
import { 
  Menu, 
  X, 
  Search, 
  Bell, 
  MessageSquare, 
  PlusCircle 
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Helper function to determine if a link is active
  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname?.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Desktop Navigation */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold">
                <span className="text-blue-500">Collab</span>
                <span className="text-green-500">Lab</span>
              </Link>
            </div>
            
            {/* Desktop Navigation Links */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link 
                href="/" 
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/') 
                    ? 'border-blue-500 text-gray-900' 
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                Home
              </Link>
            
              <SignedIn>
              <Link 
                href="/projects" 
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/projects') 
                    ? 'border-blue-500 text-gray-900' 
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                Projects
              </Link>
              <Link 
                href="/applications" 
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/applications') 
                    ? 'border-blue-500 text-gray-900' 
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                Applications
              </Link>
              <Link 
                href="/profile" 
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/profile') 
                    ? 'border-blue-500 text-gray-900' 
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                Profile
              </Link>
              </SignedIn>
            </div>
          </div>
       
          {/* Right Side Menu */}
          <div className="hidden sm:flex sm:items-center sm:ml-6 space-x-4">
            <SignedIn>
              {/* Notification */}
              <button className="p-1 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none">
                <Bell className="h-5 w-5" />
              </button>
              
              {/* Messages */}
              <Link href="/messages" className="p-1 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none">
                <MessageSquare className="h-5 w-5" />
              </Link>
              
              {/* Create Project Button */}
              <Link 
                href="/projects/create"
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PlusCircle className="h-4 w-4 mr-1" />
                <span>Create</span>
              </Link>

             
              
              {/* User dropdown */}
              <div className="ml-3 relative">
                <UserButton afterSignOutUrl="/" />
              </div>
            </SignedIn>
            
            <SignedOut>
              <div className="flex space-x-2">
                <SignInButton mode="modal">
                  <button className="px-4 py-1.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-full hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Sign in
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="px-4 py-1.5 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Sign up
                  </button>
                </SignUpButton>
              </div>
            </SignedOut>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded="false"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">{mobileMenuOpen ? 'Close menu' : 'Open menu'}</span>
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              href="/"
              className={`block pl-3 pr-4 py-2 text-base font-medium ${
                isActive('/')
                  ? 'bg-blue-50 border-l-4 border-blue-500 text-blue-700'
                  : 'border-l-4 border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/projects"
              className={`block pl-3 pr-4 py-2 text-base font-medium ${
                isActive('/projects')
                  ? 'bg-blue-50 border-l-4 border-blue-500 text-blue-700'
                  : 'border-l-4 border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Projects
            </Link>
            <SignedIn>
              <Link
                href="/dashboard"
                className={`block pl-3 pr-4 py-2 text-base font-medium ${
                  isActive('/dashboard')
                    ? 'bg-blue-50 border-l-4 border-blue-500 text-blue-700'
                    : 'border-l-4 border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/applications"
                className={`block pl-3 pr-4 py-2 text-base font-medium ${
                  isActive('/applications')
                    ? 'bg-blue-50 border-l-4 border-blue-500 text-blue-700'
                    : 'border-l-4 border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Applications
              </Link>
              <Link
                href="/messages"
                className={`block pl-3 pr-4 py-2 text-base font-medium ${
                  isActive('/messages')
                    ? 'bg-blue-50 border-l-4 border-blue-500 text-blue-700'
                    : 'border-l-4 border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Messages
              </Link>
              <Link
                href="/projects/create"
                className={`block pl-3 pr-4 py-2 text-base font-medium ${
                  isActive('/projects/create')
                    ? 'bg-blue-50 border-l-4 border-blue-500 text-blue-700'
                    : 'border-l-4 border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Create Project
              </Link>
            </SignedIn>
          </div>
          
          {/* Mobile search bar */}
          <div className="px-4 py-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search projects, skills..."
                className="block w-full pl-10 pr-3 py-2 rounded-md text-sm border border-gray-300 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          {/* Mobile Authentication */}
          <div className="pt-4 pb-3 border-t border-gray-200">
            <SignedIn>
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <UserButton afterSignOutUrl="/" />
                </div>
                <div className="ml-3">
                  <div className="text-sm font-medium text-gray-500">Signed in</div>
                </div>
              </div>
            </SignedIn>
            
            <SignedOut>
              <div className="mt-3 space-y-2 px-4">
                <SignInButton mode="modal">
                  <button className="w-full px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Sign in
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="w-full px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Sign up
                  </button>
                </SignUpButton>
              </div>
            </SignedOut>
          </div>
        </div>
      )}
    </nav>
  );
}