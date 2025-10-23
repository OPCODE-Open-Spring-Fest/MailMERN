import { motion } from "framer-motion";
import {
  Mail,
  TrendingUp,
  Clock,
  Send,
  BarChart2,
  PieChart,
  Users,
  MoreVertical,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useState } from "react";

// --- MOCK DATA ---

// 1. Data for Key Stat Cards (Enhanced)
const kpiMetrics = {
  totalSent: 1245,
  responseRate: 32.5,
  pendingReplies: 87,
  openRate: 68.2,
  bounceRate: 4.7,
  unsubscribes: 12,
  avgReplyTime: '3h 22m',
};

// 2. Data for Line Chart (Emails Sent Over Time)
const emailTrendData = [
  { name: "Mon", sent: 20 },
  { name: "Tue", sent: 45 },
  { name: "Wed", sent: 30 },
  { name: "Thu", sent: 55 },
  { name: "Fri", sent: 40 },
  { name: "Sat", sent: 60 },
  { name: "Sun", sent: 52 },
];

// 3. Data for Donut Chart (Response Analysis)
const responseAnalysisData = [
  { name: "Responded", value: 325 },
  { name: "No Response", value: 675 },
];
const DONUT_COLORS = ["#3b82f6", "#fde047"]; // Blue, Yellow

// 4. Data for Table (Pending Replies, Enhanced)
const pendingEmails = [
  {
    id: "pe-001",
    recipient: "john.doe@example.com",
    subject: "Re: Project Update",
    sent: "2 days ago",
  },
  {
    id: "pe-002",
    recipient: "jane.smith@acme.com",
    subject: "Following up on our call",
    sent: "1 day ago",
  },
  {
    id: "pe-003",
    recipient: "mike.w@techcorp.io",
    subject: "Proposal for new feature",
    sent: "3 days ago",
  },
  {
    id: "pe-004",
    recipient: "sarah.b@design.co",
    subject: "Quick question about mocks",
    sent: "4 hours ago",
  },
  {
    id: "pe-005",
    recipient: "alex.t@startup.io",
    subject: "Invoice for September",
    sent: "5 hours ago",
  },
  {
    id: "pe-006",
    recipient: "emma.l@agency.com",
    subject: "Feedback on designs",
    sent: "6 hours ago",
  },
];
// 6. Data for Recent Activity
const recentActivity = [
  { id: 'ra-001', type: 'sent', user: 'john.doe@example.com', desc: 'Sent email: Project Update', time: '2 min ago' },
  { id: 'ra-002', type: 'reply', user: 'jane.smith@acme.com', desc: 'Replied: Call Follow-up', time: '10 min ago' },
  { id: 'ra-003', type: 'bounce', user: 'mike.w@techcorp.io', desc: 'Email bounced', time: '30 min ago' },
  { id: 'ra-004', type: 'unsubscribe', user: 'sarah.b@design.co', desc: 'Unsubscribed from list', time: '1 hour ago' },
  { id: 'ra-005', type: 'sent', user: 'emma.l@agency.com', desc: 'Sent email: Design Feedback', time: '2 hours ago' },
];

// 7. Data for Campaign Summary
const campaignSummary = [
  { id: 'cs-001', name: 'Q4 Launch', sent: 400, responded: 180, openRate: '72%' },
  { id: 'cs-002', name: 'Black Friday', sent: 320, responded: 110, openRate: '65%' },
  { id: 'cs-003', name: 'Welcome Series', sent: 210, responded: 90, openRate: '58%' },
];

// 5. Data for List (Top Performing Campaigns)
const topCampaigns = [
  {
    id: "tc-001",
    name: "Q4 Product Launch",
    responseRate: "45.2%",
    icon: <Send className="w-5 h-5 text-indigo-600" />,
  },
  {
    id: "tc-002",
    name: "Summer Sale Newsletter",
    responseRate: "38.1%",
    icon: <TrendingUp className="w-5 h-5 text-green-500" />,
  },
  {
    id: "tc-003",
    name: "Welcome Series (New Users)",
    responseRate: "35.9%",
    icon: <Users className="w-5 h-5 text-blue-500" />,
  },
];

// --- MAIN DASHBOARD COMPONENT ---

