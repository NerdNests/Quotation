"use client";

import {
    MdAdd,
    MdDeleteOutline,
    MdBusiness,
    MdPerson,
    MdDescription,
    MdReceiptLong,
} from "react-icons/md";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/light.css";

export type Service = {
    id: number;
    name: string;
    description: string;
    quantity: number;
    price: number;
};

export type Company = {
    name: string;
    address: string;
    phone: string;
    email: string;
};

export type Customer = {
    name: string;
    company: string;
    address: string;
    phone: string;
    email: string;
};

export type Quotation = {
    number: string;
    date: string;
    validUntil: string;
};

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

    setCompany: React.Dispatch<React.SetStateAction<Company>>;
    setCustomer: React.Dispatch<React.SetStateAction<Customer>>;
    setQuotation: React.Dispatch<React.SetStateAction<Quotation>>;

    setTax: React.Dispatch<React.SetStateAction<number>>;
    setDiscount: React.Dispatch<React.SetStateAction<number>>;

    addService: () => void;
    removeService: (id: number) => void;

    updateService: (
        id: number,
        field: keyof Service,
        value: string | number
    ) => void;
};

export default function QuotationForm({
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
    setCompany,
    setCustomer,
    setQuotation,
    setTax,
    setDiscount,
    addService,
    removeService,
    updateService,
}: Readonly<Props>) {
    const formatCurrency = (value: number) =>
        new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(value);

    return (
        <div className="space-y-6">
            {/* QUOTATION INFORMATION */}

            <section className="rounded-3xl border border-white/50 bg-white/55 p-6 shadow-[0_8px_30px_rgba(0,0,0,0.05)] backdrop-blur-2xl">
                <SectionTitle
                    icon={<MdReceiptLong size={22} />}
                    title="Quotation Information"
                    description="Basic quotation details"
                />

                <div className="mt-5 grid gap-4 md:grid-cols-3">
                    <Input
                        label="Quotation Number"
                        value={quotation.number}
                        onChange={(value) =>
                            setQuotation((current) => ({
                                ...current,
                                number: value,
                            }))
                        }
                    />

                    <div>
                        <label className="mb-1.5 block text-xs font-medium text-slate-600">
                            Quotation Date
                        </label>
                        <Flatpickr
                            value={quotation.date}
                            onChange={(_, dateStr) =>
                                setQuotation((current) => ({
                                    ...current,
                                    date: dateStr,
                                }))
                            }
                            options={{ dateFormat: "d/m/Y" }}
                            className="w-full rounded-xl border border-slate-200/60 bg-white/50 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white/80 focus:ring-2 focus:ring-indigo-500/10"
                            placeholder="Select date"
                        />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-xs font-medium text-slate-600">
                            Valid Until
                        </label>
                        <Flatpickr
                            value={quotation.validUntil}
                            onChange={(_, dateStr) =>
                                setQuotation((current) => ({
                                    ...current,
                                    validUntil: dateStr,
                                }))
                            }
                            options={{ dateFormat: "d/m/Y" }}
                            className="w-full rounded-xl border border-slate-200/60 bg-white/50 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white/80 focus:ring-2 focus:ring-indigo-500/10"
                            placeholder="Select valid date"
                        />
                    </div>
                </div>
            </section>

            {/* COMPANY + CUSTOMER */}

            <div className="grid gap-6 xl:grid-cols-2">
                {/* COMPANY */}

                <section className="rounded-3xl border border-white/50 bg-white/55 p-6 shadow-[0_8px_30px_rgba(0,0,0,0.05)] backdrop-blur-2xl">
                    <SectionTitle
                        icon={<MdBusiness size={22} />}
                        title="Our Company"
                        description="Company details shown on quotation"
                    />

                    <div className="mt-5 space-y-4">
                        <Input
                            label="Company Name"
                            value={company.name}
                            onChange={(value) =>
                                setCompany((current) => ({
                                    ...current,
                                    name: value,
                                }))
                            }
                        />

                        <Textarea
                            label="Address"
                            value={company.address}
                            onChange={(value) =>
                                setCompany((current) => ({
                                    ...current,
                                    address: value,
                                }))
                            }
                        />

                        <div className="grid gap-4 sm:grid-cols-2">
                            <Input
                                label="Phone"
                                value={company.phone}
                                onChange={(value) =>
                                    setCompany((current) => ({
                                        ...current,
                                        phone: value,
                                    }))
                                }
                            />

                            <Input
                                label="Email"
                                value={company.email}
                                onChange={(value) =>
                                    setCompany((current) => ({
                                        ...current,
                                        email: value,
                                    }))
                                }
                            />
                        </div>
                    </div>
                </section>

                {/* CUSTOMER */}

                <section className="rounded-3xl border border-white/50 bg-white/55 p-6 shadow-[0_8px_30px_rgba(0,0,0,0.05)] backdrop-blur-2xl">
                    <SectionTitle
                        icon={<MdPerson size={22} />}
                        title="Customer Details"
                        description="Customer information"
                    />

                    <div className="mt-5 space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Input
                                label="Customer Name"
                                placeholder="Enter customer name"
                                value={customer.name}
                                onChange={(value) =>
                                    setCustomer((current) => ({
                                        ...current,
                                        name: value,
                                    }))
                                }
                            />

                            <Input
                                label="Company"
                                placeholder="Customer company"
                                value={customer.company}
                                onChange={(value) =>
                                    setCustomer((current) => ({
                                        ...current,
                                        company: value,
                                    }))
                                }
                            />
                        </div>

                        <Textarea
                            label="Address"
                            placeholder="Customer address"
                            value={customer.address}
                            onChange={(value) =>
                                setCustomer((current) => ({
                                    ...current,
                                    address: value,
                                }))
                            }
                        />

                        <div className="grid gap-4 sm:grid-cols-2">
                            <Input
                                label="Phone"
                                placeholder="+91"
                                value={customer.phone}
                                onChange={(value) =>
                                    setCustomer((current) => ({
                                        ...current,
                                        phone: value,
                                    }))
                                }
                            />

                            <Input
                                label="Email"
                                placeholder="customer@email.com"
                                value={customer.email}
                                onChange={(value) =>
                                    setCustomer((current) => ({
                                        ...current,
                                        email: value,
                                    }))
                                }
                            />
                        </div>
                    </div>
                </section>
            </div>

            {/* SERVICES */}

            <section className="overflow-hidden rounded-3xl border border-white/50 bg-white/55 shadow-[0_8px_30px_rgba(0,0,0,0.05)] backdrop-blur-2xl">
                <div className="flex flex-col justify-between gap-4 p-6 sm:flex-row sm:items-center">
                    <SectionTitle
                        icon={<MdDescription size={22} />}
                        title="Services"
                        description="Add services and pricing"
                    />

                    <button
                        type="button"
                        onClick={addService}
                        className="flex items-center justify-center gap-2 rounded-xl bg-indigo-500/10 px-4 py-2.5 text-sm font-medium text-indigo-600 transition hover:bg-indigo-500/20"
                    >
                        <MdAdd size={19} />
                        Add Service
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-225">
                        <thead>
                            <tr className="border-y border-white/50 bg-white/30">
                                <th className="px-6 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                    Service
                                </th>

                                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                    Description
                                </th>

                                <th className="w-24 px-4 py-3 text-center text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                    Qty
                                </th>

                                <th className="w-40 px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                    Price
                                </th>

                                <th className="w-40 px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                    Total
                                </th>

                                <th className="w-14 px-4 py-3" />
                            </tr>
                        </thead>

                        <tbody>
                            {services.map((service) => {
                                const total = service.quantity * service.price;

                                return (
                                    <tr
                                        key={service.id}
                                        className="border-b border-white/40"
                                    >
                                        <td className="px-6 py-4">
                                            <input
                                                value={service.name}
                                                onChange={(e) =>
                                                    updateService(
                                                        service.id,
                                                        "name",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Service name"
                                                className="w-full rounded-xl border border-slate-200/60 bg-white/50 px-3 py-2.5 text-sm outline-none focus:border-indigo-400"
                                            />
                                        </td>

                                        <td className="px-4 py-4">
                                            <input
                                                value={service.description}
                                                onChange={(e) =>
                                                    updateService(
                                                        service.id,
                                                        "description",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Description"
                                                className="w-full rounded-xl border border-slate-200/60 bg-white/50 px-3 py-2.5 text-sm outline-none focus:border-indigo-400"
                                            />
                                        </td>

                                        <td className="px-4 py-4">
                                            <input
                                                type="number"
                                                min={1}
                                                value={service.quantity}
                                                onChange={(e) =>
                                                    updateService(
                                                        service.id,
                                                        "quantity",
                                                        Number(e.target.value)
                                                    )
                                                }
                                                className="w-full rounded-xl border border-slate-200/60 bg-white/50 px-3 py-2.5 text-center text-sm outline-none focus:border-indigo-400"
                                            />
                                        </td>

                                        <td className="px-4 py-4">
                                            <input
                                                type="number"
                                                min={0}
                                                value={service.price}
                                                onChange={(e) =>
                                                    updateService(
                                                        service.id,
                                                        "price",
                                                        Number(e.target.value)
                                                    )
                                                }
                                                className="w-full rounded-xl border border-slate-200/60 bg-white/50 px-3 py-2.5 text-right text-sm outline-none focus:border-indigo-400"
                                            />
                                        </td>

                                        <td className="px-4 py-4 text-right text-sm font-semibold text-slate-800">
                                            {formatCurrency(total)}
                                        </td>

                                        <td className="px-4 py-4">
                                            <button
                                                type="button"
                                                onClick={() => removeService(service.id)}
                                                className="flex h-9 w-9 items-center justify-center rounded-xl text-red-400 transition hover:bg-red-500/10 hover:text-red-500"
                                            >
                                                <MdDeleteOutline size={20} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* TOTALS */}

                <div className="flex justify-end p-6">
                    <div className="w-full max-w-sm space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Subtotal</span>

                            <span className="font-medium text-slate-800">
                                {formatCurrency(subtotal)}
                            </span>
                        </div>

                        <div className="flex items-center justify-between gap-5 text-sm">
                            <span className="text-slate-500">Discount</span>

                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    min={0}
                                    max={100}
                                    value={discount}
                                    onChange={(e) =>
                                        setDiscount(Number(e.target.value))
                                    }
                                    className="w-16 rounded-lg border border-slate-200 bg-white/60 px-2 py-1.5 text-right text-xs outline-none"
                                />

                                <span className="text-slate-400">%</span>

                                <span className="w-24 text-right font-medium text-slate-800">
                                    -{formatCurrency(discountAmount)}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between gap-5 text-sm">
                            <span className="text-slate-500">Tax</span>

                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    min={0}
                                    value={tax}
                                    onChange={(e) =>
                                        setTax(Number(e.target.value))
                                    }
                                    className="w-16 rounded-lg border border-slate-200 bg-white/60 px-2 py-1.5 text-right text-xs outline-none"
                                />

                                <span className="text-slate-400">%</span>

                                <span className="w-24 text-right font-medium text-slate-800">
                                    {formatCurrency(taxAmount)}
                                </span>
                            </div>
                        </div>

                        <div className="my-3 border-t border-slate-200/60" />

                        <div className="flex items-center justify-between rounded-2xl bg-linear-to-r from-indigo-500 to-violet-500 px-5 py-4 text-white">
                            <span className="text-sm font-medium">
                                Grand Total
                            </span>

                            <span className="text-xl font-bold">
                                {formatCurrency(grandTotal)}
                            </span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

/* ------------------------------------------------ */
/* Reusable Components */
/* ------------------------------------------------ */

function SectionTitle({
    icon,
    title,
    description,
}: Readonly<{
    icon: React.ReactNode;
    title: string;
    description: string;
}>) {
    return (
        <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600">
                {icon}
            </div>

            <div>
                <h2 className="font-semibold text-slate-900">
                    {title}
                </h2>

                <p className="text-xs text-slate-400">
                    {description}
                </p>
            </div>
        </div>
    );
}

function Input({
    label,
    value,
    placeholder,
    onChange,
}: Readonly<{
    label: string;
    value: string;
    placeholder?: string;
    onChange: (value: string) => void;
}>) {
    return (
        <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-600">
                {label}
            </label>

            <input
                value={value}
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
                className="w-full rounded-xl border border-slate-200/60 bg-white/50 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white/80 focus:ring-2 focus:ring-indigo-500/10"
            />
        </div>
    );
}

function Textarea({
    label,
    value,
    placeholder,
    onChange,
}: Readonly<{
    label: string;
    value: string;
    placeholder?: string;
    onChange: (value: string) => void;
}>) {
    return (
        <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-600">
                {label}
            </label>

            <textarea
                rows={3}
                value={value}
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
                className="w-full resize-none rounded-xl border border-slate-200/60 bg-white/50 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white/80 focus:ring-2 focus:ring-indigo-500/10"
            />
        </div>
    );
}