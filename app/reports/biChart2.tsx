import React, { useState, useEffect, useMemo } from "react";
import { Responsive, WidthProvider, Layout } from "react-grid-layout";
import GridLayout from "react-grid-layout";
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { Skeleton } from "@/components/ui/skeleton";
import { Edit } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const ResponsiveGridLayout = WidthProvider(Responsive);

// Mock data
const demandData = [
    { month: "ม.ค.", demand: 32000 },
    { month: "ก.พ.", demand: 35000 },
    { month: "มี.ค.", demand: 37000 },
    { month: "เม.ย.", demand: 34000 },
    { month: "พ.ค.", demand: 39000 },
    { month: "มิ.ย.", demand: 41000 },
];

const genMixData = [
    { name: "ก๊าซธรรมชาติ", value: 55 },
    { name: "ถ่านหิน", value: 20 },
    { name: "หมุนเวียน", value: 18 },
    { name: "ชีวมวล", value: 2 },
    { name: "อื่น ๆ", value: 5 },
];

const tariffData = [
    { quarter: "Q1", ft: 0.23 },
    { quarter: "Q2", ft: 0.28 },
    { quarter: "Q3", ft: 0.31 },
    { quarter: "Q4", ft: 0.27 },
];

const importCostData = [
    { year: "2021", cost: 420000 },
    { year: "2022", cost: 465000 },
    { year: "2023", cost: 510000 },
];

const evData = [
    { year: "2019", ev: 2000 },
    { year: "2020", ev: 7000 },
    { year: "2021", ev: 16000 },
    { year: "2022", ev: 45000 },
    { year: "2023", ev: 95000 },
];

const budgetData = [
    { sector: "ไฟฟ้า", budget: 200000 },
    { sector: "น้ำมัน", budget: 150000 },
    { sector: "ก๊าซ", budget: 100000 },
    { sector: "พลังงานหมุนเวียน", budget: 120000 },
];

const emissionData = [
    { year: "2019", emission: 180 },
    { year: "2020", emission: 170 },
    { year: "2021", emission: 175 },
    { year: "2022", emission: 168 },
    { year: "2023", emission: 162 },
];

const reserveMarginData = [
    { year: "2019", margin: 28 },
    { year: "2020", margin: 32 },
    { year: "2021", margin: 29 },
    { year: "2022", margin: 31 },
    { year: "2023", margin: 30 },
];

// Enterprise styled card
function Card({ title, children }: any) {
    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 h-full flex flex-col cursor-pointer anifade">
            <div className="flex justify-between items-center border-b pb-2 mb-3">
                <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
                <Edit size={16} className="hover:text-blue-500 duration-200 ease-in-out" />
            </div>
            <div className="flex-1 min-h-[200px]">
                {children}
            </div>
        </div>
    );
}

