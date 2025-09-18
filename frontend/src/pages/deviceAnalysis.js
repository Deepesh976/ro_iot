import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import axios from "axios";
import Select from "react-select";
import { motion } from "framer-motion";

// 🔹 Reusable Card Component
const Card = ({ title, children, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className={`bg-white rounded-2xl shadow-md hover:shadow-xl transition p-6 ${className}`}
  >
    {title && (
      <h3 className="text-lg font-semibold text-gray-700 mb-4">{title}</h3>
    )}
    {children}
  </motion.div>
);

const DeviceAnalysis = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  // ✅ Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/user/all");
        const options = res.data.map((u) => ({
          value: u._id,
          label: u.user || u.name,
        }));
        setUsers(options);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  // ✅ Mock Data
  const flowRateData = [
    { time: "00:00", value: 10 },
    { time: "02:00", value: 15 },
    { time: "04:00", value: 20 },
    { time: "06:00", value: 18 },
    { time: "08:00", value: 25 },
    { time: "10:00", value: 22 },
    { time: "12:00", value: 28 },
    { time: "14:00", value: 30 },
  ];
  const pulseCountValue = 4527;

  // ✅ TDS Gauge
  const gaugeOption = {
    series: [
      {
        type: "gauge",
        min: 0,
        max: 1000,
        splitNumber: 5,
        axisLine: {
          lineStyle: {
            width: 15,
            color: [
              [0.3, "#22c55e"], // green
              [0.6, "#facc15"], // yellow
              [1, "#ef4444"], // red
            ],
          },
        },
        pointer: { width: 6, itemStyle: { color: "#111827" } },
        progress: { show: true, width: 15 },
        detail: {
          valueAnimation: true,
          formatter: "{value} ppm",
          fontSize: 20,
          offsetCenter: [0, "70%"],
        },
        data: [{ value: 320, name: "TDS" }],
      },
    ],
  };

  // ✅ Flow Rate
  const flowRateOption = {
    tooltip: { trigger: "axis" },
    xAxis: { type: "category", data: flowRateData.map((d) => d.time) },
    yAxis: { type: "value", name: "L/min" },
    series: [
      {
        data: flowRateData.map((d) => d.value),
        type: "bar",
        itemStyle: { color: "#3b82f6", borderRadius: [6, 6, 0, 0] },
        barWidth: "45%",
      },
    ],
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center sticky top-0 z-10">
          <h1 className="text-2xl font-bold text-gray-800">Device Analysis</h1>
          <div className="w-72">
            <Select
              options={users}
              value={selectedUser}
              onChange={setSelectedUser}
              placeholder="🔍 Search user..."
              isClearable
              isSearchable
              styles={{
                control: (base) => ({
                  ...base,
                  borderRadius: "0.75rem",
                  padding: "4px",
                  borderColor: "#e5e7eb",
                  boxShadow: "0 0 0 1px #e5e7eb",
                }),
              }}
            />
          </div>
        </header>

        {/* Main Section */}
        <main className="flex-1 p-8 space-y-8">
          {/* Row 1: TDS Gauge + Pulse Count */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Gauge */}
            <Card title="TDS Gauge">
              <ReactECharts option={gaugeOption} style={{ height: "280px" }} />
            </Card>

            {/* Pulse Count */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-lg p-10 text-center text-white flex flex-col justify-center"
            >
              <h3 className="text-lg font-semibold mb-4">Pulse Count</h3>
              <div className="text-6xl font-extrabold">{pulseCountValue}</div>
              <p className="text-gray-200 mt-2">Total Pulses Recorded</p>
            </motion.div>
          </div>

          {/* Row 2: Flow Rate */}
          <Card title="Flow Rate">
            <ReactECharts option={flowRateOption} style={{ height: "300px" }} />
          </Card>
        </main>
      </div>
    </div>
  );
};

export default DeviceAnalysis;
