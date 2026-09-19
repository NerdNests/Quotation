import type { Company, Customer, Quotation, Service } from "./CreateQuotation";

type Props = {
    company: Company;
    customer: Customer;
    quotation: Quotation;
    services: Service[];
    tax: number;
    discount: number;
    subtotal: number;
    discountAmount: number;
    taxAmount: number;
    grandTotal: number;
};

const terms = [
    "Quotation is valid for 15 days from the quotation date.",
    "50% advance payment is required to initiate the project.",
    "Remaining payment will be collected based on agreed milestones.",
    "Any additional requirements outside the agreed scope will be charged separately.",
    "Project timelines depend on timely feedback and content from the customer.",
];

export default function QuotationPDF({
    company,
    customer,
    quotation,
    services,
    tax,
    discount,
    subtotal,
    discountAmount,
    taxAmount,
    grandTotal,
}: Props) {
    const formatCurrency = (value: number) =>
        new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 2,
        }).format(value);

    return (
        <div
            id="quotation-pdf"
            style={{
                width: "794px",
                minHeight: "1123px",
                margin: "0 auto",
                backgroundColor: "#ffffff",
                color: "#0f172a",
                fontFamily: "system-ui, -apple-system, sans-serif",
                boxSizing: "border-box",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Background Pattern */}
            <div style={{ position: "absolute", inset: 0, opacity: 0.02, pointerEvents: "none" }}>
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#000" strokeWidth="1" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
            </div>

            {/* Gradient Header Strip */}
            <div style={{ height: "12px", background: "linear-gradient(90deg, #4f46e5 0%, #8b5cf6 100%)", width: "100%" }} />

            <div style={{ padding: "48px 56px", position: "relative", zIndex: 10 }}>
                {/* HEADER SECTION */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "48px" }}>
                    <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                            <div style={{ width: "56px", height: "56px", background: "linear-gradient(135deg, #4f46e5 0%, #8b5cf6 100%)", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "24px", fontWeight: "bold", boxShadow: "0 10px 25px -5px rgba(79, 70, 229, 0.3)" }}>
                                {company.name.charAt(0) || "C"}
                            </div>
                            <div>
                                <h1 style={{ margin: 0, fontSize: "28px", fontWeight: 800, color: "#1e293b", letterSpacing: "-0.5px" }}>
                                    {company.name || "Your Company"}
                                </h1>
                                <p style={{ margin: "2px 0 0 0", fontSize: "13px", color: "#64748b", fontWeight: 500 }}>
                                    Professional Services
                                </p>
                            </div>
                        </div>
                    </div>

                    <div style={{ textAlign: "right" }}>
                        <h2 style={{ margin: 0, fontSize: "42px", fontWeight: 900, color: "#4f46e5", letterSpacing: "-1px", textTransform: "uppercase" }}>
                            QUOTATION
                        </h2>
                        <div style={{ marginTop: "12px", display: "inline-flex", flexDirection: "column", gap: "6px", backgroundColor: "#f8fafc", padding: "12px 16px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", gap: "32px", fontSize: "13px" }}>
                                <span style={{ color: "#64748b" }}>Quotation No:</span>
                                <span style={{ fontWeight: 700, color: "#0f172a" }}>{quotation.number}</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", gap: "32px", fontSize: "13px" }}>
                                <span style={{ color: "#64748b" }}>Issue Date:</span>
                                <span style={{ fontWeight: 700, color: "#0f172a" }}>{quotation.date}</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", gap: "32px", fontSize: "13px" }}>
                                <span style={{ color: "#64748b" }}>Valid Until:</span>
                                <span style={{ fontWeight: 700, color: "#ef4444" }}>{quotation.validUntil}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* DETAILS GRID */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", marginBottom: "48px" }}>
                    <div style={{ padding: "24px", backgroundColor: "#f8fafc", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
                        <p style={{ margin: "0 0 16px 0", fontSize: "11px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "#4f46e5" }}>From</p>
                        <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "#0f172a" }}>{company.name || "Your Company"}</h3>
                        <p style={{ margin: "6px 0 0 0", fontSize: "13px", color: "#475569", lineHeight: "1.6" }}>{company.address}</p>
                        <div style={{ marginTop: "12px", fontSize: "13px", color: "#64748b" }}>
                            {company.phone && <p style={{ margin: "4px 0" }}>{company.phone}</p>}
                            {company.email && <p style={{ margin: "4px 0" }}>{company.email}</p>}
                        </div>
                    </div>

                    <div style={{ padding: "24px", backgroundColor: "#4f46e5", borderRadius: "16px", color: "white", boxShadow: "0 10px 25px -5px rgba(79, 70, 229, 0.4)" }}>
                        <p style={{ margin: "0 0 16px 0", fontSize: "11px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "#c7d2fe" }}>Prepared For</p>
                        <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 700 }}>{customer.company || "Client Company"}</h3>
                        <p style={{ margin: "4px 0 0 0", fontSize: "14px", color: "#e0e7ff", fontWeight: 500 }}>{customer.name || "Client Name"}</p>
                        <p style={{ margin: "12px 0 0 0", fontSize: "13px", color: "#c7d2fe", lineHeight: "1.6" }}>{customer.address}</p>
                        <div style={{ marginTop: "12px", fontSize: "13px", color: "#e0e7ff" }}>
                            {customer.phone && <p style={{ margin: "4px 0" }}>{customer.phone}</p>}
                            {customer.email && <p style={{ margin: "4px 0" }}>{customer.email}</p>}
                        </div>
                    </div>
                </div>

                {/* SERVICES TABLE */}
                <div style={{ borderRadius: "16px", border: "1px solid #e2e8f0", overflow: "hidden", marginBottom: "40px" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
                        <thead>
                            <tr style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                                <th style={{ width: "40%", padding: "16px 24px", textAlign: "left", fontSize: "11px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" }}>Description</th>
                                <th style={{ width: "15%", padding: "16px 24px", textAlign: "center", fontSize: "11px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" }}>Qty</th>
                                <th style={{ width: "22.5%", padding: "16px 24px", textAlign: "right", fontSize: "11px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" }}>Price</th>
                                <th style={{ width: "22.5%", padding: "16px 24px", textAlign: "right", fontSize: "11px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" }}>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {services.map((service, idx) => (
                                <tr key={service.id} style={{ borderBottom: idx === services.length - 1 ? "none" : "1px solid #f1f5f9" }}>
                                    <td style={{ padding: "20px 24px", verticalAlign: "top" }}>
                                        <p style={{ margin: 0, fontSize: "14px", fontWeight: 700, color: "#0f172a" }}>{service.name || "Service Item"}</p>
                                        <p style={{ margin: "6px 0 0 0", fontSize: "12px", color: "#64748b", lineHeight: "1.5" }}>{service.description || "—"}</p>
                                    </td>
                                    <td style={{ padding: "20px 24px", textAlign: "center", verticalAlign: "top", fontSize: "13px", color: "#475569", fontWeight: 500 }}>{service.quantity}</td>
                                    <td style={{ padding: "20px 24px", textAlign: "right", verticalAlign: "top", fontSize: "13px", color: "#475569", fontWeight: 500 }}>{formatCurrency(service.price)}</td>
                                    <td style={{ padding: "20px 24px", textAlign: "right", verticalAlign: "top", fontSize: "14px", color: "#0f172a", fontWeight: 700 }}>{formatCurrency(service.quantity * service.price)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* TOTALS & TERMS */}
                <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "48px" }}>
                    <div>
                        <h3 style={{ margin: 0, fontSize: "12px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "#4f46e5", marginBottom: "16px" }}>Terms & Conditions</h3>
                        <ol style={{ margin: 0, paddingLeft: "16px", color: "#64748b" }}>
                            {terms.map((term, index) => (
                                <li key={index} style={{ marginBottom: "8px", fontSize: "11px", lineHeight: "1.6" }}>{term}</li>
                            ))}
                        </ol>
                    </div>

                    <div style={{ backgroundColor: "#f8fafc", padding: "24px", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
                        <SummaryRow label="Subtotal" value={formatCurrency(subtotal)} />
                        {discount > 0 && <SummaryRow label={`Discount (${discount}%)`} value={`-${formatCurrency(discountAmount)}`} color="#ef4444" />}
                        {tax > 0 && <SummaryRow label={`Tax (${tax}%)`} value={formatCurrency(taxAmount)} />}
                        
                        <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "2px dashed #cbd5e1", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontSize: "15px", fontWeight: 800, color: "#0f172a" }}>Grand Total</span>
                            <span style={{ fontSize: "24px", fontWeight: 900, color: "#4f46e5" }}>{formatCurrency(grandTotal)}</span>
                        </div>
                    </div>
                </div>

                {/* SIGNATURE & FOOTER */}
                <div style={{ marginTop: "64px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                    <div style={{ fontSize: "11px", color: "#94a3b8" }}>
                        <p style={{ margin: 0 }}>Thank you for your business.</p>
                        <p style={{ margin: "4px 0 0 0" }}>If you have any questions about this quotation, please contact us.</p>
                    </div>
                    
                    <div style={{ width: "200px", textAlign: "center" }}>
                        <div style={{ height: "48px", borderBottom: "1px solid #cbd5e1", marginBottom: "12px" }} />
                        <p style={{ margin: 0, fontSize: "13px", fontWeight: 700, color: "#0f172a" }}>Authorized Signatory</p>
                        <p style={{ margin: "4px 0 0 0", fontSize: "11px", color: "#64748b" }}>{company.name || "Your Company"}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SummaryRow({ label, value, color = "#475569" }: { label: string; value: string; color?: string }) {
    return (
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", fontSize: "13px" }}>
            <span style={{ color: "#64748b", fontWeight: 500 }}>{label}</span>
            <span style={{ fontWeight: 700, color }}>{value}</span>
        </div>
    );
}
