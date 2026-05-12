import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
}

export const StatCard = ({ title, value, change }: StatCardProps) => (
  <Card className="bg-neutral-900 border-neutral-800">
    <CardHeader className="pb-2">
      <CardDescription className="text-neutral-400">{title}</CardDescription>
      <CardTitle className="text-3xl font-bold">{value}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-gold font-medium">{change}</p>
    </CardContent>
  </Card>
);
