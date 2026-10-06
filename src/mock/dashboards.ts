export interface CustomerDashboardData {
  savedPropertiesCount: number;
  activeEnquiriesCount: number;
  loanCalculationsCount: number;
  scheduledVisitsCount: number;
  recentEnquiries: Array<{
    id: string;
    propertyName: string;
    date: string;
    status: "Pending Callback" | "Site Visit Scheduled" | "Under Review" | "Completed";
  }>;
  savedProperties: Array<{
    id: string;
    propertyName: string;
    location: string;
    price: string;
    image: string;
  }>;
}

export interface EmployeeDashboardData {
  assignedLeadsCount: number;
  pendingCallbacksCount: number;
  siteVisitsCompleted: number;
  dealsClosedThisMonth: number;
  leads: Array<{
    id: string;
    clientName: string;
    phone: string;
    interestedIn: string;
    budget: string;
    status: "New Lead" | "Contacted" | "Site Visit Scheduled" | "Negotiation" | "Closed";
    lastContact: string;
  }>;
}

export interface AdminDashboardData {
  totalUsers: number;
  activeCustomers: number;
  totalEmployees: number;
  pendingPropertyApprovals: number;
  monthlyLeadCount: number;
  systemHealth: string;
  userDistribution: {
    customers: number;
    employees: number;
    admins: number;
  };
  recentActivities: Array<{
    id: string;
    user: string;
    action: string;
    timestamp: string;
  }>;
}

export const MOCK_CUSTOMER_DASHBOARD: CustomerDashboardData = {
  savedPropertiesCount: 4,
  activeEnquiriesCount: 2,
  loanCalculationsCount: 3,
  scheduledVisitsCount: 1,
  recentEnquiries: [
    {
      id: "enq-101",
      propertyName: "DLF Midtown Luxury Residences",
      date: "Oct 04, 2026",
      status: "Site Visit Scheduled"
    },
    {
      id: "enq-102",
      propertyName: "M3M Crown Luxury Haven",
      date: "Sep 28, 2026",
      status: "Pending Callback"
    }
  ],
  savedProperties: [
    {
      id: "prop-1",
      propertyName: "DLF Midtown Luxury Residences",
      location: "Moti Nagar, Central Delhi",
      price: "₹ 3.25 Cr - 6.50 Cr",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "prop-2",
      propertyName: "Birla Ojasvi Premium Apartments",
      location: "RR Nagar, Bengaluru",
      price: "₹ 1.45 Cr - 2.80 Cr",
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=400&q=80"
    }
  ]
};

export const MOCK_EMPLOYEE_DASHBOARD: EmployeeDashboardData = {
  assignedLeadsCount: 18,
  pendingCallbacksCount: 5,
  siteVisitsCompleted: 12,
  dealsClosedThisMonth: 3,
  leads: [
    {
      id: "lead-1",
      clientName: "Rahul Kapoor",
      phone: "+91 98765 43210",
      interestedIn: "3 BHK Golf Course Extn",
      budget: "₹ 2.5 - 3.5 Cr",
      status: "Site Visit Scheduled",
      lastContact: "2 hours ago"
    },
    {
      id: "lead-2",
      clientName: "Sunita Reddy",
      phone: "+91 98111 22334",
      interestedIn: "High Rise Central Delhi",
      budget: "₹ 4.0 - 5.0 Cr",
      status: "Contacted",
      lastContact: "Yesterday"
    },
    {
      id: "lead-3",
      clientName: "Amitabh Verma",
      phone: "+91 99000 88776",
      interestedIn: "Home Loan Assistance",
      budget: "₹ 1.5 Cr Loan",
      status: "New Lead",
      lastContact: "3 hours ago"
    }
  ]
};

export const MOCK_ADMIN_DASHBOARD: AdminDashboardData = {
  totalUsers: 1420,
  activeCustomers: 1250,
  totalEmployees: 45,
  pendingPropertyApprovals: 8,
  monthlyLeadCount: 384,
  systemHealth: "100% Operational",
  userDistribution: {
    customers: 1250,
    employees: 45,
    admins: 5
  },
  recentActivities: [
    {
      id: "act-1",
      user: "System Security",
      action: "Database backup completed successfully",
      timestamp: "10 minutes ago"
    },
    {
      id: "act-2",
      user: "Admin (admin@zvisory.com)",
      action: "Approved property listing #GGM-402",
      timestamp: "1 hour ago"
    },
    {
      id: "act-3",
      user: "Employee (suresh@zvisory.com)",
      action: "Updated client status for Lead #104",
      timestamp: "3 hours ago"
    }
  ]
};
