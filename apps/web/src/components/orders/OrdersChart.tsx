import React from 'react';
import { ResponsiveContainer, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, Bar, ComposedChart } from 'recharts';

export type OrderChartData = {
  date: string;
  buy: number;
  sell: number;
};

interface OrdersChartProps {
  data: OrderChartData[];
  chartType?: 'line' | 'bar';
}

export const OrdersChart: React.FC<OrdersChartProps> = ({ data, chartType="bar" }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart data={data} margin={{ top: 16, right: 24, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" opacity={.1} />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip
          contentStyle={{ backgroundColor: 'var(--accent-3)', border: '1px solid var(--accent-1)', borderRadius: '8px' }}
          labelFormatter={(label) => new Date(label).toLocaleDateString('de-DE', { year: 'numeric', month: '2-digit', day: '2-digit' })}
          formatter={(value) => value.toLocaleString('de-DE', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
        />
        <Legend />
        {chartType === 'line' && (
          <>
            <Line type="monotone" dataKey="buy" stroke="#4caf50" name="Buy" />
            <Line type="monotone" dataKey="sell" stroke="#f44336" name="Sell" />
          </>
        )}
        {chartType === 'bar' && (<>
          <Bar dataKey="buy" fill="#4caf50" name="Buy" />
          <Bar dataKey="sell" fill="#f44336" name="Sell" />
        </>)}
      </ComposedChart>
        
    </ResponsiveContainer>
  );
};
