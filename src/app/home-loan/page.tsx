"use client";

import { useState } from "react";
import { loanService } from "@/services/loanService";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function HomeLoanPage() {
  const [loanAmount, setLoanAmount] = useState(5000000); // 50 Lacs
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);

  const [applicantName, setApplicantName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("Gurugram");
  const [submitted, setSubmitted] = useState(false);

  const emiResult = loanService.calculateEmi(loanAmount, interestRate, tenure);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Top Hero Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-[#D3A479] text-[#124446]">
            Zvisory Financial Services
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-[#124446] tracking-tight">
            Home Loan &amp; Mortgage Advisory
          </h1>
          <p className="text-sm text-slate-600">
            Compare rates from 6+ top Indian banks (SBI, HDFC, ICICI, Axis, Kotak, Bank of Baroda). Get pre-approved with zero advisor commission.
          </p>
        </div>

        {/* EMI Calculator Component Card */}
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-lg space-y-8">
          <h2 className="text-xl sm:text-2xl font-bold text-[#124446]">Interactive EMI &amp; Interest Calculator</h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Sliders */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-bold">
                  <span>Required Loan Amount:</span>
                  <span className="text-[#124446] text-base">₹ {(loanAmount / 100000).toFixed(2)} Lacs</span>
                </div>
                <input
                  type="range"
                  min={500000}
                  max={50000000}
                  step={500000}
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full accent-[#124446] h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm font-bold">
                  <span>Interest Rate (% p.a.):</span>
                  <span className="text-[#124446] text-base">{interestRate}%</span>
                </div>
                <input
                  type="range"
                  min={7.5}
                  max={13.0}
                  step={0.1}
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full accent-[#124446] h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm font-bold">
                  <span>Loan Tenure (Years):</span>
                  <span className="text-[#124446] text-base">{tenure} Years</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={30}
                  step={1}
                  value={tenure}
                  onChange={(e) => setTenure(Number(e.target.value))}
                  className="w-full accent-[#124446] h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              {/* Partner Banks Grid */}
              <div className="pt-4 border-t space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Banking Partners</span>
                <div className="flex flex-wrap gap-2 text-xs font-bold text-[#124446]">
                  <span className="px-3 py-1 bg-slate-100 rounded-lg">State Bank of India</span>
                  <span className="px-3 py-1 bg-slate-100 rounded-lg">HDFC Bank</span>
                  <span className="px-3 py-1 bg-slate-100 rounded-lg">ICICI Bank</span>
                  <span className="px-3 py-1 bg-slate-100 rounded-lg">Axis Bank</span>
                  <span className="px-3 py-1 bg-slate-100 rounded-lg">Kotak Mahindra</span>
                </div>
              </div>
            </div>

            {/* Results Box */}
            <div className="p-8 rounded-2xl bg-[#124446] text-white flex flex-col justify-between space-y-6 shadow-md">
              <div className="space-y-2">
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#D3A479]">
                  Monthly Repayment
                </span>
                <div className="text-4xl font-black text-white">
                  ₹ {emiResult.monthlyEmi.toLocaleString("en-IN")}
                </div>
                <p className="text-xs text-[#BDD4E7]">Per month for {tenure * 12} installments</p>
              </div>

              <div className="space-y-3 text-xs border-t border-white/20 pt-4 text-[#BDD4E7]">
                <div className="flex justify-between">
                  <span>Principal Borrowed:</span>
                  <span className="text-white font-bold">₹ {loanAmount.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Interest Payable:</span>
                  <span className="text-[#D3A479] font-bold">₹ {emiResult.totalInterest.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between border-t border-white/10 pt-2 text-sm font-bold text-white">
                  <span>Total Amount Payable:</span>
                  <span>₹ {emiResult.totalPayment.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Application Form Card */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm max-w-2xl mx-auto space-y-4">
          <div className="text-center space-y-1">
            <h3 className="text-xl font-bold text-slate-900">Apply for Home Loan Sanction Letter</h3>
            <p className="text-xs text-slate-500">Free door-step document pickup and instant pre-eligibility check.</p>
          </div>

          {submitted ? (
            <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl text-center text-xs font-bold">
              ✓ Application submitted successfully! A home loan advisor will call you shortly.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <input
                type="text"
                required
                value={applicantName}
                onChange={(e) => setApplicantName(e.target.value)}
                placeholder="Full Name as per PAN Card *"
                className="w-full p-3 rounded-xl border text-slate-900"
              />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Mobile Number *"
                className="w-full p-3 rounded-xl border text-slate-900"
              />
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full p-3 rounded-xl border bg-white text-slate-900"
              >
                <option value="Gurugram">Gurugram</option>
                <option value="Delhi">Delhi NCR</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Noida">Noida</option>
                <option value="Mumbai">Mumbai</option>
              </select>
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#D3A479] hover:bg-[#b88c63] text-[#124446] font-bold text-xs uppercase tracking-wider shadow-md"
              >
                Request Pre-Approved Sanction →
              </button>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
