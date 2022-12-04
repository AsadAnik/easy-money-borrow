import Slider from "@react-native-community/slider";

const SliderRange = ({rangeMonthValue, onValueChange, payDuration, style}) => {
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
      onValueChange={onValueChange}
    />
  );
};

export default SliderRange;