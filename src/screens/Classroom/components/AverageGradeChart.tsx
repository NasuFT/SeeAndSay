import { useMemo } from 'react';
import { StyleProp, ViewStyle, View, TextStyle, processColor } from 'react-native';
import { BarChart, BarData, BarValue } from 'react-native-charts-wrapper';
import { Text } from 'react-native-paper';
import { countBy, map } from 'lodash';

interface Props {
  data: number[];
  title?: string;
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
}

const gradesBucket = (grade: number) => {
  return grade === 100 ? 9 : Math.floor(grade / 10);
};

const AverageGradeChart = ({ data, style, title, titleStyle }: Props) => {
  const chartValues = useMemo<BarValue[]>(() => {
    const gradeCount = countBy(data, gradesBucket);

    return map(gradeCount, (value, key) => ({
      x: Number(key),
      y: value,
      marker: key === '9' ? '90-100' : `${Number(key) * 10}-${Number(key) * 10 + 9}`,
    }));
  }, [data]);

  const chartData = useMemo<BarData>(
    () => ({
      dataSets: [
        {
          values: chartValues,
          label: 'Grades',
        },
      ],
    }),
    [chartValues]
  );

  return (
    <View style={style}>
      {title && (
        <Text
          variant="titleMedium"
          style={[{ marginTop: 16, textAlign: 'center', marginBottom: 16 }, titleStyle]}>
          {title}
        </Text>
      )}
      <BarChart
        style={{ flex: 1 }}
        data={chartData}
        scaleEnabled={false}
        dragEnabled={false}
        highlightPerTapEnabled={false}
        chartDescription={{ text: '' }}
        drawValueAboveBar={false}
        xAxis={{
          drawGridLines: false,
          axisMinimum: -0.5,
          axisMaximum: 9.5,
          position: 'BOTTOM',
          textSize: 10,
          textColor: processColor('#ffffff'),
          valueFormatter: [
            '0-10',
            '11-20',
            '21-30',
            '31-40',
            '41-50',
            '51-60',
            '61-70',
            '71-80',
            '81-90',
            '91-100',
          ],
          labelCount: 10,
        }}
        yAxis={{
          left: {
            granularity: 1,
            textSize: 10,
            textColor: processColor('#ffffff'),
            axisMinimum: -0.1,
            spaceTop: 10
          },
          right: { drawGridLines: false, drawLabels: false },
        }}
        legend={{ enabled: false }}
      />
    </View>
  );
};

export default AverageGradeChart;
