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
                color: "#1e293b",
                fontFamily: '"Inter", "system-ui", -apple-system, sans-serif',
                boxSizing: "border-box",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Elegant Top Border */}
            <div style={{ height: "8px", background: "linear-gradient(90deg, #312e81 0%, #4f46e5 50%, #818cf8 100%)", width: "100%" }} />

            <div style={{ padding: "50px 60px" }}>
                {/* Header Row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "2px solid #f1f5f9", paddingBottom: "32px", marginBottom: "32px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                        {/* Elegant Logo Mark */}
                        <div style={{ width: "64px", height: "64px", background: "#4f46e5", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "32px", fontWeight: 800 }}>
                            {company.name.charAt(0) || "C"}
                        </div>
                        <div>
                            <h1 style={{ margin: 0, fontSize: "32px", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em" }}>
                                {company.name || "Your Company"}
                            </h1>
                            <p style={{ margin: "4px 0 0 0", fontSize: "14px", color: "#64748b", fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                                Business Proposal
                            </p>
                        </div>
                    </div>
                    
                    <div style={{ textAlign: "right" }}>
                        <h2 style={{ margin: "0 0 16px 0", fontSize: "40px", fontWeight: 900, color: "#f1f5f9", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                            QUOTATION
                        </h2>
                        <table style={{ marginLeft: "auto", borderCollapse: "collapse", fontSize: "13px" }}>
                            <tbody>
                                <tr>
                                    <td style={{ padding: "4px 16px 4px 0", color: "#64748b", fontWeight: 600, textAlign: "right" }}>Reference No:</td>
                                    <td style={{ padding: "4px 0", color: "#0f172a", fontWeight: 700 }}>{quotation.number}</td>
                                </tr>
                                <tr>
                                    <td style={{ padding: "4px 16px 4px 0", color: "#64748b", fontWeight: 600, textAlign: "right" }}>Date of Issue:</td>
                                    <td style={{ padding: "4px 0", color: "#0f172a", fontWeight: 700 }}>{quotation.date}</td>
                                </tr>
                                <tr>
                                    <td style={{ padding: "4px 16px 4px 0", color: "#64748b", fontWeight: 600, textAlign: "right" }}>Valid Until:</td>
                                    <td style={{ padding: "4px 0", color: "#ef4444", fontWeight: 700 }}>{quotation.validUntil}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Addresses */}
                <div style={{ display: "flex", gap: "64px", marginBottom: "48px" }}>
                    <div style={{ flex: 1 }}>
                        <p style={{ margin: "0 0 12px 0", fontSize: "12px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#94a3b8" }}>Prepared By</p>
                        <h3 style={{ margin: "0 0 8px 0", fontSize: "16px", fontWeight: 700, color: "#0f172a" }}>{company.name || "Your Company"}</h3>
                        <div style={{ fontSize: "13px", color: "#475569", lineHeight: "1.6" }}>
                            {company.address && <p style={{ margin: "0" }}>{company.address}</p>}
                            {company.phone && <p style={{ margin: "4px 0 0 0" }}>T: {company.phone}</p>}
                            {company.email && <p style={{ margin: "4px 0 0 0" }}>E: {company.email}</p>}
                        </div>
                    </div>
                    <div style={{ width: "2px", background: "#f1f5f9" }} />
                    <div style={{ flex: 1 }}>
                        <p style={{ margin: "0 0 12px 0", fontSize: "12px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#4f46e5" }}>Prepared For</p>
                        <h3 style={{ margin: "0 0 4px 0", fontSize: "18px", fontWeight: 800, color: "#0f172a" }}>{customer.company || "Client Company"}</h3>
                        <p style={{ margin: "0 0 8px 0", fontSize: "14px", color: "#334155", fontWeight: 600 }}>ATTN: {customer.name || "Client Name"}</p>
                        <div style={{ fontSize: "13px", color: "#475569", lineHeight: "1.6" }}>
                            {customer.address && <p style={{ margin: "0" }}>{customer.address}</p>}
                            {customer.phone && <p style={{ margin: "4px 0 0 0" }}>T: {customer.phone}</p>}
                            {customer.email && <p style={{ margin: "4px 0 0 0" }}>E: {customer.email}</p>}
                        </div>
                    </div>
                </div>

                {/* Services Table */}
                <div style={{ marginBottom: "48px" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
                        <thead>
                            <tr>
                                <th style={{ width: "50%", padding: "12px 16px", textAlign: "left", fontSize: "12px", fontWeight: 700, color: "#ffffff", backgroundColor: "#312e81", borderTopLeftRadius: "8px", borderBottomLeftRadius: "8px" }}>Service Description</th>
                                <th style={{ width: "10%", padding: "12px 16px", textAlign: "center", fontSize: "12px", fontWeight: 700, color: "#ffffff", backgroundColor: "#312e81" }}>Qty</th>
                                <th style={{ width: "20%", padding: "12px 16px", textAlign: "right", fontSize: "12px", fontWeight: 700, color: "#ffffff", backgroundColor: "#312e81" }}>Rate</th>
                                <th style={{ width: "20%", padding: "12px 16px", textAlign: "right", fontSize: "12px", fontWeight: 700, color: "#ffffff", backgroundColor: "#312e81", borderTopRightRadius: "8px", borderBottomRightRadius: "8px" }}>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {services.map((service, idx) => (
                                <tr key={service.id} style={{ backgroundColor: idx % 2 === 0 ? "#ffffff" : "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                                    <td style={{ padding: "16px", verticalAlign: "top" }}>
                                        <p style={{ margin: 0, fontSize: "14px", fontWeight: 700, color: "#0f172a" }}>{service.name || "Service Item"}</p>
                                        <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#64748b", lineHeight: "1.5" }}>{service.description || "—"}</p>
                                    </td>
                                    <td style={{ padding: "16px", textAlign: "center", verticalAlign: "top", fontSize: "13px", color: "#334155", fontWeight: 600 }}>{service.quantity}</td>
                                    <td style={{ padding: "16px", textAlign: "right", verticalAlign: "top", fontSize: "13px", color: "#334155", fontWeight: 600 }}>{formatCurrency(service.price)}</td>
                                    <td style={{ padding: "16px", textAlign: "right", verticalAlign: "top", fontSize: "14px", color: "#0f172a", fontWeight: 700 }}>{formatCurrency(service.quantity * service.price)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Summary Section */}
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "48px" }}>
                    <div style={{ width: "320px" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                            <tbody>
                                <tr>
                                    <td style={{ padding: "8px 16px", color: "#475569", fontWeight: 600 }}>Subtotal</td>
                                    <td style={{ padding: "8px 16px", textAlign: "right", color: "#0f172a", fontWeight: 700 }}>{formatCurrency(subtotal)}</td>
                                </tr>
                                {discount > 0 && (
                                    <tr>
                                        <td style={{ padding: "8px 16px", color: "#ef4444", fontWeight: 600 }}>Discount ({discount}%)</td>
                                        <td style={{ padding: "8px 16px", textAlign: "right", color: "#ef4444", fontWeight: 700 }}>-{formatCurrency(discountAmount)}</td>
                                    </tr>
                                )}
                                {tax > 0 && (
                                    <tr>
                                        <td style={{ padding: "8px 16px", color: "#475569", fontWeight: 600 }}>Tax ({tax}%)</td>
                                        <td style={{ padding: "8px 16px", textAlign: "right", color: "#0f172a", fontWeight: 700 }}>{formatCurrency(taxAmount)}</td>
                                    </tr>
                                )}
                                <tr>
                                    <td colSpan={2} style={{ padding: "16px 0 0 0" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#4f46e5", padding: "16px", borderRadius: "8px", color: "white" }}>
                                            <span style={{ fontSize: "16px", fontWeight: 700 }}>Total Due</span>
                                            <span style={{ fontSize: "24px", fontWeight: 800 }}>{formatCurrency(grandTotal)}</span>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Terms and Signature */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: "64px" }}>
                    <div style={{ maxWidth: "400px" }}>
                        <h4 style={{ margin: "0 0 12px 0", fontSize: "12px", fontWeight: 700, color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.05em" }}>Terms & Conditions</h4>
                        <ol style={{ margin: 0, paddingLeft: "16px", color: "#64748b", fontSize: "11px", lineHeight: "1.6" }}>
                            {terms.map((term, index) => (
                                <li key={index} style={{ marginBottom: "6px" }}>{term}</li>
                            ))}
                        </ol>
                    </div>
                    
                    <div style={{ width: "240px", textAlign: "center" }}>
                        <div style={{ height: "60px", borderBottom: "2px solid #cbd5e1", marginBottom: "12px" }} />
                        <p style={{ margin: 0, fontSize: "14px", fontWeight: 700, color: "#0f172a" }}>Authorized Signatory</p>
                        <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#64748b" }}>{company.name || "Your Company"}</p>
                    </div>
                </div>
            </div>
            
            {/* Elegant Bottom Accent */}
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "4px", backgroundColor: "#e2e8f0" }}>
                <div style={{ width: "30%", height: "100%", background: "linear-gradient(90deg, #4f46e5 0%, #818cf8 100%)" }} />
            </div>
        </div>
    );
}
