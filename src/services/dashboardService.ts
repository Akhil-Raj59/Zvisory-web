import {
  MOCK_CUSTOMER_DASHBOARD,
  MOCK_EMPLOYEE_DASHBOARD,
  MOCK_ADMIN_DASHBOARD,
  CustomerDashboardData,
  EmployeeDashboardData,
  AdminDashboardData
} from "@/mock/dashboards";

export const dashboardService = {
  async getCustomerData(): Promise<CustomerDashboardData> {
    return MOCK_CUSTOMER_DASHBOARD;
  },

  async getEmployeeData(): Promise<EmployeeDashboardData> {
    return MOCK_EMPLOYEE_DASHBOARD;
  },

  async getAdminData(): Promise<AdminDashboardData> {
    return MOCK_ADMIN_DASHBOARD;
  }
};
