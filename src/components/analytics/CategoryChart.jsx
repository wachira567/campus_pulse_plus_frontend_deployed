import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

// Props example:
// data = [
//   { category: "Hostel", postCount: 12 },
//   { category: "Library", postCount: 5 },
//   { category: "Cafeteria", postCount: 9 },
// ]

const CategoryChart = ({ data }) => {
  // If there is no data yet, show a simple message instead of an empty chart
  if (!data || data.length === 0) {
    return <p>No category data available yet.</p>;
  }

  return (
    <div style={{ width: "100%", height: 300 }}>
      {/* ResponsiveContainer makes the chart resize with the parent div */}
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 16, right: 16, left: 0, bottom: 32 }}>
          {/* Light grid lines to make the chart easier to read */}
          <CartesianGrid strokeDasharray="3 3" />

          {/* X axis shows category names */}
          <XAxis
            dataKey="category"
            tick={{ fontSize: 12 }}
            angle={-20} // tilt labels a bit so long names still fit
            textAnchor="end"
          />

          {/* Y axis shows number of posts per category */}
          <YAxis allowDecimals={false} />

          {/* Tooltip shows exact values when you hover over a bar */}
          <Tooltip />

          {/* Single bar series for number of posts */}
          <Bar
            dataKey="postCount"
            fill="#4f46e5" // purple-ish color
            radius={[4, 4, 0, 0]} // round top corners
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryChart;