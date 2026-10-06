export interface EmiCalculationResult {
  monthlyEmi: number;
  totalInterest: number;
  totalPayment: number;
}

export const loanService = {
  calculateEmi(loanAmount: number, interestRateAnnual: number, tenureYears: number): EmiCalculationResult {
    const P = Math.max(100000, loanAmount);
    const r = Math.max(0.1, interestRateAnnual) / 12 / 100;
    const n = Math.max(1, tenureYears) * 12;

    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - P;

    return {
      monthlyEmi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalPayment: Math.round(totalPayment)
    };
  }
};