// Charts
const DemandChart = () => (
    <ResponsiveContainer width="100%" height="100%">
        <LineChart data={demandData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#374151" />
            <YAxis stroke="#374151" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="demand" stroke="#2563eb" strokeWidth={2} />
        </LineChart>
    </ResponsiveContainer>
);

const GenMixChart = () => (
    <ResponsiveContainer width="100%" height="100%">
        <PieChart>
            <Pie
                data={genMixData}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
                label
            >
                {genMixData.map((entry, index) => (
                    <Cell
                        key={`cell-${index}`}
                        fill={["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#6366f1"][index % 5]}
                    />
                ))}
            </Pie>
            <Tooltip />
            <Legend />
        </PieChart>
    </ResponsiveContainer>
);

const TariffChart = () => (
    <ResponsiveContainer width="100%" height="100%">
        <BarChart data={tariffData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="quarter" stroke="#374151" />
            <YAxis stroke="#374151" />
            <Tooltip />
            <Legend />
            <Bar dataKey="ft" fill="#f97316" radius={[4, 4, 0, 0]} />
        </BarChart>
    </ResponsiveContainer>
);

const ImportCostChart = () => (
    <ResponsiveContainer width="100%" height="100%">
        <LineChart data={importCostData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="year" stroke="#374151" />
            <YAxis stroke="#374151" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="cost" stroke="#16a34a" strokeWidth={2} />
        </LineChart>
    </ResponsiveContainer>
);

const EVChart = () => (
    <ResponsiveContainer width="100%" height="100%">
        <BarChart data={evData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="year" stroke="#374151" />
            <YAxis stroke="#374151" />
            <Tooltip />
            <Legend />
            <Bar dataKey="ev" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
        </BarChart>
    </ResponsiveContainer>
);

const BudgetChart = () => (
    <ResponsiveContainer width="100%" height="100%">
        <PieChart>
            <Pie
                data={budgetData}
                dataKey="budget"
                nameKey="sector"
                outerRadius={80}
                label
            >
                {budgetData.map((entry, index) => (
                    <Cell
                        key={`cell-${index}`}
                        fill={["#0ea5e9", "#22c55e", "#f97316", "#a855f7"][index % 4]}
                    />
                ))}
            </Pie>
            <Tooltip />
            <Legend />
        </PieChart>
    </ResponsiveContainer>
);

const EmissionChart = () => (
    <ResponsiveContainer width="100%" height="100%">
        <LineChart data={emissionData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="year" stroke="#374151" />
            <YAxis stroke="#374151" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="emission" stroke="#dc2626" strokeWidth={2} />
        </LineChart>
    </ResponsiveContainer>
);

const ReserveMarginChart = () => (
    <ResponsiveContainer width="100%" height="100%">
        <BarChart data={reserveMarginData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="year" stroke="#374151" />
            <YAxis stroke="#374151" />
            <Tooltip />
            <Legend />
            <Bar dataKey="margin" fill="#9333ea" radius={[4, 4, 0, 0]} />
        </BarChart>
    </ResponsiveContainer>
);

// const DEFAULT_LAYOUT: any = [
//     { i: "demand", x: 0, y: 0, w: 3, h: 3 },
//     { i: "genMix", x: 3, y: 0, w: 3, h: 3 },
//     { i: "tariff", x: 6, y: 0, w: 3, h: 3 },
//     { i: "importCost", x: 9, y: 0, w: 3, h: 3 },
//     { i: "ev", x: 0, y: 3, w: 3, h: 3 },
//     { i: "budget", x: 3, y: 3, w: 3, h: 3 },
//     { i: "emission", x: 6, y: 3, w: 3, h: 3 },
//     { i: "reserveMargin", x: 9, y: 3, w: 3, h: 3 },
// ];



const DEFAULT_LAYOUT: any = [
    // แถว 1
    { i: "demand", x: 0, y: 0, w: 6, h: 3 },
    { i: "genMix", x: 6, y: 0, w: 6, h: 3 },

    // แถว 2
    { i: "tariff", x: 0, y: 3, w: 6, h: 3 },
    { i: "importCost", x: 6, y: 3, w: 6, h: 3 },

    // แถว 3
    { i: "ev", x: 0, y: 6, w: 6, h: 3 },
    { i: "budget", x: 6, y: 6, w: 6, h: 3 },

    // แถว 4
    { i: "emission", x: 0, y: 9, w: 6, h: 3 },
    { i: "reserveMargin", x: 6, y: 9, w: 6, h: 3 },
];

const default_k_layout: any = [
    {
        "w": 5,
        "h": 3,
        "x": 0,
        "y": 0,
        "i": "demand",
        "moved": false,
        "static": false
    },
    {
        "w": 5,
        "h": 3,
        "x": 5,
        "y": 0,
        "i": "genMix",
        "moved": false,
        "static": false
    },
    {
        "w": 5,
        "h": 3,
        "x": 0,
        "y": 3,
        "i": "tariff",
        "moved": false,
        "static": false
    },
    {
        "w": 5,
        "h": 3,
        "x": 5,
        "y": 3,
        "i": "importCost",
        "moved": false,
        "static": false
    },
    {
        "w": 5,
        "h": 3,
        "x": 0,
        "y": 6,
        "i": "ev",
        "moved": false,
        "static": false
    },
    {
        "w": 5,
        "h": 3,
        "x": 5,
        "y": 6,
        "i": "budget",
        "moved": false,
        "static": false
    },
    {
        "w": 5,
        "h": 3,
        "x": 0,
        "y": 9,
        "i": "emission",
        "moved": false,
        "static": false
    },
    {
        "w": 5,
        "h": 3,
        "x": 5,
        "y": 9,
        "i": "reserveMargin",
        "moved": false,
        "static": false
    }
]





/** ------------------------------
 *  Mock datasets for Ministry of Energy (Executive view)
 *  ------------------------------ */

// 1) Monthly electricity demand (GWh) – last 12 months
const demandMonthly = [
    { name: "2024-09", value: 18850 },
    { name: "2024-10", value: 19120 },
    { name: "2024-11", value: 18640 },
    { name: "2024-12", value: 19480 },
    { name: "2025-01", value: 19720 },
    { name: "2025-02", value: 18930 },
    { name: "2025-03", value: 20110 },
    { name: "2025-04", value: 21040 },
    { name: "2025-05", value: 21420 },
    { name: "2025-06", value: 20980 },
    { name: "2025-07", value: 21650 },
    { name: "2025-08", value: 21890 },
];

// 2) Generation mix (share %) – YTD 2025
const generationMix = [
    { name: "ก๊าซธรรมชาติ", value: 58 },
    { name: "ถ่านหิน", value: 16 },
    { name: "พลังงานนำเข้า", value: 9 },
    { name: "พลังงานน้ำ", value: 5 },
    { name: "พลังงานจาก solar", value: 6 },
    { name: "พลังงานลม", value: 3 },
    { name: "พลังงานชีวมวล", value: 3 },
];

// 3) Retail tariff Ft (Baht/kWh) – quarterly 2024–2025
const tariffFt = [
    { name: "2024-Q3", value: 3.68 },
    { name: "2024-Q4", value: 3.83 },
    { name: "2025-Q1", value: 3.96 },
    { name: "2025-Q2", value: 3.89 },
    { name: "2025-Q3", value: 4.02 },
];

// 5) EV registrations (units) – 2025 YTD (monthly)
const evRegistrations = [
    { name: "Jan", value: 8200 },
    { name: "Feb", value: 9100 },
    { name: "Mar", value: 10150 },
    { name: "Apr", value: 10800 },
    { name: "May", value: 11420 },
    { name: "Jun", value: 12050 },
    { name: "Jul", value: 12980 },
    { name: "Aug", value: 13720 },
];

/** ------------------------------
 *  KPI strip for executives
 *  ------------------------------ */
function KPIStrip() {
    // Compute a few quick KPIs from datasets
    const latestDemand = demandMonthly.at(-1)?.value ?? 0;
    const reShare = useMemo(() => {
        const re = generationMix.filter((d) => ["Solar", "Wind", "Biomass/Other", "Domestic Hydro", "Imported Hydro"].includes(d.name)).reduce((s, d) => s + d.value, 0);
        return re;
    }, []);
    const latestFt = tariffFt.at(-1)?.value ?? 0;
    const ytdEV = evRegistrations.reduce((s, d) => s + d.value, 0);

    const kpis = [
        { label: "Latest Monthly Demand", value: latestDemand.toLocaleString(), suffix: " GWh" },
        { label: "Renewables & Hydro Share", value: reShare.toFixed(1), suffix: " %" },
        { label: "Current Ft", value: latestFt.toFixed(2), suffix: " ฿/kWh" },
        { label: "EV Registrations (YTD)", value: ytdEV.toLocaleString(), suffix: " units" },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4 px-3">
            {kpis?.map((k, i) => (
                <div key={i} className="rounded-2xl border bg-transparent p-4 shadow-sm">
                    <div className="text-xs text-gray-500">{k.label}</div>
                    <div className="mt-1 text-2xl font-semibold tracking-tight">
                        {k.value}
                        <span className="ml-1 text-base font-normal text-gray-500">{k.suffix}</span>
                    </div>
                </div>
            ))}
        </div>
    );
}

const Dashboard = () => {
    const [layout, setLayout] = useState([]);

    useEffect(() => {
        const saved = localStorage.getItem("energyDashboardLayout");
        if (saved) {
            setLayout(JSON.parse(saved));
        } else {
            // setLayout(DEFAULT_LAYOUT);
            setLayout(default_k_layout);
        }
    }, []);

    const handleLayoutChange = (newLayout: any) => {
        setLayout(newLayout);
        // console.log('newLayout', newLayout)
        // localStorage.setItem("energyDashboardLayout", JSON.stringify(newLayout));
        localStorage.setItem("energyDashboardLayout", JSON.stringify(default_k_layout));
        // localStorage.setItem("energyDashboardLayout", JSON.stringify(DEFAULT_LAYOUT));
    };


    const [isLoading, setisLoading] = useState(true)

    useEffect(() => {
        setTimeout(() => {
            setisLoading(false);
        }, 1000);
    }, [])


    return (
        <div className="p-6 bg-gray-50 h-auto">
            <KPIStrip />

            {isLoading == false ?
                <ResponsiveGridLayout
                    className="layout"
                    layouts={{ lg: layout }}
                    breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480 }}
                    // cols={{ lg: 12, md: 10, sm: 6, xs: 2 }}
                    cols={{ lg: 10, md: 10, sm: 6, xs: 2 }}
                    rowHeight={120}
                    onLayoutChange={handleLayoutChange}
                    isResizable
                    isDraggable
                >
                    <div key="demand">
                        <Card title="ความต้องการไฟฟ้า (MW)">
                            <DemandChart />
                        </Card>
                    </div>
                    <div key="genMix">
                        <Card title="สัดส่วนการผลิตไฟฟ้า (%)">
                            <GenMixChart />
                        </Card>
                    </div>
                    <div key="tariff">
                        <Card title="อัตราค่าไฟ Ft (บาท/หน่วย)">
                            <TariffChart />
                        </Card>
                    </div>
                    <div key="importCost">
                        <Card title="ต้นทุนเชื้อเพลิงนำเข้า (ล้านบาท)">
                            <ImportCostChart />
                        </Card>
                    </div>
                    <div key="ev">
                        <Card title="จำนวนรถ EV ลงทะเบียน (คัน)">
                            <EVChart />
                        </Card>
                    </div>
                    <div key="budget">
                        <Card title="งบประมาณตามหน่วยงาน (ล้านบาท)">
                            <BudgetChart />
                        </Card>
                    </div>
                    <div key="emission">
                        <Card title="การปล่อยก๊าซคาร์บอน (MtCO2)">
                            <EmissionChart />
                        </Card>
                    </div>
                    <div key="reserveMargin">
                        <Card title="สำรองกำลังการผลิต (%)">
                            <ReserveMarginChart />
                        </Card>
                    </div>

                </ResponsiveGridLayout>
                :
                <div className="grid grid-cols-2 gap-3 anifade px-3">
                    <div className="space-y-2 h-full items-center justify-center border border-gray-300 p-4 rounded-lg shadow-sm">
                        <Skeleton className="h-2 w-full bg-gray-200" />
                        <Skeleton className="h-2 w-3/4 bg-gray-200" />
                        <Skeleton className="h-2 w-1/2 bg-gray-200" />
                    </div>
                    <div className="space-y-2 h-full items-center justify-center border border-gray-300 p-4 rounded-lg shadow-sm">
                        <Skeleton className="h-2 w-full bg-gray-200" />
                        <Skeleton className="h-2 w-3/4 bg-gray-200" />
                        <Skeleton className="h-2 w-1/2 bg-gray-200" />
                    </div>
                    <div className="space-y-2 h-full items-center justify-center border border-gray-300 p-4 rounded-lg shadow-sm">
                        <Skeleton className="h-2 w-full bg-gray-200" />
                        <Skeleton className="h-2 w-3/4 bg-gray-200" />
                        <Skeleton className="h-2 w-1/2 bg-gray-200" />
                    </div>
                    <div className="space-y-2 h-full items-center justify-center border border-gray-300 p-4 rounded-lg shadow-sm">
                        <Skeleton className="h-2 w-full bg-gray-200" />
                        <Skeleton className="h-2 w-3/4 bg-gray-200" />
                        <Skeleton className="h-2 w-1/2 bg-gray-200" />
                    </div>
                </div>
            }

        </div>
    );
};

export default Dashboard;
