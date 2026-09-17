import type {
    Company,
    Customer,
    Quotation,
    Service,
} from "./CreateQuotation";

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
            maximumFractionDigits: 0,
        }).format(value);

    return (
        <div
            id="quotation-pdf"
            style={{
                width: "794px",
                minHeight: "1123px",
                margin: "0 auto",
                padding: "48px",
                backgroundColor: "#ffffff",
                color: "#0f172a",
                fontFamily:
                    "Arial, Helvetica, sans-serif",
                boxSizing: "border-box",
            }}
        >
            {/* HEADER */}

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    paddingBottom: "24px",
                    borderBottom: "2px solid #0f172a",
                }}
            >
                {/* COMPANY */}

                <div>
                    <div
                        style={{
                            width: "48px",
                            height: "48px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "10px",
                            backgroundColor: "#0f172a",
                            color: "#ffffff",
                            fontSize: "18px",
                            fontWeight: 700,
                        }}
                    >
                        VS
                    </div>

                    <h1
                        style={{
                            margin: "16px 0 0",
                            fontSize: "24px",
                            lineHeight: "1.2",
                            fontWeight: 700,
                            color: "#0f172a",
                        }}
                    >
                        {company.name}
                    </h1>

                    <p
                        style={{
                            maxWidth: "320px",
                            margin: "8px 0 0",
                            fontSize: "12px",
                            lineHeight: "20px",
                            color: "#64748b",
                        }}
                    >
                        {company.address}
                    </p>

                    <div
                        style={{
                            marginTop: "8px",
                            fontSize: "12px",
                            lineHeight: "18px",
                            color: "#64748b",
                        }}
                    >
                        <div>{company.phone}</div>
                        <div>{company.email}</div>
                    </div>
                </div>

                {/* QUOTATION INFO */}

                <div
                    style={{
                        textAlign: "right",
                    }}
                >
                    <h2
                        style={{
                            margin: 0,
                            fontSize: "32px",
                            lineHeight: "1",
                            fontWeight: 700,
                            color: "#0f172a",
                            letterSpacing: "-0.5px",
                        }}
                    >
                        QUOTATION
                    </h2>

                    <p
                        style={{
                            margin: "14px 0 0",
                            fontSize: "14px",
                            fontWeight: 700,
                            color: "#4f46e5",
                        }}
                    >
                        {quotation.number}
                    </p>

                    <div
                        style={{
                            marginTop: "16px",
                            fontSize: "12px",
                            lineHeight: "20px",
                            color: "#64748b",
                        }}
                    >
                        <div>
                            Date:{" "}
                            <strong style={{ color: "#334155" }}>
                                {quotation.date}
                            </strong>
                        </div>

                        <div>
                            Valid Until:{" "}
                            <strong style={{ color: "#334155" }}>
                                {quotation.validUntil}
                            </strong>
                        </div>
                    </div>
                </div>
            </div>

            {/* CUSTOMER */}

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "48px",
                    marginTop: "32px",
                }}
            >
                <div>
                    <p
                        style={{
                            margin: 0,
                            fontSize: "10px",
                            fontWeight: 700,
                            letterSpacing: "1.5px",
                            textTransform: "uppercase",
                            color: "#94a3b8",
                        }}
                    >
                        Prepared For
                    </p>

                    <h3
                        style={{
                            margin: "8px 0 0",
                            fontSize: "16px",
                            fontWeight: 700,
                            color: "#0f172a",
                        }}
                    >
                        {customer.company || "Customer Company"}
                    </h3>

                    <p
                        style={{
                            margin: "4px 0 0",
                            fontSize: "13px",
                            color: "#475569",
                        }}
                    >
                        {customer.name || "Customer Name"}
                    </p>

                    <p
                        style={{
                            maxWidth: "280px",
                            margin: "8px 0 0",
                            fontSize: "11px",
                            lineHeight: "18px",
                            color: "#64748b",
                        }}
                    >
                        {customer.address || "Customer address"}
                    </p>

                    {customer.phone && (
                        <p
                            style={{
                                margin: "8px 0 0",
                                fontSize: "11px",
                                color: "#64748b",
                            }}
                        >
                            {customer.phone}
                        </p>
                    )}

                    {customer.email && (
                        <p
                            style={{
                                margin: "2px 0 0",
                                fontSize: "11px",
                                color: "#64748b",
                            }}
                        >
                            {customer.email}
                        </p>
                    )}
                </div>

                <div style={{ textAlign: "right" }}>
                    <p
                        style={{
                            margin: 0,
                            fontSize: "10px",
                            fontWeight: 700,
                            letterSpacing: "1.5px",
                            textTransform: "uppercase",
                            color: "#94a3b8",
                        }}
                    >
                        Payment Terms
                    </p>

                    <p
                        style={{
                            margin: "8px 0 0",
                            fontSize: "13px",
                            fontWeight: 700,
                            color: "#334155",
                        }}
                    >
                        50% Advance
                    </p>

                    <p
                        style={{
                            margin: "4px 0 0",
                            fontSize: "11px",
                            color: "#64748b",
                        }}
                    >
                        Remaining payment as per agreed milestones
                    </p>
                </div>
            </div>

            {/* SERVICES */}

            <div style={{ marginTop: "40px" }}>
                <table
                    style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        tableLayout: "fixed",
                    }}
                >
                    <thead>
                        <tr
                            style={{
                                borderTop: "1px solid #e2e8f0",
                                borderBottom: "1px solid #e2e8f0",
                            }}
                        >
                            <th
                                style={{
                                    width: "22%",
                                    padding: "12px 0",
                                    textAlign: "left",
                                    fontSize: "10px",
                                    color: "#64748b",
                                    textTransform: "uppercase",
                                }}
                            >
                                Service
                            </th>

                            <th
                                style={{
                                    width: "31%",
                                    padding: "12px 8px",
                                    textAlign: "left",
                                    fontSize: "10px",
                                    color: "#64748b",
                                    textTransform: "uppercase",
                                }}
                            >
                                Description
                            </th>

                            <th
                                style={{
                                    width: "10%",
                                    padding: "12px 8px",
                                    textAlign: "center",
                                    fontSize: "10px",
                                    color: "#64748b",
                                    textTransform: "uppercase",
                                }}
                            >
                                Qty
                            </th>

                            <th
                                style={{
                                    width: "18%",
                                    padding: "12px 8px",
                                    textAlign: "right",
                                    fontSize: "10px",
                                    color: "#64748b",
                                    textTransform: "uppercase",
                                }}
                            >
                                Price
                            </th>

                            <th
                                style={{
                                    width: "19%",
                                    padding: "12px 0",
                                    textAlign: "right",
                                    fontSize: "10px",
                                    color: "#64748b",
                                    textTransform: "uppercase",
                                }}
                            >
                                Total
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {services.map((service) => (
                            <tr
                                key={service.id}
                                style={{
                                    borderBottom: "1px solid #f1f5f9",
                                }}
                            >
                                <td
                                    style={{
                                        padding: "16px 0",
                                        fontSize: "12px",
                                        fontWeight: 700,
                                        color: "#334155",
                                        verticalAlign: "top",
                                    }}
                                >
                                    {service.name || "Service"}
                                </td>

                                <td
                                    style={{
                                        padding: "16px 8px",
                                        fontSize: "11px",
                                        lineHeight: "17px",
                                        color: "#64748b",
                                        verticalAlign: "top",
                                    }}
                                >
                                    {service.description || "-"}
                                </td>

                                <td
                                    style={{
                                        padding: "16px 8px",
                                        textAlign: "center",
                                        fontSize: "11px",
                                        color: "#475569",
                                        verticalAlign: "top",
                                    }}
                                >
                                    {service.quantity}
                                </td>

                                <td
                                    style={{
                                        padding: "16px 8px",
                                        textAlign: "right",
                                        fontSize: "11px",
                                        color: "#475569",
                                        verticalAlign: "top",
                                    }}
                                >
                                    {formatCurrency(service.price)}
                                </td>

                                <td
                                    style={{
                                        padding: "16px 0",
                                        textAlign: "right",
                                        fontSize: "12px",
                                        fontWeight: 700,
                                        color: "#334155",
                                        verticalAlign: "top",
                                    }}
                                >
                                    {formatCurrency(
                                        service.quantity * service.price
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* TOTAL */}

            <div
                style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginTop: "32px",
                }}
            >
                <div
                    style={{
                        width: "250px",
                    }}
                >
                    <SummaryRow
                        label="Subtotal"
                        value={formatCurrency(subtotal)}
                    />

                    <SummaryRow
                        label={`Discount (${discount}%)`}
                        value={`-${formatCurrency(discountAmount)}`}
                    />

                    <SummaryRow
                        label={`Tax (${tax}%)`}
                        value={formatCurrency(taxAmount)}
                    />

                    <div
                        style={{
                            marginTop: "12px",
                            paddingTop: "12px",
                            borderTop: "1px solid #e2e8f0",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <span
                            style={{
                                fontSize: "13px",
                                fontWeight: 700,
                                color: "#0f172a",
                            }}
                        >
                            Total
                        </span>

                        <span
                            style={{
                                fontSize: "20px",
                                fontWeight: 700,
                                color: "#4f46e5",
                            }}
                        >
                            {formatCurrency(grandTotal)}
                        </span>
                    </div>
                </div>
            </div>

            {/* TERMS */}

            <div
                style={{
                    marginTop: "48px",
                    paddingTop: "20px",
                    borderTop: "1px solid #e2e8f0",
                }}
            >
                <h3
                    style={{
                        margin: 0,
                        fontSize: "11px",
                        fontWeight: 700,
                        letterSpacing: "1.2px",
                        textTransform: "uppercase",
                        color: "#334155",
                    }}
                >
                    Terms & Conditions
                </h3>

                <ol
                    style={{
                        margin: "10px 0 0",
                        paddingLeft: "18px",
                    }}
                >
                    {terms.map((term, index) => (
                        <li
                            key={index}
                            style={{
                                marginBottom: "5px",
                                fontSize: "10px",
                                lineHeight: "16px",
                                color: "#64748b",
                            }}
                        >
                            {term}
                        </li>
                    ))}
                </ol>
            </div>

            {/* SIGNATURE */}

            <div
                style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginTop: "56px",
                }}
            >
                <div
                    style={{
                        width: "190px",
                        textAlign: "center",
                    }}
                >
                    {/* Replace this with your actual signature image */}

                    <div
                        style={{
                            height: "45px",
                            borderBottom: "1px solid #94a3b8",
                        }}
                    />

                    <p
                        style={{
                            margin: "8px 0 0",
                            fontSize: "11px",
                            fontWeight: 700,
                            color: "#334155",
                        }}
                    >
                        Authorized Signatory
                    </p>

                    <p
                        style={{
                            margin: "3px 0 0",
                            fontSize: "9px",
                            color: "#94a3b8",
                        }}
                    >
                        {company.name}
                    </p>
                </div>
            </div>

            {/* FOOTER */}

            <div
                style={{
                    marginTop: "48px",
                    paddingTop: "12px",
                    borderTop: "1px solid #f1f5f9",
                    textAlign: "center",
                }}
            >
                <p
                    style={{
                        margin: 0,
                        fontSize: "9px",
                        color: "#94a3b8",
                    }}
                >
                    Thank you for your business.
                </p>
            </div>
        </div>
    );
}

function SummaryRow({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
                fontSize: "11px",
            }}
        >
            <span style={{ color: "#64748b" }}>
                {label}
            </span>

            <span
                style={{
                    fontWeight: 600,
                    color: "#334155",
                }}
            >
                {value}
            </span>
        </div>
    );
}
