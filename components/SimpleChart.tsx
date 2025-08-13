import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { HealthMetrics } from '@/types/health';

interface SimpleChartProps {
  data: HealthMetrics[];
  metric: keyof HealthMetrics;
  title: string;
  color: string;
  unit: string;
}

const { width } = Dimensions.get('window');
const chartWidth = width - 40;
const chartHeight = 120;

export default function SimpleChart({ data, metric, title, color, unit }: SimpleChartProps) {
  if (data.length === 0) return null;

  const values = data.map(item => {
    const value = item[metric];
    return typeof value === 'number' ? value : 0;
  }).slice(-7); // Last 7 days

  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);
  const range = maxValue - minValue || 1;

  const points = values.map((value, index) => {
    const x = (index / (values.length - 1)) * chartWidth;
    const y = chartHeight - ((value - minValue) / range) * chartHeight;
    return { x, y, value };
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.chartContainer}>
        <View style={[styles.chart, { width: chartWidth, height: chartHeight }]}>
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => (
            <View
              key={index}
              style={[
                styles.gridLine,
                { top: ratio * chartHeight }
              ]}
            />
          ))}
          
          {/* Data points and line */}
          {points.map((point, index) => (
            <View key={index}>
              {/* Line to next point */}
              {index < points.length - 1 && (
                <View
                  style={[
                    styles.line,
                    {
                      left: point.x,
                      top: point.y,
                      width: Math.sqrt(
                        Math.pow(points[index + 1].x - point.x, 2) +
                        Math.pow(points[index + 1].y - point.y, 2)
                      ),
                      transform: [{
                        rotate: `${Math.atan2(
                          points[index + 1].y - point.y,
                          points[index + 1].x - point.x
                        )}rad`
                      }],
                      backgroundColor: color,
                    }
                  ]}
                />
              )}
              
              {/* Data point */}
              <View
                style={[
                  styles.point,
                  {
                    left: point.x - 4,
                    top: point.y - 4,
                    backgroundColor: color,
                  }
                ]}
              />
            </View>
          ))}
        </View>
        
        {/* Y-axis labels */}
        <View style={styles.yAxis}>
          <Text style={styles.axisLabel}>{Math.round(maxValue)}</Text>
          <Text style={styles.axisLabel}>{Math.round(minValue + range * 0.5)}</Text>
          <Text style={styles.axisLabel}>{Math.round(minValue)}</Text>
        </View>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.unit}>{unit}</Text>
        <Text style={styles.period}>Last 7 days</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    margin: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chart: {
    position: 'relative',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#e9ecef',
  },
  line: {
    position: 'absolute',
    height: 2,
    borderRadius: 1,
  },
  point: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#fff',
  },
  yAxis: {
    marginLeft: 8,
    height: chartHeight,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  axisLabel: {
    fontSize: 10,
    color: '#666',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  unit: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  period: {
    fontSize: 12,
    color: '#999',
  },
});