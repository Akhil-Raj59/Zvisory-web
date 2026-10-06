export function WhyChooseUs() {
  const benefits = [
    {
      icon: "🛡️",
      title: "Verified Listings Only",
      description: "Every listed project undergoes strict RERA verification, legal deed checking, and developer background auditing."
    },
    {
      icon: "📊",
      title: "Unbiased Comparative Analytics",
      description: "We compare properties on 15+ parameters including price per sq.ft., appreciation history, and possession timelines."
    },
    {
      icon: "🏦",
      title: "End-to-End Home Loan Support",
      description: "Our dedicated loan advisors compare 6+ top banks to secure lowest interest rates with zero processing markup."
    },
    {
      icon: "🤝",
      title: "Zero Brokerage Model",
      description: "Direct advisory from developer partners ensures you get official launch prices with zero hidden charges."
    }
  ];

  return (
    <section className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#D3A479]">
            The Zvisory Advantage
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-[#124446] tracking-tight mt-1">
            Why Choose Zvisory Advisory
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            We put data, transparency, and client interest at the core of real estate buying.
          </p>
        </div>

        {/* Section 1.4 Grid (3-4 columns, icons above text, stacks vertically on mobile) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-[#124446]/30 hover:shadow-lg transition-all duration-300 space-y-3"
            >
              <div className="w-12 h-12 rounded-xl bg-[#BDD4E7]/40 flex items-center justify-center text-2xl shadow-inner">
                {benefit.icon}
              </div>
              <h3 className="font-bold text-slate-900 text-lg">
                {benefit.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
