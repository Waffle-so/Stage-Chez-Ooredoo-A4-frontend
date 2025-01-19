import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register necessary plugins
ChartJS.register(ArcElement, Tooltip, Legend);

export function PieChart({ userData }) {
  // Compute data by sector
  const sectorCounts = userData.reduce((acc, user) => {
    acc[user.secteur] = (acc[user.secteur] || 0) + 1;
    return acc;
  }, {});

  const labels = Object.keys(sectorCounts);
  const data = Object.values(sectorCounts);

  const chartData = {
    labels, // Sectors
    datasets: [
      {
        label: 'Sector Distribution',
        data, // Values
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
        ],
      },
    ],
  };

  return (
    <div style={{ width: '250px', margin: 'auto' }}>
      <h3>Distribution des Secteurs</h3>
      <Pie data={chartData} />
    </div>
  );
}
