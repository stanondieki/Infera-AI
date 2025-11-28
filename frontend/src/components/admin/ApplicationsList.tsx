import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Download, Clock, CheckCircle, XCircle, FileText } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { toast } from 'sonner';

interface Application {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  expertise: string;
  experience: string;
  education: string;
  currentRole: string;
  skills: string[];
  availability: string;
  hoursPerWeek: string;
  bio: string;
  linkedIn: string;
  portfolio: string;
  status: 'pending' | 'reviewing' | 'accepted' | 'rejected';
  submittedDate: string;
}

interface ApplicationsListProps {
  applications: Application[];
  onRefresh: () => void;
}

export function ApplicationsList({ applications, onRefresh }: ApplicationsListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);

  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      (app.firstName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (app.lastName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (app.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (app.expertise?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'reviewing':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'accepted':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'reviewing':
        return <Search className="h-4 w-4" />;
      case 'accepted':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Country', 'Expertise', 'Experience', 'Status', 'Submitted'];
    const rows = filteredApplications.map(app => [
      `${app.firstName} ${app.lastName}`,
      app.email,
      app.phone,
      app.country,
      app.expertise,
      app.experience,
      app.status,
      new Date(app.submittedDate).toLocaleDateString()
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `applications-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Applications exported successfully');
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search by name, email, or expertise..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Applications</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="reviewing">Reviewing</SelectItem>
            <SelectItem value="accepted">Accepted</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={exportToCSV} variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Applications List */}
      {filteredApplications.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No applications found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((application, index) => (
            <motion.div
              key={application.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white p-6 rounded-lg border hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedApplication(application)}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-gray-900">
                      {application.firstName} {application.lastName}
                    </h3>
                    <Badge className={getStatusColor(application.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(application.status)}
                        <span className="capitalize">{application.status}</span>
                      </div>
                    </Badge>
                  </div>
                  <div className="grid md:grid-cols-2 gap-2 text-gray-600">
                    <p>📧 {application.email}</p>
                    <p>📱 {application.phone}</p>
                    <p>🌍 {application.country}</p>
                    <p>💼 {application.expertise}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-gray-500">
                    {new Date(application.submittedDate).toLocaleDateString()}
                  </p>
                  <p className="text-gray-400">
                    {new Date(application.submittedDate).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Application Details Dialog */}
      <Dialog open={!!selectedApplication} onOpenChange={() => setSelectedApplication(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          {selectedApplication && (
            <>
              <DialogHeader>
                <DialogTitle className="text-gray-900">
                  {selectedApplication.firstName} {selectedApplication.lastName}
                </DialogTitle>
                <DialogDescription>
                  Applied on {new Date(selectedApplication.submittedDate).toLocaleDateString()}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(selectedApplication.status)}>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(selectedApplication.status)}
                      <span className="capitalize">{selectedApplication.status}</span>
                    </div>
                  </Badge>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-gray-900 mb-2">Contact Information</h4>
                    <div className="space-y-2 text-gray-600">
                      <p><strong>Email:</strong> {selectedApplication.email}</p>
                      <p><strong>Phone:</strong> {selectedApplication.phone}</p>
                      <p><strong>Country:</strong> {selectedApplication.country}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-gray-900 mb-2">Professional Info</h4>
                    <div className="space-y-2 text-gray-600">
                      <p><strong>Expertise:</strong> {selectedApplication.expertise}</p>
                      <p><strong>Experience:</strong> {selectedApplication.experience}</p>
                      <p><strong>Current Role:</strong> {selectedApplication.currentRole}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-gray-900 mb-2">Education</h4>
                  <p className="text-gray-600">{selectedApplication.education}</p>
                </div>

                <div>
                  <h4 className="text-gray-900 mb-2">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedApplication.skills.map((skill, index) => (
                      <Badge key={index} variant="outline">{skill}</Badge>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-gray-900 mb-2">Availability</h4>
                    <p className="text-gray-600">{selectedApplication.availability}</p>
                  </div>
                  <div>
                    <h4 className="text-gray-900 mb-2">Hours Per Week</h4>
                    <p className="text-gray-600">{selectedApplication.hoursPerWeek}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-gray-900 mb-2">Bio</h4>
                  <p className="text-gray-600">{selectedApplication.bio}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {selectedApplication.linkedIn && (
                    <div>
                      <h4 className="text-gray-900 mb-2">LinkedIn</h4>
                      <a
                        href={selectedApplication.linkedIn}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {selectedApplication.linkedIn}
                      </a>
                    </div>
                  )}
                  {selectedApplication.portfolio && (
                    <div>
                      <h4 className="text-gray-900 mb-2">Portfolio</h4>
                      <a
                        href={selectedApplication.portfolio}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {selectedApplication.portfolio}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
