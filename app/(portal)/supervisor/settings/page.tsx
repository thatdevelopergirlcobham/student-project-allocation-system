'use client';

import { useState } from 'react';
import { useData } from '@/context/DataContext';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, Bell, Mail, Calendar, User, Lock } from 'lucide-react';

export default function SupervisorSettingsPage() {
  const { currentUser } = useData();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    projectAlerts: true,
    weeklyDigest: true,
    studentApplicationAlerts: true,
    reportSubmissionAlerts: true,
    meetingReminders: true,
  });
  
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    officeHours: currentUser?.officeHours || 'Monday 2:00 PM - 4:00 PM, Wednesday 10:00 AM - 12:00 PM',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [activeTab, setActiveTab] = useState('notifications');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState({ message: '', type: '' });

  const handleSettingChange = (setting: string) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof settings],
    }));  
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data based on active tab
    if (activeTab === 'security') {
      if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
        setSaveMessage({ message: 'New passwords do not match', type: 'error' });
        return;
      }
      
      if (formData.newPassword && formData.newPassword.length < 8) {
        setSaveMessage({ message: 'Password must be at least 8 characters long', type: 'error' });
        return;
      }
    }
    
    setIsSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would update the user's settings via an API
      console.log('Saving settings:', { settings, formData });
      
      setSaveMessage({ 
        message: 'Settings saved successfully!', 
        type: 'success' 
      });
      
      // Clear password fields if on security tab
      if (activeTab === 'security') {
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveMessage({ 
        message: 'Failed to save settings. Please try again.', 
        type: 'error' 
      });
    } finally {
      setIsSaving(false);
      
      // Clear success message after 3 seconds
      if (saveMessage.type === 'success') {
        setTimeout(() => {
          setSaveMessage({ message: '', type: '' });
        }, 3000);
      }
    }
  };

  return (
    <div className="py-6">
      <div className="px-4 sm:px-6 md:px-0">
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="mt-8">
        <div className="md:grid md:grid-cols-12 md:gap-6">
          {/* Sidebar navigation */}
          <div className="md:col-span-3">
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('notifications')}
                className={`${
                  activeTab === 'notifications'
                    ? 'bg-blue-50 border-blue-500 text-blue-700 hover:bg-blue-50 hover:text-blue-700'
                    : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                } group w-full flex items-center px-3 py-2 text-sm font-medium border-l-4`}
              >
                <Bell className={`${
                  activeTab === 'notifications' ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                } mr-3 h-5 w-5`} />
                Notifications
              </button>
              
              <button
                onClick={() => setActiveTab('profile')}
                className={`${
                  activeTab === 'profile'
                    ? 'bg-blue-50 border-blue-500 text-blue-700 hover:bg-blue-50 hover:text-blue-700'
                    : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                } group w-full flex items-center px-3 py-2 text-sm font-medium border-l-4`}
              >
                <User className={`${
                  activeTab === 'profile' ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                } mr-3 h-5 w-5`} />
                Profile
              </button>
              
              <button
                onClick={() => setActiveTab('availability')}
                className={`${
                  activeTab === 'availability'
                    ? 'bg-blue-50 border-blue-500 text-blue-700 hover:bg-blue-50 hover:text-blue-700'
                    : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                } group w-full flex items-center px-3 py-2 text-sm font-medium border-l-4`}
              >
                <Calendar className={`${
                  activeTab === 'availability' ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                } mr-3 h-5 w-5`} />
                Availability
              </button>
              
              <button
                onClick={() => setActiveTab('security')}
                className={`${
                  activeTab === 'security'
                    ? 'bg-blue-50 border-blue-500 text-blue-700 hover:bg-blue-50 hover:text-blue-700'
                    : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                } group w-full flex items-center px-3 py-2 text-sm font-medium border-l-4`}
              >
                <Lock className={`${
                  activeTab === 'security' ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                } mr-3 h-5 w-5`} />
                Security
              </button>
            </nav>
          </div>

          {/* Main content */}
          <div className="mt-5 md:col-span-9 md:mt-0">
            <form onSubmit={handleSubmit}>
              <div className="shadow sm:overflow-hidden sm:rounded-md">
                <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
                  {saveMessage.message && (
                    <div className={`rounded-md p-4 ${saveMessage.type === 'error' ? 'bg-red-50' : 'bg-green-50'}`}>
                      <div className="flex">
                        <div className="flex-shrink-0">
                          {saveMessage.type === 'error' ? (
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <div className="ml-3">
                          <p className={`text-sm font-medium ${saveMessage.type === 'error' ? 'text-red-800' : 'text-green-800'}`}>
                            {saveMessage.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'notifications' && (
                    <div>
                      <h3 className="text-lg font-medium leading-6 text-gray-900">Notification Preferences</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Manage how you receive notifications.
                      </p>
                      
                      <div className="mt-6 space-y-5">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
                            <p className="text-sm text-gray-500">Receive email notifications about important updates.</p>
                          </div>
                          <Switch
                            checked={settings.emailNotifications}
                            onCheckedChange={() => handleSettingChange('emailNotifications')}
                          />
                        </div>

                        <div className="flex items-center justify-between pt-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">Project Alerts</h4>
                            <p className="text-sm text-gray-500">Get notified about new project applications and updates.</p>
                          </div>
                          <Switch
                            checked={settings.projectAlerts}
                            onCheckedChange={() => handleSettingChange('projectAlerts')}
                          />
                        </div>

                        <div className="flex items-center justify-between pt-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">Weekly Digest</h4>
                            <p className="text-sm text-gray-500">Receive a weekly summary of activities and updates.</p>
                          </div>
                          <Switch
                            checked={settings.weeklyDigest}
                            onCheckedChange={() => handleSettingChange('weeklyDigest')}
                          />
                        </div>

                        <div className="flex items-center justify-between pt-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">Student Application Alerts</h4>
                            <p className="text-sm text-gray-500">Get notified when students apply to your projects.</p>
                          </div>
                          <Switch
                            checked={settings.studentApplicationAlerts}
                            onCheckedChange={() => handleSettingChange('studentApplicationAlerts')}
                          />
                        </div>

                        <div className="flex items-center justify-between pt-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">Report Submission Alerts</h4>
                            <p className="text-sm text-gray-500">Get notified when students submit progress reports.</p>
                          </div>
                          <Switch
                            checked={settings.reportSubmissionAlerts}
                            onCheckedChange={() => handleSettingChange('reportSubmissionAlerts')}
                          />
                        </div>

                        <div className="flex items-center justify-between pt-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">Meeting Reminders</h4>
                            <p className="text-sm text-gray-500">Receive reminders for scheduled meetings with students.</p>
                          </div>
                          <Switch
                            checked={settings.meetingReminders}
                            onCheckedChange={() => handleSettingChange('meetingReminders')}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'profile' && (
                    <div className="space-y-6">
                      <div>
                            <h3 className="text-lg font-medium leading-6 text-gray-900">Profile Information</h3>
                            <p className="mt-1 text-sm text-gray-500">
                              Update your personal information and contact details.
                            </p>
                          </div>
                          
                          <div className="grid grid-cols-6 gap-6">
                            <div className="col-span-6 sm:col-span-3">
                              <Label htmlFor="name">Full Name</Label>
                              <Input
                                type="text"
                                name="name"
                                id="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="mt-1"
                              />
                            </div>

                            <div className="col-span-6 sm:col-span-3">
                              <Label htmlFor="email">Email Address</Label>
                              <Input
                                type="email"
                                name="email"
                                id="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="mt-1"
                                disabled
                              />
                              <p className="mt-1 text-xs text-gray-500">
                                Contact the administrator to change your email address.
                              </p>
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">Contact Information</h3>
                            <p className="mt-1 text-sm text-gray-500">
                              Update your office location, phone number, and other contact details.
                            </p>
                          </div>
                          
                          <div className="grid grid-cols-6 gap-6">
                            <div className="col-span-6 sm:col-span-3">
                              <Label htmlFor="officeHours">Office Hours</Label>
                              <Input
                                type="text"
                                name="officeHours"
                                id="officeHours"
                                value={formData.officeHours}
                                onChange={handleInputChange}
                                className="mt-1"
                                placeholder="e.g., Monday 2:00 PM - 4:00 PM, Wednesday 10:00 AM - 12:00 PM"
                              />
                              <p className="mt-1 text-xs text-gray-500">
                                This information will be visible to students.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {activeTab === 'availability' && (
                        <div>
                          <h3 className="text-lg font-medium leading-6 text-gray-900">Availability</h3>
                          <p className="mt-1 text-sm text-gray-500">
                            Set your availability for student meetings and office hours.
                          </p>
                          
                          <div className="mt-6">
                            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                              <p className="text-sm text-gray-600">
                                Coming soon: Interactive calendar to set your weekly availability.
                              </p>
                              <p className="mt-2 text-sm text-gray-500">
                                For now, please specify your office hours in your profile information.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {activeTab === 'security' && (
                        <div>
                          <h3 className="text-lg font-medium leading-6 text-gray-900">Change Password</h3>
                          <p className="mt-1 text-sm text-gray-500">
                            Update your password to keep your account secure.
                          </p>
                          
                          <div className="mt-6 space-y-4">
                            <div>
                              <Label htmlFor="currentPassword">Current Password</Label>
                              <Input
                                type="password"
                                name="currentPassword"
                                id="currentPassword"
                                value={formData.currentPassword}
                                onChange={handleInputChange}
                                className="mt-1"
                                placeholder="Enter your current password"
                              />
                            </div>
                            
                            <div>
                              <Label htmlFor="newPassword">New Password</Label>
                              <Input
                                type="password"
                                name="newPassword"
                                id="newPassword"
                                value={formData.newPassword}
                                onChange={handleInputChange}
                                className="mt-1"
                                placeholder="Enter your new password"
                              />
                              <p className="mt-1 text-xs text-gray-500">
                                Password must be at least 8 characters long.
                              </p>
                            </div>
                            
                            <div>
                              <Label htmlFor="confirmPassword">Confirm New Password</Label>
                              <Input
                                type="password"
                                name="confirmPassword"
                                id="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                className="mt-1"
                                placeholder="Confirm your new password"
                              />
                            </div>
                            
                            <div className="pt-4">
                              <h4 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h4>
                              <p className="mt-1 text-sm text-gray-500">
                                Add an extra layer of security to your account.
                              </p>
                              <div className="mt-4">
                                <button
                                  type="button"
                                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                  Set up two-factor authentication
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                      <Button type="submit" disabled={isSaving}>
                        {isSaving ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="-ml-1 mr-2 h-4 w-4" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      );
    }
