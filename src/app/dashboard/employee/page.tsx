import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { dashboardService } from "@/services/dashboardService";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default async function EmployeeDashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?from=employee_dashboard");
  }

  const role = (user.role || "").toUpperCase();
  if (role !== "EMPLOYEE" && role !== "ADMIN") {
    redirect("/dashboard/customer");
  }

  const data = await dashboardService.getEmployeeData();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Header user={user} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Top Header */}
        <div className="bg-[#124446] text-white p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#D3A479]">
              Advisor &amp; Employee Desk
            </span>
            <h1 className="text-2xl sm:text-4xl font-black mt-1">
              Advisor Dashboard ({user.fullName})
            </h1>
            <p className="text-xs sm:text-sm text-[#BDD4E7] mt-1">
              Manage assigned client leads, site visit schedules, and property enquiries.
            </p>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase">Assigned Leads</span>
            <div className="text-3xl font-black text-[#124446]">{data.assignedLeadsCount}</div>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase">Pending Callbacks</span>
            <div className="text-3xl font-black text-amber-600">{data.pendingCallbacksCount}</div>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase">Site Visits Done</span>
            <div className="text-3xl font-black text-[#124446]">{data.siteVisitsCompleted}</div>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase">Closed This Month</span>
            <div className="text-3xl font-black text-emerald-600">{data.dealsClosedThisMonth}</div>
          </div>
        </div>

        {/* Lead Management Table */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#124446]">Active Client Leads &amp; Enquiries</h2>
            <span className="text-xs font-bold text-slate-500">Live CRM Data</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b">
                <tr>
                  <th className="p-3">Client Name</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Interested In</th>
                  <th className="p-3">Budget</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Last Contact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 font-bold text-slate-900">{lead.clientName}</td>
                    <td className="p-3 text-slate-600">{lead.phone}</td>
                    <td className="p-3 font-medium text-slate-800">{lead.interestedIn}</td>
                    <td className="p-3 font-bold text-[#124446]">{lead.budget}</td>
                    <td className="p-3">
                      <span className="px-2.5 py-1 rounded-full bg-[#BDD4E7]/40 text-[#124446] font-bold text-[10px]">
                        {lead.status}
                      </span>
                    </td>
                    <td className="p-3 text-slate-400">{lead.lastContact}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
