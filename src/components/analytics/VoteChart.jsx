import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

// Props example:
// data = [
//   { category: "Hostel", likes: 40, dislikes: 5 },
//   { category: "Library", likes: 18, dislikes: 2 },
//   { category: "Cafeteria", likes: 25, dislikes: 10 },
// ]
//
// This chart compares likes vs dislikes per category,
// so admins can see which areas students feel strongly about.

const VoteChart = ({ data }) => {
  // Simple fallback if nothing to show yet
  if (!data || data.length === 0) {
    return <p>No vote data available yet.</p>;
  }

  return (
    <div style={{ width: "100%", height: 320 }}>
      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{ top: 16, right: 16, left: 0, bottom: 32 }}
        >
          {/* Background grid lines */}
          <CartesianGrid strokeDasharray="3 3" />

          {/* X axis shows each category */}
          <XAxis
            dataKey="category"
            tick={{ fontSize: 12 }}
            angle={-20}
            textAnchor="end"
          />

          {/* Y axis shows number of reactions */}
          <YAxis allowDecimals={false} />

          {/* Tooltip shows exact like/dislike numbers on hover */}
          <Tooltip />

          {/* Legend explains which color is likes vs dislikes */}
          <Legend />

          {/* Bar for likes (e.g. "upvotes") */}
          <Bar
            dataKey="likes"
            name="Likes"
            fill="#16a34a" // green
            radius={[4, 4, 0, 0]}
          />

          {/* Bar for dislikes (e.g. "downvotes") */}
          <Bar
            dataKey="dislikes"
            name="Dislikes"
            fill="#dc2626" // red
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VoteChart;