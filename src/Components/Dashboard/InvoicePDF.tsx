export type Invoice = {
  quotationNumber: string;
  quotationDate: string;
  companyName: string;
  companyAddress: string | null;
  companyPhone: string | null;
  companyEmail: string | null;
  companyGst: string | null;
  companyPan: string | null;
  customerName: string;
  customerCompany: string | null;
  customerAddress: string | null;
  customerPhone: string | null;
  customerEmail: string | null;
  termsAndConditions: string | null;
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
    <div
      id="invoice-pdf"
      style={{
        width: "794px",
        minHeight: "1123px",
        margin: "0 auto",
        backgroundColor: "#ffffff",
        color: "#1e293b",
        fontFamily: '"Inter", "Arial", sans-serif',
        boxSizing: "border-box",
        padding: "0",
        position: "relative",
      }}
    >
      {/* Top Accent Bar */}
      <div style={{ height: "8px", width: "100%", backgroundColor: "#4f46e5" }} />

      <div style={{ padding: "50px 60px" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "40px" }}>
            <div>
                <h1 style={{ margin: 0, fontSize: "32px", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.5px" }}>
                    {invoice.companyName || "YOUR COMPANY"}
                </h1>
                <p style={{ margin: "4px 0 0", fontSize: "11px", color: "#64748b", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 600 }}>
                    {invoice.companyEmail} {invoice.companyPhone && `| ${invoice.companyPhone}`}
                </p>
            </div>
            <div style={{ textAlign: "right" }}>
                <h2 style={{ margin: 0, fontSize: "36px", fontWeight: 900, color: "#e2e8f0", letterSpacing: "2px", textTransform: "uppercase" }}>
                    INVOICE
                </h2>
                <div style={{ marginTop: "8px", fontSize: "14px", fontWeight: 600, color: "#4f46e5" }}>
                    # INV-{invoice.quotationNumber.padStart(6, '0')}
                </div>
            </div>
        </div>

        {/* Meta & Addresses */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "40px" }}>
            {/* From */}
            <div style={{ width: "45%" }}>
                <div style={{ fontSize: "10px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>From</div>
                <div style={{ fontSize: "13px", lineHeight: 1.6 }}>
                    <div style={{ fontWeight: 700, color: "#0f172a", fontSize: "14px" }}>{invoice.companyName}</div>
                    {invoice.companyAddress && <div style={{ whiteSpace: "pre-wrap", color: "#475569", marginTop: "4px" }}>{invoice.companyAddress}</div>}
                    {(invoice.companyGst || invoice.companyPan) && (
                        <div style={{ marginTop: "8px", fontSize: "12px", color: "#64748b", display: "flex", gap: "12px" }}>
                            {invoice.companyGst && <div><span style={{ fontWeight: 600 }}>GST:</span> {invoice.companyGst}</div>}
                            {invoice.companyPan && <div><span style={{ fontWeight: 600 }}>PAN:</span> {invoice.companyPan}</div>}
                        </div>
                    )}
                </div>
            </div>

            {/* Billed To */}
            <div style={{ width: "45%" }}>
                <div style={{ fontSize: "10px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>Billed To</div>
                <div style={{ fontSize: "13px", lineHeight: 1.6 }}>
                    <div style={{ fontWeight: 700, color: "#0f172a", fontSize: "14px" }}>{invoice.customerName}</div>
                    {invoice.customerCompany && <div style={{ color: "#334155", fontWeight: 500 }}>{invoice.customerCompany}</div>}
                    {invoice.customerAddress && <div style={{ whiteSpace: "pre-wrap", color: "#475569", marginTop: "4px" }}>{invoice.customerAddress}</div>}
                    {invoice.customerEmail && <div style={{ color: "#475569" }}>{invoice.customerEmail}</div>}
                    {invoice.customerPhone && <div style={{ color: "#475569" }}>{invoice.customerPhone}</div>}
                </div>
            </div>
        </div>

        {/* Dates Section */}
        <div style={{ display: "flex", gap: "40px", marginBottom: "40px", backgroundColor: "#f8fafc", padding: "16px 24px", borderRadius: "8px", borderLeft: "4px solid #4f46e5" }}>
            <div>
                <div style={{ fontSize: "11px", color: "#64748b", fontWeight: 600, marginBottom: "4px" }}>DATE OF ISSUE</div>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "#0f172a" }}>{date || "—"}</div>
            </div>
            <div>
                <div style={{ fontSize: "11px", color: "#64748b", fontWeight: 600, marginBottom: "4px" }}>REF QUOTATION</div>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "#0f172a" }}>{invoice.quotationNumber || "—"}</div>
            </div>
        </div>

        {/* Table */}
        <div style={{ marginBottom: "30px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", textAlign: "left" }}>
                <thead>
                    <tr>
                        <th style={{ padding: "12px 16px", fontWeight: 700, color: "#fff", backgroundColor: "#0f172a", width: "50%", borderTopLeftRadius: "6px", borderBottomLeftRadius: "6px" }}>Item</th>
                        <th style={{ padding: "12px 16px", fontWeight: 700, color: "#fff", backgroundColor: "#0f172a", textAlign: "center", width: "15%" }}>Qty</th>
                        <th style={{ padding: "12px 16px", fontWeight: 700, color: "#fff", backgroundColor: "#0f172a", textAlign: "center", width: "15%" }}>Price</th>
                        <th style={{ padding: "12px 16px", fontWeight: 700, color: "#fff", backgroundColor: "#0f172a", textAlign: "right", width: "20%", borderTopRightRadius: "6px", borderBottomRightRadius: "6px" }}>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {invoice.items.map((item, index) => (
                        <tr key={item.id || index} style={{ borderBottom: "1px solid #e2e8f0" }}>
                            <td style={{ padding: "16px", verticalAlign: "top" }}>
                                <div style={{ fontWeight: 600, color: "#0f172a" }}>{item.serviceName}</div>
                                {item.description && <div style={{ color: "#64748b", fontSize: "12px", marginTop: "4px", lineHeight: 1.4 }}>{item.description}</div>}
                            </td>
                            <td style={{ padding: "16px", textAlign: "center", verticalAlign: "top", color: "#334155" }}>{item.quantity}</td>
                            <td style={{ padding: "16px", textAlign: "center", verticalAlign: "top", color: "#334155" }}>{money(item.price)}</td>
                            <td style={{ padding: "16px", textAlign: "right", verticalAlign: "top", fontWeight: 600, color: "#0f172a" }}>{money(item.quantity * item.price)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* Summary */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "40px" }}>
            <div style={{ width: "300px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: "13px", color: "#475569" }}>
                    <span>Subtotal</span>
                    <span style={{ fontWeight: 500, color: "#0f172a" }}>{money(invoice.subtotal)}</span>
                </div>
                {invoice.discountAmount > 0 && (
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: "13px", color: "#ef4444" }}>
                        <span>Discount ({invoice.discountPercent}%)</span>
                        <span style={{ fontWeight: 500 }}>-{money(invoice.discountAmount)}</span>
                    </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: "13px", color: "#475569" }}>
                    <span>Tax ({invoice.taxPercent}%)</span>
                    <span style={{ fontWeight: 500, color: "#0f172a" }}>{money(invoice.taxAmount)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "16px 20px", marginTop: "12px", fontSize: "16px", fontWeight: 700, backgroundColor: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                    <span>Total Due</span>
                    <span style={{ color: "#4f46e5" }}>{money(invoice.grandTotal)}</span>
                </div>
            </div>
        </div>

        {/* Terms and Signatures */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: "40px" }}>
            {/* Terms */}
            <div style={{ width: "50%", fontSize: "11px", color: "#64748b", lineHeight: 1.5 }}>
                {invoice.termsAndConditions && (
                    <>
                        <div style={{ fontWeight: 700, color: "#0f172a", marginBottom: "6px", fontSize: "12px" }}>Terms & Conditions</div>
                        <div style={{ whiteSpace: "pre-wrap" }}>{invoice.termsAndConditions}</div>
                    </>
                )}
                {!invoice.termsAndConditions && (
                    <div style={{ fontStyle: "italic" }}>Payment is due within 15 days of issue.</div>
                )}
            </div>

            {/* Signatures */}
            <div style={{ width: "40%", display: "flex", justifyContent: "space-between", gap: "20px" }}>
                <div style={{ flex: 1, textAlign: "center" }}>
                    <div style={{ height: "60px" }}></div>
                    <div style={{ borderTop: "1px solid #94a3b8", paddingTop: "8px", fontSize: "11px", color: "#475569", fontWeight: 500 }}>
                        Authorized Signatory
                    </div>
                </div>
                <div style={{ flex: 1, textAlign: "center" }}>
                    <div style={{ height: "60px" }}></div>
                    <div style={{ borderTop: "1px solid #94a3b8", paddingTop: "8px", fontSize: "11px", color: "#475569", fontWeight: 500 }}>
                        Authorized Signatory
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Bottom Footer Pattern */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "40px", backgroundColor: "#f8fafc", borderTop: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", color: "#94a3b8", fontWeight: 500, letterSpacing: "0.5px" }}>
          THANK YOU FOR YOUR BUSINESS
      </div>
    </div>
  );
}
