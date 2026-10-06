import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { dashboardService } from "@/services/dashboardService";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default async function CustomerDashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?from=customer_dashboard");
  }

  const role = (user.role || "").toUpperCase();
  if (role !== "CUSTOMER" && role !== "CUSTUMER") {
    if (role === "ADMIN") redirect("/dashboard/admin");
    if (role === "EMPLOYEE") redirect("/dashboard/employee");
  }

  const data = await dashboardService.getCustomerData();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Header user={user} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Top Welcome Header */}
        <div className="bg-[#124446] text-white p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#D3A479]">
              Customer Portal
            </span>
            <h1 className="text-2xl sm:text-4xl font-black mt-1">
              Welcome Back, {user.fullName}!
            </h1>
            <p className="text-xs sm:text-sm text-[#BDD4E7] mt-1">
              Manage your saved luxury properties, active advisory enquiries, and loan calculations.
            </p>
          </div>

          <Link
            href="/search"
            className="px-5 py-3 rounded-xl bg-[#D3A479] text-[#124446] font-bold text-xs uppercase tracking-wider transition-colors shadow-md shrink-0 text-center"
          >
            + Browse Properties
          </Link>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase">Saved Homes</span>
            <div className="text-3xl font-black text-[#124446]">{data.savedPropertiesCount}</div>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase">Active Enquiries</span>
            <div className="text-3xl font-black text-[#124446]">{data.activeEnquiriesCount}</div>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase">Site Visits</span>
            <div className="text-3xl font-black text-[#124446]">{data.scheduledVisitsCount}</div>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase">Loan Estimates</span>
            <div className="text-3xl font-black text-[#124446]">{data.loanCalculationsCount}</div>
          </div>
        </div>

        {/* Dashboard Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Saved Properties */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-bold text-[#124446]">My Shortlisted Residences</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.savedProperties.map((p) => (
                <div key={p.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-3">
                  <img src={p.image} alt={p.propertyName} className="h-36 w-full object-cover rounded-xl" />
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{p.propertyName}</h3>
                    <p className="text-xs text-slate-500">📍 {p.location}</p>
                    <p className="text-xs font-black text-[#124446] mt-1">{p.price}</p>
                  </div>
                  <Link
                    href={`/properties/${p.id}`}
                    className="w-full py-2 rounded-xl bg-slate-100 text-[#124446] text-xs font-bold text-center block hover:bg-[#124446] hover:text-white transition-colors"
                  >
                    View Details →
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Active Enquiries & Callback Log */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#124446]">Advisory Callbacks &amp; Status</h2>
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              {data.recentEnquiries.map((enq) => (
                <div key={enq.id} className="p-3 bg-slate-50 rounded-xl space-y-1 border">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-800">
                    <span className="line-clamp-1">{enq.propertyName}</span>
                    <span className="px-2 py-0.5 rounded bg-[#D3A479]/30 text-[#124446] text-[10px]">
                      {enq.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">Enquiry Date: {enq.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
