import { useState, useEffect } from "react";
import {
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  View
} from "react-native";

// {"date": "17-January-2023", "id": 3, "isActive": false, "isPaid": false}

// The Dates..
//  const data = [
//     {
//         id: '1',
//         isActive: false,
//         date: '12 January 2022'
//     },
//     {
//         id: '2',
//         isActive: true,
//         date: '12 February 2022'
//     },
//     {
//         id: '3',
//         isActive: false,
//         date: '12 March 2022'
//     },
//     {
//         id: '4',
//         isActive: false,
//         date: '12 April 2022'
//     }
// ];

// Picker Up From Duration..
const PickUpDuration = (props) => {
  // const [selectedPicker, setSelectedPicker] = useState(false);
  const [dates, setDate] = useState(props?.loanPeriods);

  // make the dates set at the first time here..
  useEffect(() => {
    setDate(props?.loanPeriods);
  }, [props]);

  // Loan Active Periods Handle..
  const handleActivePeriod = (isPaid) => {
    Alert.alert(!isPaid ? "You are not paid yet!" : "This is paid");
    // if (dates.length){
    //     setDate(prevState => {
    //         return prevState.map(period => {
    //             if (period.id === id){
    //                 period.isActive = !period.isActive;
    //                 return period;
    //             }
    //             return period;
    //         })
    //     });

    //     console.log("STATE -- ", dates);

    // }else{
    //     Alert.alert('Id Not Found!');
    // }
  };

  //
  console.log("Picker Dates -- ", dates);

  // Rendering Month Picker here..
  const renderMonthPickers = () => {
    if (dates) {
      return dates.length
        ? dates.map((picker, index) => (
            <TouchableOpacity
              style={
                !picker.isPaid
                  ? styles.pickerContainer
                  : styles.pickerContainerActive
              }
              key={index}
              onPress={() => handleActivePeriod(picker.isPaid)}
            >
              <Text
                style={
                  !picker.isPaid ? styles.pickerText : styles.pickerTextActive
                }
              >
                {picker.date}
              </Text>
            </TouchableOpacity>
          ))
        : null;
    }
  };

  // The returning statement here..
  return (
    <ScrollView
      horizontal={false}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      style={styles.container}
    >
      <View>{renderMonthPickers()}</View>
    </ScrollView>
  );
};

// The stylesheet for react..
const styles = StyleSheet.create({
  container: {
    // flex: 1
    textAlign: "center",
    height: 350
  },
  pickerContainer: {
    padding: 10,
    borderRadius: 20,
    margin: 5,
    height: 50,
    borderWidth: 2,
    borderColor: "orange",
    justifyContent: "center",
  },
  pickerContainerActive: {
    padding: 10,
    backgroundColor: "brown",
    borderRadius: 20,
    margin: 5,
    height: 50,
    borderWidth: 2,
    borderColor: "white",
    justifyContent: "center",
  },
  pickerText: {
    color: "black",
    fontWeight: "bold",
    textAlign: "center",
  },
  pickerTextActive: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default PickUpDuration;
