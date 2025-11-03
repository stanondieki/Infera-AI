"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, Briefcase, DollarSign, FileText } from 'lucide-react';
import { getApplications } from '../utils/applications';
import { getUsers, User } from '../utils/users';
import { getTasks, Task } from '../utils/tasks';
import { getPayments, Payment } from '../utils/payments';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { UserManagement } from './admin/UserManagement';
import { TaskManagement } from './admin/TaskManagement';
import { PaymentTracking } from './admin/PaymentTracking';
import { ApplicationsList } from './admin/ApplicationsList';

interface ApplicationsAdminProps {
  onBack: () => void;
}

export function ApplicationsAdmin({ onBack }: ApplicationsAdminProps) {
  const [applications, setApplications] = useState([]);
  const [users, setUsers] = useState<User[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('applications');

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    await Promise.all([
      loadApplications(),
      loadUsers(),
      loadTasks(),
      loadPayments(),
    ]);
    setLoading(false);
  };

  const loadApplications = async () => {
    try {
      const data = await getApplications();
      setApplications(data.applications);
    } catch (error) {
      console.error('Error loading applications:', error);
    }
  };

  const loadUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const loadTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const loadPayments = async () => {
    try {
      const data = await getPayments();
      setPayments(data);
    } catch (error) {
      console.error('Error loading payments:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
              >
                <ArrowLeft className="h-5 w-5" />
                Back
              </button>
              <div>
                <h1 className="text-gray-900">Admin Panel</h1>
                <p className="text-gray-600">Manage users, tasks, and payments</p>
              </div>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200"
            >
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <span className="text-blue-900">Applications</span>
              </div>
              <p className="text-blue-900">{applications.length}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200"
            >
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-5 w-5 text-purple-600" />
                <span className="text-purple-900">Active Users</span>
              </div>
              <p className="text-purple-900">{users.filter(u => u.status === 'active').length}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200"
            >
              <div className="flex items-center gap-2 mb-2">
                <Briefcase className="h-5 w-5 text-green-600" />
                <span className="text-green-900">Active Tasks</span>
              </div>
              <p className="text-green-900">
                {tasks.filter(t => ['pending', 'in_progress'].includes(t.status)).length}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200"
            >
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-5 w-5 text-orange-600" />
                <span className="text-orange-900">Total Paid</span>
              </div>
              <p className="text-orange-900">
                ${payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0).toFixed(2)}
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="applications" className="gap-2">
              <FileText className="h-4 w-4" />
              Applications
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="tasks" className="gap-2">
              <Briefcase className="h-4 w-4" />
              Tasks
            </TabsTrigger>
            <TabsTrigger value="payments" className="gap-2">
              <DollarSign className="h-4 w-4" />
              Payments
            </TabsTrigger>
          </TabsList>

          <TabsContent value="applications">
            <ApplicationsList applications={applications} onRefresh={loadApplications} />
          </TabsContent>

          <TabsContent value="users">
            <UserManagement users={users} onRefresh={loadUsers} />
          </TabsContent>

          <TabsContent value="tasks">
            <TaskManagement tasks={tasks} users={users} onRefresh={loadTasks} />
          </TabsContent>

          <TabsContent value="payments">
            <PaymentTracking payments={payments} users={users} onRefresh={loadPayments} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
