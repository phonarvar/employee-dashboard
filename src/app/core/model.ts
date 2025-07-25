export interface Department {
  id: string;
  name: string;
  head: string; // Manager's name
  employeeCount: number;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
}
