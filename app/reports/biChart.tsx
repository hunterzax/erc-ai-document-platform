"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Responsive, WidthProvider, Layout } from "react-grid-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";
import {
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    AreaChart,
    Area,
} from "recharts";
import { useResizeDetector } from "react-resize-detector";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const ResponsiveGridLayout = WidthProvider(Responsive);

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

// 4) Fuel import cost by type (Billion THB) – YTD 2025
const fuelImportCost = [
    { name: "LNG", value: 185 },
    { name: "Crude Oil", value: 420 },
    { name: "Coal", value: 95 },
    { name: "Fuel Oil", value: 62 },
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

// 6) Budget allocation (Billion THB) – FY2025
const budgetAllocation = [
    { name: "Policy & Planning", value: 12.5 },
    { name: "Power Generation SOE", value: 165 },
    { name: "Energy Efficiency", value: 18 },
    { name: "Renewables Incentives", value: 22 },
    { name: "Fuel Support & Security", value: 48 },
];

// 7) Power sector CO₂ emissions (MtCO₂) – last 12 months
const emissionsTrend = [
    { name: "2024-09", value: 15.6 },
    { name: "2024-10", value: 15.8 },
    { name: "2024-11", value: 15.1 },
    { name: "2024-12", value: 16.0 },
    { name: "2025-01", value: 16.2 },
    { name: "2025-02", value: 15.7 },
    { name: "2025-03", value: 16.6 },
    { name: "2025-04", value: 17.0 },
    { name: "2025-05", value: 17.2 },
    { name: "2025-06", value: 16.8 },
    { name: "2025-07", value: 17.3 },
    { name: "2025-08", value: 17.5 },
];

// 8) Reserve margin (%, monthly) – 2025 YTD
const reserveMargin = [
    { name: "Jan", value: 23.5 },
    { name: "Feb", value: 24.1 },
    { name: "Mar", value: 22.9 },
    { name: "Apr", value: 21.4 },
    { name: "May", value: 20.7 },
    { name: "Jun", value: 22.1 },
    { name: "Jul", value: 21.0 },
    { name: "Aug", value: 20.5 },
];

// Dataset registry (map name -> data)
const datasets = {
    demandMonthly,
    generationMix,
    tariffFt,
    fuelImportCost,
    evRegistrations,
    budgetAllocation,
    emissionsTrend,
    reserveMargin,
};

const COLORS = ["#3b82f6", "#22c55e", "#eab308", "#ef4444", "#8b5cf6", "#06b6d4", "#f97316"];

/** ------------------------------
 *  Types & helpers
 *  ------------------------------ */

type ChartType = "line" | "pie" | "bar" | "area";

interface ChartItem {
    id: string;
    title: string;
    type: ChartType;
    dataset: keyof typeof datasets;
    unit?: string; // optional, for tooltips/KPIs
}

const DEFAULT_CHARTS: ChartItem[] = [
    { id: "c1", title: "Electricity Demand (GWh) – Last 12 months", type: "line", dataset: "demandMonthly", unit: "GWh" },
    { id: "c2", title: "Generation Mix – 2025 YTD", type: "pie", dataset: "generationMix", unit: "%" },
    { id: "c3", title: "Retail Tariff Ft (Baht/kWh)", type: "line", dataset: "tariffFt", unit: "฿/kWh" },
    { id: "c4", title: "Fuel Import Cost – YTD (B THB)", type: "bar", dataset: "fuelImportCost", unit: "B THB" },
    { id: "c5", title: "EV Registrations – 2025 YTD", type: "line", dataset: "evRegistrations", unit: "units" },
    { id: "c6", title: "Budget Allocation FY2025 (B THB)", type: "pie", dataset: "budgetAllocation", unit: "B THB" },
    { id: "c7", title: "Power Sector CO₂ Emissions (MtCO₂)", type: "area", dataset: "emissionsTrend", unit: "MtCO₂" },
    { id: "c8", title: "Reserve Margin % – 2025 YTD", type: "line", dataset: "reserveMargin", unit: "%" },
];

const DEFAULT_LAYOUT: Layout[] = [
    { i: "c1", x: 0, y: 0, w: 6, h: 1 },
    { i: "c2", x: 6, y: 0, w: 6, h: 1 },
    { i: "c3", x: 0, y: 1, w: 6, h: 1 },
    { i: "c4", x: 6, y: 1, w: 6, h: 1 },
    { i: "c5", x: 0, y: 2, w: 6, h: 1 },
    { i: "c6", x: 6, y: 2, w: 6, h: 1 },
    { i: "c7", x: 0, y: 3, w: 6, h: 1 },
    { i: "c8", x: 6, y: 3, w: 6, h: 1 },
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            {kpis.map((k, i) => (
                <div key={i} className="rounded-2xl border bg-white p-4 shadow-sm">
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

/** ------------------------------
 *  Main Dashboard component
 *  ------------------------------ */
export default function EnergyDashboard() {
    const [charts, setCharts] = useState<ChartItem[]>([]);
    const [layout, setLayout] = useState<Layout[]>([]);

    // Load from localStorage once
    useEffect(() => {
        const savedLayout = localStorage.getItem("moen-dashboard-layout");
        const savedCharts = localStorage.getItem("moen-dashboard-charts");

        if (savedCharts) setCharts(JSON.parse(savedCharts));
        else setCharts(DEFAULT_CHARTS);

        if (savedLayout) setLayout(JSON.parse(savedLayout));
        else setLayout(DEFAULT_LAYOUT);
    }, []);

    const handleLayoutChange = (newLayout: Layout[]) => {
        setLayout(newLayout);
        localStorage.setItem("moen-dashboard-layout", JSON.stringify(newLayout));
    };

    const addChart = () => {
        const pool: ChartItem[] = DEFAULT_CHARTS; // choose a random template
        const picked = pool[Math.floor(Math.random() * pool.length)];
        const newId = `c${Date.now()}`;
        const newChart: ChartItem = { ...picked, id: newId };
        const newCharts = [...charts, newChart];
        setCharts(newCharts);
        localStorage.setItem("moen-dashboard-charts", JSON.stringify(newCharts));
        setLayout([...layout, { i: newId, x: 0, y: Infinity, w: 6, h: 1 }]);
    };

    const removeChart = (id: string) => {
        const updatedCharts = charts.filter((c) => c.id !== id);
        const updatedLayout = layout.filter((l) => l.i !== id);
        setCharts(updatedCharts);
        setLayout(updatedLayout);
        localStorage.setItem("moen-dashboard-charts", JSON.stringify(updatedCharts));
        localStorage.setItem("moen-dashboard-layout", JSON.stringify(updatedLayout));
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-3">
                <h1 className="text-xl font-bold">📊 กระทรวงพลังงาน – Executive Dashboard (Mock)</h1>
                <div className="flex gap-2">
                    <Button onClick={addChart} className="flex items-center gap-2">
                        <Plus className="h-4 w-4" /> เพิ่ม Card
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => {
                            setCharts(DEFAULT_CHARTS);
                            setLayout(DEFAULT_LAYOUT);
                            localStorage.setItem("moen-dashboard-charts", JSON.stringify(DEFAULT_CHARTS));
                            localStorage.setItem("moen-dashboard-layout", JSON.stringify(DEFAULT_LAYOUT));
                        }}
                    >
                        Reset Layout
                    </Button>
                </div>
            </div>

            {/* Executive KPIs */}
            <KPIStrip />

            <ResponsiveGridLayout
                className="layout"
                layouts={{ lg: layout }}
                breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480 }}
                cols={{ lg: 12, md: 10, sm: 6, xs: 2 }}
                rowHeight={200}
                onLayoutChange={handleLayoutChange}
                isResizable
                isDraggable
            >
                {charts.map((chart) => (
                    <div key={chart.id}>
                        <Card className="h-full flex flex-col rounded-2xl">
                            <CardHeader className="flex justify-between items-center py-2 px-3">
                                <CardTitle className="text-sm font-semibold">{chart.title}</CardTitle>
                                <Button size="icon" variant="ghost" onClick={() => removeChart(chart.id)}>
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                            </CardHeader>
                            <CardContent className="flex-1 p-2">
                                <ResponsiveChart chart={chart} />
                            </CardContent>
                        </Card>
                    </div>
                ))}
            </ResponsiveGridLayout>
        </div>
    );
}

/** ------------------------------
 *  Responsive chart renderer
 *  ------------------------------ */
function ResponsiveChart({ chart }: { chart: ChartItem }) {
    const { width, height, ref } = useResizeDetector();

    const w = Math.max((width ?? 300) - 16, 240);
    const h = Math.max((height ?? 180) - 16, 140);
    const data = datasets[chart.dataset];

    return (
        <div ref={ref} className="w-full h-full flex items-center justify-center">
            {chart.type === "line" && (
                <LineChart width={w} height={h} data={data as any[]}>
                    <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2} dot={false} />
                    <CartesianGrid stroke="#e5e7eb" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(v: number) => [`${v}`, chart.unit || ""]} />
                </LineChart>
            )}
            {chart.type === "area" && (
                <AreaChart width={w} height={h} data={data as any[]}>
                    <defs>
                        <linearGradient id="colorA" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.6} />
                            <stop offset="95%" stopColor="#2563eb" stopOpacity={0.1} />
                        </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="value" stroke="#2563eb" fill="url(#colorA)" />
                    <CartesianGrid stroke="#e5e7eb" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(v: number) => [`${v}`, chart.unit || ""]} />
                </AreaChart>
            )}
            {chart.type === "bar" && (
                <BarChart width={w} height={h} data={data as any[]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(v: number) => [`${v}`, chart.unit || ""]} />
                    <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                </BarChart>
            )}
            {chart.type === "pie" && (
                <PieChart width={w} height={h}>
                    <Pie
                        data={data as any[]}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={Math.min(w, h) / 2.6}
                        label
                    >
                        {(data as any[]).map((_, i) => (
                            <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(v: number) => [`${v}`, chart.unit || ""]} />
                </PieChart>
            )}
        </div>
    );
}
