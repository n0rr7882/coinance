import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Wallet } from "../../models/wallet";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

interface Props {
  wallets: Wallet[];
}

const WalletChart: React.FC<Props> = ({ wallets }) => {
  const composed = wallets.map((wallet) => ({
    id: wallet.id,
    name: wallet.currency.symbol,
    value: wallet.aggregated_amount_to_start_currency_price,
  }));

  return (
    <div style={{ height: 360 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={composed}
            innerRadius={80}
            outerRadius={120}
            paddingAngle={3}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) =>
              `${name}(${(Number(percent || 0) * 100).toFixed(0)}%)`
            }
          >
            {composed.map((wallet, i) => (
              <Cell key={wallet.id} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WalletChart;
