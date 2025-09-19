import React from 'react';
import { Home, BookOpen, Users,  LogOut } from 'lucide-react';

export default function SupervisorSidebar() {
  // Use window.location.pathname instead of usePathname to determine the current path
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';

  const navigation = [
    { name: 'Dashboard', href: '/supervisor/dashboard', icon: Home },
    { name: 'Projects', href: '/supervisor/projects', icon: BookOpen },
    { name: 'Students', href: '/supervisor/students', icon: Users },
    // { name: 'Review Submissions', href: '/supervisor/review-submissions', icon: FileText },
    // { name: 'Messages', href: '/supervisor/messages', icon: MessageSquare },
    // { name: 'Settings', href: '/supervisor/settings', icon: Settings },
  ];

  return (
    // Added fixed positioning to make the sidebar non-scrollable.
    <div className="hidden lg:flex lg:flex-shrink-0 fixed h-screen left-0 top-0 z-50">
      <div className="flex flex-col w-64 border-r border-gray-200 pt-5 pb-4 bg-white">
        <div className="flex items-center flex-shrink-0 px-6">
          <span className="text-xl font-bold text-gray-900">SPAMS</span>
        </div>
        
        {/* Navigation */}
        <div className="mt-5 flex-1 flex flex-col overflow-y-auto">
          <nav className="flex-1 px-2 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                // Replaced Link with a standard anchor tag
                <a
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon
                    className={`mr-3 flex-shrink-0 h-6 w-6 ${
                      isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                    aria-hidden="true"
                  />
                  {item.name}
                </a>
              );
            })}
          </nav>
        </div>
        
        {/* Profile dropdown */}
        <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
          <div className="flex items-center">
            <div>
              <div className="flex items-center">
                <div>
                  <div className="flex items-center">
                    <button
                      type="button"
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
