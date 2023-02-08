import { SubmissionInfo } from '@/types';
import { format } from 'date-fns';
import { useMemo } from 'react';
import { StyleProp, ViewStyle, View, processColor } from 'react-native';
import { LineChart, LineData, LineValue } from 'react-native-charts-wrapper';
import { Text } from 'react-native-paper';

interface Props {
  data: SubmissionInfo[];
  style?: StyleProp<ViewStyle>;
  title?: string;
}

const GradeChart = ({ data, style, title }: Props) => {
  const chartValues = useMemo<LineValue[]>(() => {
    return data.map((submission, index) => ({
      x: index,
      y: submission.grade,
    }));
  }, [data]);

  const chartData = useMemo<LineData>(
    () => ({
      dataSets: [
        {
          values: chartValues,
          label: 'Grades',
          config: {
            valueTextColor: processColor('#ffffff'),
          },
        },
      ],
    }),
    [chartValues]
  );

  return (
    <View style={style}>
      {title && (
        <Text variant="titleMedium" style={{ textAlign: 'center', marginBottom: 16 }}>
          {title}
        </Text>
      )}
      <LineChart
        style={{ flex: 1 }}
        data={chartData}
        scaleEnabled={false}
        dragEnabled={false}
        highlightPerTapEnabled={false}
        chartDescription={{ text: '' }}
        xAxis={{
          drawGridLines: false,
          axisMinimum: -0.5,
          axisMaximum: 4.5,
          position: 'BOTTOM',
          textColor: processColor('#ffffff'),
          textSize: 12,
          valueFormatter: data.map((submission) => format(submission.timestamp, 'MMM d')),
          labelCount: data.length,
        }}
        yAxis={{
          left: {
            granularity: 1,
            textSize: 12,
            axisMaximum: 100.1,
            textColor: processColor('#ffffff'),
          },
          right: { drawGridLines: false, drawLabels: false },
        }}
        legend={{ enabled: false }}
      />
    </View>
  );
};

export default GradeChart;
