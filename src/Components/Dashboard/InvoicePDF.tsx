export type Invoice = {
  quotationNumber: string;
  quotationDate: string;
  companyName: string;
  companyAddress: string | null;
  companyPhone: string | null;
  companyEmail: string | null;
  customerName: string;
  customerCompany: string | null;
  customerAddress: string | null;
  customerPhone: string | null;
  customerEmail: string | null;
  subtotal: number;
  discountPercent: number;
  discountAmount: number;
  taxPercent: number;
  taxAmount: number;
  grandTotal: number;
  items: Array<{ id: string; serviceName: string; description: string | null; quantity: number; price: number; total: number }>;
};

export default function InvoicePDF({ invoice }: Readonly<{ invoice: Invoice }>) {
  const money = (value: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(value);
  const date = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(invoice.quotationDate));

  return (
    <div id="invoice-pdf" style={{ width: "794px", minHeight: "1123px", boxSizing: "border-box", background: "#fff", color: "#1e293b", fontFamily: "Arial, sans-serif", padding: "48px 56px", borderTop: "8px solid #4f46e5" }}>
      <header style={{ display: "flex", justifyContent: "space-between", borderBottom: "2px solid #e2e8f0", paddingBottom: "28px" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "28px", color: "#0f172a" }}>{invoice.companyName}</h1>
          <p style={{ color: "#64748b", lineHeight: 1.6, fontSize: "13px" }}>{[invoice.companyAddress, invoice.companyPhone, invoice.companyEmail].filter(Boolean).join("\n")}</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <h2 style={{ margin: 0, color: "#4f46e5", fontSize: "36px", letterSpacing: "2px" }}>INVOICE</h2>
          <p style={{ margin: "12px 0 0", fontSize: "13px" }}><strong>Invoice No:</strong> INV-{invoice.quotationNumber}</p>
          <p style={{ margin: "6px 0 0", fontSize: "13px" }}><strong>Issue Date:</strong> {date}</p>
        </div>
      </header>

      <section style={{ margin: "36px 0" }}>
        <p style={{ margin: 0, color: "#64748b", fontSize: "12px", fontWeight: 700, letterSpacing: "1px" }}>BILL TO</p>
        <h3 style={{ margin: "10px 0 4px", fontSize: "18px" }}>{invoice.customerCompany || invoice.customerName}</h3>
        {invoice.customerCompany && <p style={{ margin: "0 0 6px", fontSize: "14px" }}>Attn: {invoice.customerName}</p>}
        <p style={{ margin: 0, color: "#475569", lineHeight: 1.6, fontSize: "13px" }}>{[invoice.customerAddress, invoice.customerPhone, invoice.customerEmail].filter(Boolean).join("\n")}</p>
      </section>

      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
        <thead><tr style={{ background: "#312e81", color: "#fff" }}><th style={{ padding: "13px", textAlign: "left" }}>Description</th><th style={{ padding: "13px", textAlign: "center" }}>Qty</th><th style={{ padding: "13px", textAlign: "right" }}>Rate</th><th style={{ padding: "13px", textAlign: "right" }}>Amount</th></tr></thead>
        <tbody>{invoice.items.map((item, index) => <tr key={item.id} style={{ background: index % 2 ? "#f8fafc" : "#fff", borderBottom: "1px solid #e2e8f0" }}><td style={{ padding: "14px" }}><strong>{item.serviceName}</strong>{item.description && <div style={{ marginTop: "4px", color: "#64748b", fontSize: "11px" }}>{item.description}</div>}</td><td style={{ padding: "14px", textAlign: "center" }}>{item.quantity}</td><td style={{ padding: "14px", textAlign: "right" }}>{money(item.price)}</td><td style={{ padding: "14px", textAlign: "right", fontWeight: 700 }}>{money(item.total)}</td></tr>)}</tbody>
      </table>

      <section style={{ display: "flex", justifyContent: "flex-end", marginTop: "32px" }}><table style={{ width: "300px", borderCollapse: "collapse", fontSize: "14px" }}><tbody><tr><td style={{ padding: "8px" }}>Subtotal</td><td style={{ padding: "8px", textAlign: "right" }}>{money(invoice.subtotal)}</td></tr>{invoice.discountAmount > 0 && <tr><td style={{ padding: "8px", color: "#dc2626" }}>Discount ({invoice.discountPercent}%)</td><td style={{ padding: "8px", textAlign: "right", color: "#dc2626" }}>-{money(invoice.discountAmount)}</td></tr>}{invoice.taxAmount > 0 && <tr><td style={{ padding: "8px" }}>Tax ({invoice.taxPercent}%)</td><td style={{ padding: "8px", textAlign: "right" }}>{money(invoice.taxAmount)}</td></tr>}<tr style={{ background: "#4f46e5", color: "#fff" }}><td style={{ padding: "14px", fontWeight: 700 }}>Total Due</td><td style={{ padding: "14px", textAlign: "right", fontWeight: 700, fontSize: "18px" }}>{money(invoice.grandTotal)}</td></tr></tbody></table></section>
      <footer style={{ marginTop: "90px", borderTop: "1px solid #e2e8f0", paddingTop: "18px", color: "#64748b", fontSize: "12px" }}>Thank you for your business.</footer>
    </div>
  );
}
