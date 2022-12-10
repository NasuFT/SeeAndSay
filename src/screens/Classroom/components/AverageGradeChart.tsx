import { useState } from 'react';
import { StyleProp, ViewStyle, View } from 'react-native';
import { VictoryChart, VictoryTheme, VictoryBar, VictoryAxis } from 'victory-native';

interface Props {
  data: number[];
  style?: StyleProp<ViewStyle>;
}

const AverageGradeChart = ({ data, style }: Props) => {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  return (
    <View
      onLayout={(e) => {
        setWidth(e.nativeEvent.layout.width);
        setHeight(e.nativeEvent.layout.height);
      }}
      style={[{}, style]}>
      <VictoryChart theme={VictoryTheme.material} height={height} width={width}>
        <VictoryBar />
      </VictoryChart>
    </View>
  );
};

export default AverageGradeChart;
