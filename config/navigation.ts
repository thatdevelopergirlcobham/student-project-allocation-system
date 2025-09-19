import {
  Home,
  BookOpen,
  Users,
  FileText,
  MessageSquare,
  Settings,
  BarChart2,
  UserPlus
} from 'lucide-react';

export const navigationConfig = {
  student: [
    { name: 'Dashboard', href: '/student/dashboard', icon: Home },
    { name: 'My Project', href: '/student/project', icon: BookOpen },
    { name: 'Progress Reports', href: '/student/reports', icon: FileText },
    { name: 'Messages', href: '/student/messages', icon: MessageSquare },
    { name: 'Settings', href: '/student/settings', icon: Settings },
  ],
  supervisor: [
    { name: 'Dashboard', href: '/supervisor/dashboard', icon: Home },
    { name: 'Projects', href: '/supervisor/projects', icon: BookOpen },
    { name: 'Students', href: '/supervisor/students', icon: Users },
    { name: 'Review Submissions', href: '/supervisor/review-submissions', icon: FileText },
    { name: 'Messages', href: '/supervisor/messages', icon: MessageSquare },
    { name: 'Settings', href: '/supervisor/settings', icon: Settings },
  ],
  admin: [
    { name: 'Dashboard', href: '/admin/dashboard', icon: Home },
    { name: 'Manage Users', href: '/admin/users', icon: Users },
    { name: 'Projects', href: '/admin/projects', icon: BookOpen },
    { name: 'Allocations', href: '/admin/allocations', icon: BarChart2 },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ],
};

export const quickActionsConfig = {
  student: [],
  supervisor: [],
  admin: [
    { name: 'Add New User', href: '/admin/users/new', icon: UserPlus },
    { name: 'Add New Project', href: '/admin/projects/new', icon: BookOpen },
  ],
};