export default function EmailDashboard() {
  // Animation variants for Framer Motion
  const cardVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3,
      },
    }),
  };

  // Dark theme state
  const [dark, setDark] = useState(false);

  // Helper for theme classes
  const theme = dark ? 'dark' : 'light';

  return (
    <div className={`min-h-screen ${dark ? 'bg-gray-900' : 'bg-slate-50'} p-6 sm:p-8 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto">
        {/* Header + Theme Toggle (removed Explore button) */}
        <div className="mb-8 flex items-center justify-between gap-4 flex-wrap">
          <h1 className={`text-3xl font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>Dashboard</h1>
          <button
            className={`px-4 py-2 rounded-lg border ${dark ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-gray-900 border-gray-300'} shadow hover:shadow-md transition-all`}
            onClick={() => setDark((d) => !d)}
            aria-label="Toggle dark mode"
          >
            {dark ? '🌙 Dark' : '☀️ Light'}
          </button>
        </div>

        {/* 1. Key Stat Cards Row (Enhanced) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
          <StatCard
            title="Total Emails Sent"
            value={kpiMetrics.totalSent.toLocaleString()}
            icon={<Mail className="w-6 h-6 text-blue-600" />}
            bgColor="bg-blue-100"
            index={0}
            dark={dark}
          />
          <StatCard
            title="Response Rate"
            value={`${kpiMetrics.responseRate}%`}
            icon={<TrendingUp className="w-6 h-6 text-green-600" />}
            bgColor="bg-green-100"
            index={1}
            dark={dark}
          />
          <StatCard
            title="Open Rate"
            value={`${kpiMetrics.openRate}%`}
            icon={<BarChart2 className="w-6 h-6 text-yellow-600" />}
            bgColor="bg-yellow-100"
            index={2}
            dark={dark}
          />
          <StatCard
            title="Pending Replies"
            value={kpiMetrics.pendingReplies}
            icon={<Clock className="w-6 h-6 text-pink-600" />}
            bgColor="bg-pink-100"
            index={3}
            dark={dark}
          />
          <StatCard
            title="Bounce Rate"
            value={`${kpiMetrics.bounceRate}%`}
            icon={<PieChart className="w-6 h-6 text-red-500" />}
            bgColor="bg-red-100"
            index={4}
            dark={dark}
          />
          <StatCard
            title="Unsubscribes"
            value={kpiMetrics.unsubscribes}
            icon={<Users className="w-6 h-6 text-gray-500" />}
            bgColor="bg-gray-100"
            index={5}
            dark={dark}
          />
        </div>
        {/* 4. Recent Activity Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <motion.div
            className={`rounded-2xl shadow-sm p-6 lg:col-span-2 transition-colors duration-300 ${dark ? 'bg-gray-800' : 'bg-white'}`}
            initial="hidden"
            animate="visible"
            custom={8}
            variants={cardVariant}
          >
            <CardHeader title="Recent Activity" dark={dark} />
            <div className="mt-6 space-y-4">
              {recentActivity.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className={`p-2 rounded-full bg-gray-100 ${dark ? 'bg-opacity-30' : ''}`}>
                    {item.type === 'sent' && <Send className="w-5 h-5 text-indigo-500" />}
                    {item.type === 'reply' && <TrendingUp className="w-5 h-5 text-green-500" />}
                    {item.type === 'bounce' && <PieChart className="w-5 h-5 text-red-500" />}
                    {item.type === 'unsubscribe' && <Users className="w-5 h-5 text-gray-500" />}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${dark ? 'text-white' : 'text-gray-900'} truncate`}>{item.desc}</p>
                    <p className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{item.user} • {item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div
            className={`rounded-2xl shadow-sm p-6 transition-colors duration-300 ${dark ? 'bg-gray-800' : 'bg-white'}`}
            initial="hidden"
            animate="visible"
            custom={9}
            variants={cardVariant}
          >
            <CardHeader title="Campaign Summary" dark={dark} />
            <div className="mt-6 space-y-4">
              {campaignSummary.map((c) => (
                <div key={c.id} className="flex items-center gap-4">
                  <div className={`p-2 rounded-full bg-blue-100 ${dark ? 'bg-opacity-30' : ''}`}>
                    <BarChart2 className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${dark ? 'text-white' : 'text-gray-900'} truncate`}>{c.name}</p>
                    <p className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Sent: {c.sent} • Responded: {c.responded} • Open Rate: {c.openRate}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* 2. Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Main Line Chart Card */}
          <motion.div
            className={`${dark ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-sm p-6 lg:col-span-2 transition-colors duration-300`}
            initial="hidden"
            animate="visible"
            custom={4}
            variants={cardVariant}
          >
            <CardHeader title="Email Sending Report" dark={dark} />
            <div className="h-80 mt-6">
              {/* Chart remains unchanged, but you can tweak chart colors for dark mode if needed */}
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={emailTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={dark ? '#444' : '#e0e0e0'} />
                  <XAxis dataKey="name" fontSize={12} stroke={dark ? '#cbd5e1' : '#6b7280'} />
                  <YAxis fontSize={12} stroke={dark ? '#cbd5e1' : '#6b7280'} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: dark ? '#222' : '#fff',
                      borderRadius: '8px',
                      borderColor: dark ? '#444' : '#e5e7eb',
                      color: dark ? '#fff' : '#222',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="sent"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ r: 4, fill: '#3b82f6' }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Donut Chart Card */}
          <motion.div
            className={`${dark ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-sm p-6 transition-colors duration-300`}
            initial="hidden"
            animate="visible"
            custom={5}
            variants={cardVariant}
          >
            <CardHeader title="Response Analysis" dark={dark} />
            <div className="h-80 mt-6 relative flex items-center justify-center">
              <div className="absolute flex flex-col items-center justify-center">
                <span className={`text-3xl font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>{kpiMetrics.responseRate}%</span>
                <span className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Responded</span>
              </div>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={responseAnalysisData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {responseAnalysisData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={DONUT_COLORS[index % DONUT_COLORS.length]}
                        stroke="none"
                      />
                    ))}
                  </Pie>
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                    iconSize={10}
                    wrapperStyle={{ color: dark ? '#fff' : '#222' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* 3. Tables/Lists Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pending Replies Table Card */}
          <motion.div
            className={`lg:col-span-2 rounded-2xl shadow-sm p-6 transition-colors duration-300 ${dark ? 'bg-gray-800' : 'bg-white'} w-full`}
            initial="hidden"
            animate="visible"
            custom={6}
            variants={cardVariant}
          >
            <CardHeader title="Pending Replies" dark={dark} />
            <div className="mt-4 flow-root">
              <div className="-mx-6 -my-2 overflow-x-auto">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6">
                  <div className="overflow-x-auto w-full">
                    <table className={`min-w-full divide-y ${dark ? 'divide-gray-700' : 'divide-gray-200'}`}>
                      <thead>
                        <tr>
                          <th
                            scope="col"
                            className={`py-3.5 pl-6 pr-3 text-left text-sm font-semibold ${dark ? 'text-white' : 'text-gray-900'}`}
                          >
                            Recipient
                          </th>
                          <th
                            scope="col"
                            className={`px-3 py-3.5 text-left text-sm font-semibold ${dark ? 'text-white' : 'text-gray-900'}`}
                          >
                            Subject
                          </th>
                          <th
                            scope="col"
                            className={`px-3 py-3.5 text-left text-sm font-semibold ${dark ? 'text-white' : 'text-gray-900'}`}
                          >
                            Sent
                          </th>
                        </tr>
                      </thead>
                      <tbody className={`${dark ? 'divide-gray-700 bg-gray-900' : 'divide-gray-200 bg-white'}`}>
                        {pendingEmails.map((email) => (
                          <tr key={email.id}>
                            <td className={`whitespace-nowrap py-4 pl-6 pr-3 text-sm font-medium ${dark ? 'text-white' : 'text-gray-900'}`}>{email.recipient}</td>
                            <td className={`whitespace-nowrap px-3 py-4 text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{email.subject}</td>
                            <td className={`whitespace-nowrap px-3 py-4 text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{email.sent}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Top Campaigns List Card */}
          <motion.div
            className={`rounded-2xl shadow-sm p-6 transition-colors duration-300 ${dark ? 'bg-gray-800' : 'bg-white'}`}
            initial="hidden"
            animate="visible"
            custom={7}
            variants={cardVariant}
          >
            <CardHeader title="Top Campaigns" dark={dark} />
            <div className="mt-6 space-y-5">
              {topCampaigns.map((campaign) => (
                <div key={campaign.id} className="flex items-center gap-4">
                  <div className={`p-3 rounded-full bg-gray-100 ${dark ? 'bg-opacity-30' : ''}`}>{campaign.icon}</div>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${dark ? 'text-white' : 'text-gray-900'} truncate`}>{campaign.name}</p>
                    <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{campaign.responseRate} response rate</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

/**
 * A reusable stat card component for the top row.
 */
function StatCard({ title, value, icon, bgColor, index, dark }) {
  const cardVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.1,
        duration: 0.3,
      },
    },
  };
  return (
    <motion.div
      className={`rounded-2xl shadow-sm p-5 transition-colors duration-300 flex flex-col items-center justify-center ${dark ? 'bg-gray-800' : 'bg-white'}`}
      initial="hidden"
      animate="visible"
      custom={index}
      variants={cardVariant}
    >
      <div className="flex flex-col items-center justify-center gap-3 w-full">
        <div className={`p-3 rounded-full ${bgColor} ${dark ? 'bg-opacity-30' : ''} flex items-center justify-center mb-2`}>{icon}</div>
        <p className={`text-sm font-medium ${dark ? 'text-gray-400' : 'text-gray-500'} text-center`}>{title}</p>
        <p className={`text-2xl font-bold ${dark ? 'text-white' : 'text-gray-900'} text-center`}>{value}</p>
      </div>
    </motion.div>
  );
}

/**
 * A reusable header for all cards.
 */
function CardHeader({ title, dark }) {
  return (
    <div className="flex items-center">
      <h2 className={`text-lg font-semibold ${dark ? 'text-white' : 'text-gray-900'}`}>{title}</h2>
    </div>
  );
}