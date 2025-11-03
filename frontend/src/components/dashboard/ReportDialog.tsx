import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { useState } from 'react';
import { Download, FileText, Calendar as CalendarIcon, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent } from '../ui/card';

interface ReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReportDialog({ open, onOpenChange }: ReportDialogProps) {
  const [reportType, setReportType] = useState('comprehensive');
  const [timeRange, setTimeRange] = useState('last-month');
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeDetails, setIncludeDetails] = useState(true);

  const handleDownload = () => {
    toast.success('Generating your report...', {
      description: 'Your download will begin shortly',
    });
    
    // Simulate download
    setTimeout(() => {
      toast.success('Report downloaded successfully!', {
        description: 'Check your downloads folder',
      });
      onOpenChange(false);
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Download Performance Report
          </DialogTitle>
          <DialogDescription>
            Generate a detailed PDF report of your performance and earnings
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Report Type</Label>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="comprehensive">Comprehensive Report</SelectItem>
                <SelectItem value="earnings">Earnings Only</SelectItem>
                <SelectItem value="performance">Performance Only</SelectItem>
                <SelectItem value="projects">Projects Summary</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Time Range</Label>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="this-month">This Month</SelectItem>
                <SelectItem value="last-month">Last Month</SelectItem>
                <SelectItem value="last-3-months">Last 3 Months</SelectItem>
                <SelectItem value="last-6-months">Last 6 Months</SelectItem>
                <SelectItem value="this-year">This Year</SelectItem>
                <SelectItem value="all-time">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Include in Report</Label>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Checkbox 
                  id="charts" 
                  checked={includeCharts} 
                  onCheckedChange={(checked) => setIncludeCharts(checked as boolean)}
                />
                <label htmlFor="charts" className="text-sm">
                  Charts and Visualizations
                </label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox 
                  id="details" 
                  checked={includeDetails} 
                  onCheckedChange={(checked) => setIncludeDetails(checked as boolean)}
                />
                <label htmlFor="details" className="text-sm">
                  Detailed Breakdown
                </label>
              </div>
            </div>
          </div>

          <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 text-sm">
                <TrendingUp className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-gray-900">Report Preview</p>
                  <p className="text-xs text-gray-600">
                    Your {reportType} report will include data from {timeRange.replace('-', ' ')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button 
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 gap-2"
              onClick={handleDownload}
            >
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
