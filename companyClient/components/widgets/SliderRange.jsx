import Slider from "@react-native-community/slider";

const SliderRange = ({rangeMonthValue, setRangeMonthValue, payDuration, style}) => {
  return (
    <Slider
      style={style}
      minimumValue={1}
      maximumValue={payDuration}
      minimumTrackTintColor="brown"
      maximumTrackTintColor="gray"
      thumbTintColor="brown"
      value={rangeMonthValue}
      step={1}
      onValueChange={(value) => setRangeMonthValue(value)}
    />
  );
};

export default SliderRange;