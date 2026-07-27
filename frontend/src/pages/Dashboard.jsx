import { useState, useEffect } from "react";
import {
  ResponsiveContainer,
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
} from "recharts";
import "./Dashboard.css";
import { Link } from "react-router-dom";
import { BsChatDotsFill } from "react-icons/bs";

const API_URL = "http://localhost:5097/dashboard";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const PIE_COLORS = ["#4F6BFF", "#22C5A2", "#FFB547", "#FF6B6B", "#9B7BFF"];

// ---- formatting helpers ----
const formatCurrency = (value) => {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
  return `$${value.toFixed(0)}`;
};

const formatNumber = (value) => new Intl.NumberFormat("en-US").format(value);

const formatDate = (isoString) => {
  const d = new Date(isoString);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

function StatCard({ label, value }) {
  return (
    <div className="stat-card">
      <span className="stat-label">{label}</span>
      <span className="stat-value">{value}</span>
    </div>
  );
}

function ChartPanel({ title, children }) {
  return (
    <div className="chart-panel">
      <h3 className="chart-title">{title}</h3>
      <div className="chart-body">{children}</div>
    </div>
  );
}

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`Server responded with ${res.status}`);
        const json = await res.json();
        if (!cancelled) setData(json);
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setError("Couldn't load dashboard data. Check the server and try again.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadDashboard();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="dashboard">
        <div className="dashboard-status">Loading dashboard…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <div className="dashboard-status dashboard-error">{error}</div>
      </div>
    );
  }

  if (!data) return null;

  const { cards, revenueByMonth, ordersByMonth, topProducts, categories, recentOrders } = data;

  // Reshape month-based data for recharts, and cut long product names for the bar chart
  const revenueSeries = revenueByMonth.map((d) => ({
    label: `${MONTHS[d.Month - 1]} '${String(d.Year).slice(2)}`,
    Revenue: d.Revenue,
  }));

  const ordersSeries = ordersByMonth.map((d) => ({
    label: `${MONTHS[d.Month - 1]} '${String(d.Year).slice(2)}`,
    Orders: d.Orders,
  }));

  const topProductsSeries = topProducts.map((p) => ({
    name: p.Name.length > 16 ? `${p.Name.slice(0, 14)}…` : p.Name,
    fullName: p.Name,
    Revenue: p.Revenue,
  }));

  return (
    <div className="dashboard">
      <div className="dashboard-header">

    <div>
        <h1>Sales Dashboard</h1>
        <p>AdventureWorks Overview</p>
    </div>

    <Link to="/chat" className="ai-btn">
      <BsChatDotsFill className="chat-icon" />
      <span>AI Assistant</span>
    </Link>

</div>
      {/* Stat cards */}
      <div className="stat-grid">
        <StatCard label="Customers" value={formatNumber(cards.customers)} />
        <StatCard label="Products" value={formatNumber(cards.products)} />
        <StatCard label="Orders" value={formatNumber(cards.orders)} />
        <StatCard label="Revenue" value={formatCurrency(cards.revenue)} />
      </div>

      {/* Revenue + Orders by month */}
      <div className="chart-grid">
        <ChartPanel title="Revenue by Month">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={revenueSeries} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--grid-color)" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
              <YAxis tickFormatter={formatCurrency} tick={{ fontSize: 11 }} width={55} />
              <Tooltip formatter={(v) => formatCurrency(v)} />
              <Line
                type="monotone"
                dataKey="Revenue"
                stroke="var(--accent)"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartPanel>

        <ChartPanel title="Orders by Month">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={ordersSeries} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--grid-color)" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
              <YAxis tick={{ fontSize: 11 }} width={40} />
              <Tooltip />
              <Bar dataKey="Orders" fill="var(--accent-2)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartPanel>
      </div>

      {/* Top products + categories */}
      <div className="chart-grid">
        <ChartPanel title="Top Products">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={topProductsSeries}
              layout="vertical"
              margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--grid-color)" />
              <XAxis type="number" tickFormatter={formatCurrency} tick={{ fontSize: 11 }} />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 11 }}
                width={110}
              />
              <Tooltip
                formatter={(v) => formatCurrency(v)}
                labelFormatter={(_, payload) => payload?.[0]?.payload?.fullName || ""}
              />
              <Bar dataKey="Revenue" fill="var(--accent)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartPanel>

        <ChartPanel title="Product Categories">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categories}
                dataKey="Products"
                nameKey="Name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ Name, Products }) => `${Name} (${Products})`}
              >
                {categories.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartPanel>
      </div>

      {/* Recent orders table */}
      <div className="table-panel">
        <h3 className="chart-title">Recent Orders</h3>
        <div className="table-scroll">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.SalesOrderID}>
                  <td>{order.SalesOrderID}</td>
                  <td>{formatDate(order.OrderDate)}</td>
                  <td>${order.TotalDue.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}