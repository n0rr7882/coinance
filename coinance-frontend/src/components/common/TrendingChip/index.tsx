import React from 'react';
import { TrendingFlat, TrendingUp, TrendingDown } from "@material-ui/icons";
import { Chip } from '@material-ui/core';

interface TrendingChipProps {
  value: number;
}

const TrendingChip: React.FC<TrendingChipProps> = ({ value }) => {
  const color = value === 0 ? 'default' : value > 0 ? 'primary' : 'secondary';
  const icon = value === 0 ? <TrendingFlat /> : value >= 0 ? <TrendingUp /> : <TrendingDown />;
  return <Chip label={`${value}%`} color={color} icon={icon} />;
}

export default TrendingChip;