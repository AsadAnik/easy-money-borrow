import { useState, useEffect, useRef } from "react";
import { View, StyleSheet, Alert, Text } from "react-native";
import InputField from "../../components/widgets/InputField";
import { Button } from "../../components/widgets/Button";
import { dispatchLoan, getLoanDetailsByLoanId } from "../../API";
import * as Animatable from "react-native-animatable";
import PickUpDuration from "./PickUpDuration";
import { OutlineButton } from "../../components/widgets/Button";
import BottomSheet from "../../components/widgets/BottomSheet";
import SliderRange from "../../components/widgets/SliderRange";
// import { getFormatedDate } from '../../services/dateFormatService';

// label, placeholder, keyboardType, onChangeText

// title, color1st, color2nd, size, textColor, width, height, onPress, children

const DispatchLoan = ({ navigation, route }) => {
  const [data, setData] = useState(0);
  const [rangeMonthValue, setRangeMonthValue] = useState(0);
  const loanId = route.params;
  const [loanInfo, setLoanInfo] = useState({});
  const [error, setError] = useState({
    error: false,
    message: "",
    amounts: null,
  });

  // Functionality for bottomsheet here..
  const [isBottomSheetOpen, setBottomSheetOpen] = useState(false);
  const bottomSheetRef = useRef(null);

  // To Open The Bottom Sheet..
  const handleBottomSheetOpen = () => {
    bottomSheetRef.current?.expand();
    setBottomSheetOpen(true);
  };

  // To Close The Bottom Sheet..
  const handleBottomSheetClose = () => {
    bottomSheetRef.current?.close();
    setBottomSheetOpen(false);
  };

  // Fetching Loan Details..
  const fetchLoanDetails = async (id) => {
    const response = await getLoanDetailsByLoanId(id);

    if (response.success) {
      setLoanInfo({
        payPerMonth: response?.loan?.payPerMonth,
        nextPayDate: response?.loan?.nextPayDate,
        expiredDate: response?.loan?.expiredDate,
        payDuration: response?.loan?.payDuration,
        loanPeriods: response?.loan?.loanPeriods,
      });
    }
  };

  // Hook..
  useEffect(() => {
    fetchLoanDetails(loanId);
  }, []);

  console.log("Loan Info -- ", loanInfo);
  //    console.log(new Date(loanInfo.nextPayDate) === new Date());
  //    console.log(getFormatedDate(new Date()));

  // Amounts with Multiple by Duration..
  const dispatchAmounts = (amounts, duration) =>
    parseInt(amounts) * parseInt(duration);

  // To Rendering the Error Message..
  const renderErrorMsg = (err) => (
    <Animatable.View
      animation={"zoomInUp"}
      style={{
        alignItems: "center",
        padding: 10,
        backgroundColor: "lightgray",
        borderRadius: 10,
        margin: 10,
        borderBottomWidth: 3,
        borderBottomColor: "red",
      }}
    >
      <Text style={{ textTransform: "capitalize", color: "black" }}>
        you have to pay {parseInt(loanInfo?.payPerMonth)} TK Monthly
      </Text>

      <Text style={{ textTransform: "capitalize", color: "black" }}>
        {err.messsage} {parseInt(err.amounts)} TK
      </Text>
    </Animatable.View>
  );

  // handle the loan submittion here..
  const handleDispatch = async () => {
    if (data && rangeMonthValue) {
      const dispatch = await dispatchLoan(loanId, {
        payAmounts: data,
        payForMonth: rangeMonthValue,
      });

      console.log("Dispatch -- ", dispatch);

      if (dispatch) {
        if (dispatch.success) {
          navigation.navigate("DispatchDone", dispatch);
        }

        if (!dispatch.success) {
          setError({
            ...error,
            error: true,
            message: dispatch.message,
            amounts: dispatch.amounts,
          });

          Alert.alert(
            `${dispatch.message} ${
              dispatch.amounts ? ` - ${dispatch.amounts} TK` : ""
            }`
          );

          setTimeout(() => {
            setError({
              ...error,
              error: false,
            });
          }, 5000);
        }
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* ---- When Error Founds ---- */}
      {error.error && error.amounts && renderErrorMsg(error)}

      {/* ---- The Range Slider for to selecting the months ---- */}
      <View style={{ marginBottom: 10 }}>
        {/* <View>
          <RangeSlider
            min={5}
            max={25}
            fromValueOnChange={(value) =>
              setRangeData({ ...rangeData, fromValue: value })
            }
            toValueOnChange={(value) =>
              setRangeData({ ...rangeData, toValue: value })
            }
            initialFromValue={11}
          />
          <Text>from value: {rangeData.fromValue}</Text>
          <Text>to value: {rangeData.toValue}</Text>
        </View> */}

        {/* ----- [react-native-range-slider-expo] -----
        <View>
          <Slider
            min={1}
            max={40}
            step={1}
            valueOnChange={(value) => setRangeMonthValue(value)}
            initialValue={1}
            knobColor="red"
            valueLabelsBackgroundColor="black"
            inRangeBarColor="purple"
            outOfRangeBarColor="orange"
          />
          <Text>value: {rangeMonthValue}</Text>
        </View> */}

        <View>
          <Text style={[styles.sliderRangeText, { fontSize: 15 }]}>
            Pick Your Month
          </Text>

          {/* ----- Slider Heading Text ----- */}
          <Text
            style={{
              textAlign: "center",
              fontWeight: "bold",
              fontSize: 25,
              color: `${rangeMonthValue > 1 ? "brown" : "gray"}`,
            }}
          >
            {rangeMonthValue} {rangeMonthValue > 1 ? "Months" : "Month"} ={" "}
            {dispatchAmounts(loanInfo?.payPerMonth, rangeMonthValue)} TK
          </Text>
          {/* ----- Slider ----- */}
          <SliderRange
            rangeMonthValue={rangeMonthValue}
            setRangeMonthValue={setRangeMonthValue}
            payDuration={loanInfo?.payDuration}
            style={styles.sliderRange}
          />
          <View>
            <Text style={styles.sliderRangeText}>
              {rangeMonthValue} {rangeMonthValue > 1 ? "Months" : "Month"}.
              Dispatch {dispatchAmounts(loanInfo?.payPerMonth, rangeMonthValue)}
            </Text>
          </View>
        </View>
      </View>

      {/* ----- The Input Field For Data Take ----- */}
      <InputField
        label={"Dispatch Amount"}
        placeholder={`${parseInt(loanInfo?.payPerMonth) * rangeMonthValue} TK`}
        keyboardType={"numeric"}
        value={data}
        onChangeText={(text) => setData(text)}
      />

      {/* ---- Move To Dispatch Loan Section ----- */}
      <View style={{ alignSelf: "center", marginTop: 20 }}>
        <View style={{ marginBottom: 10 }}>
          <OutlineButton
            title="See All Dates Log"
            color="brown" 
            width={380}
            height={40}
            size={15}
            onPress={() => handleBottomSheetOpen()}
          />
        </View>

        <Button
          title={"Dispatch Loan"}
          color1st={"orange"}
          color2nd={"red"}
          size={18}
          textColor={"white"}
          width={380}
          height={50}
          onPress={() => handleDispatch()}
        />
      </View>

      {/* ---- BottomSheet Here to see all over the Date logs ----- */}
      <BottomSheet
        bottomSheetRef={bottomSheetRef}
        setIsOpen={setBottomSheetOpen}
        snapPoint="80%"
        // handleSnapPress={handleSnapPress}
      >
        <View style={{ flexDirection: "column" }}>
          <View style={{ padding: 10 }}>
            <Text
              style={{ fontSize: 18, textAlign: "center", marginBottom: 10 }}
            >
              All Dispatch Dates Log
            </Text>
            <PickUpDuration {...loanInfo} />
          </View>

          <View style={{ marginTop: 10, marginLeft: 20 }}>
            <Button
              title={"Close Dates Log"}
              color1st={"red"}
              color2nd={"brown"}
              textColor={"white"}
              size={18}
              width={340}
              height={40}
              onPress={() => handleBottomSheetClose()}
            />
          </View>
        </View>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
  },
  sliderRange: {
    height: 20,
    width: "100%",
  },
  sliderRangeText: {
    marginLeft: 10,
    fontSize: 13,
  },
});

export default DispatchLoan;
