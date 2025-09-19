'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useData } from '@/context/DataContext';
import { UserRole } from '@/types';
import StudentSidebar from '@/components/layout/StudentSidebar';
import Header from '@/components/layout/Header';

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentUser } = useData();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !currentUser) {
      router.push('/student/login');
    } else if (mounted && currentUser?.role !== 'STUDENT') {
      // Redirect to appropriate portal based on role
      router.push(`/${currentUser?.role.toLowerCase()}/dashboard`);
    }
  }, [currentUser, mounted, router]);

  if (!mounted || !currentUser || currentUser.role !== 'STUDENT') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <StudentSidebar />
      
      <main className="flex-1 overflow-y-auto">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
