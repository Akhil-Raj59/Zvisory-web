import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { dashboardService } from "@/services/dashboardService";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?from=admin_dashboard");
  }

  const role = (user.role || "").toUpperCase();
  if (role !== "ADMIN") {
    if (role === "EMPLOYEE") redirect("/dashboard/employee");
    redirect("/dashboard/customer");
  }

  const data = await dashboardService.getAdminData();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Header user={user} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Top Header */}
        <div className="bg-[#124446] text-white p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#D3A479]">
              System Administration
            </span>
            <h1 className="text-2xl sm:text-4xl font-black mt-1">
              Admin Console ({user.fullName})
            </h1>
            <p className="text-xs sm:text-sm text-[#BDD4E7] mt-1">
              Platform metrics, user distribution, property approval queue, and system activity logs.
            </p>
          </div>
          <div className="px-4 py-2 rounded-xl bg-[#D3A479] text-[#124446] font-bold text-xs">
            Role: Super Admin
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase">Total Users</span>
            <div className="text-3xl font-black text-[#124446]">{data.totalUsers}</div>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase">Active Customers</span>
            <div className="text-3xl font-black text-[#124446]">{data.activeCustomers}</div>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase">Advisors &amp; Staff</span>
            <div className="text-3xl font-black text-[#124446]">{data.totalEmployees}</div>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase">Pending Listings</span>
            <div className="text-3xl font-black text-amber-600">{data.pendingPropertyApprovals}</div>
          </div>
        </div>

        {/* User Distribution & Activity Logs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-bold text-[#124446]">System Activity Log</h2>
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
              {data.recentActivities.map((act) => (
                <div key={act.id} className="p-3 bg-slate-50 rounded-xl flex items-center justify-between border text-xs">
                  <div>
                    <span className="font-bold text-slate-900">{act.user}:</span>{" "}
                    <span className="text-slate-600">{act.action}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0 ml-2">{act.timestamp}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#124446]">User Role Distribution</h2>
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 text-xs">
              <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border">
                <span className="font-bold">Customers</span>
                <span className="font-black text-[#124446] text-base">{data.userDistribution.customers}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border">
                <span className="font-bold">Employees &amp; Staff</span>
                <span className="font-black text-[#124446] text-base">{data.userDistribution.employees}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border">
                <span className="font-bold">Administrators</span>
                <span className="font-black text-[#124446] text-base">{data.userDistribution.admins}</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
