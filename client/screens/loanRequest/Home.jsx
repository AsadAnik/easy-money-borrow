import { useState, useEffect } from "react";
import { View, Text, StyleSheet, ImageBackground, Alert } from "react-native";
import { StatusBar } from "expo-status-bar";
import InputField from "../../components/widgets/InputField";
import { Button } from "../../components/widgets/Button";
// import Header from '../../components/Header/Header';
import * as Animatable from "react-native-animatable";
import SelectDropdown from "react-native-select-dropdown";
import { getCompanies } from "../../API";
import SliderRange from "../../components/widgets/SliderRange";

// Home Component...
const Home = ({ navigation }) => {
  const [data, setData] = useState({
    // State..
    company: "",
    amounts: null,
    companyId: "",
    payDuration: null,
    offersRate: "",
  });
  const [selectCompanies, setCompanies] = useState([]);

  // Get All Companies..
  const fetchCompaniesToSelectOptions = async () => {
    const response = await getCompanies();

    if (response) {
      if (response.success) {
        const { companies } = response;
        setCompanies(companies);
      }
    }
  };

  // Hook..
  useEffect(() => {
    fetchCompaniesToSelectOptions();
  }, []);

  // Handle Change function..
  const handleChange = (type, value) => {
    // Code Here..
    if (type === "AMOUNTS") {
      setData({
        ...data,
        amounts: value,
      });
    }
    if (type === "DURATION") {
      setData({
        ...data,
        payDuration: value,
      });
    }
  };

  // Request Handler...
  const handleSubmitRequest = () => {
    if (!data.amounts || !data.payDuration || !data.companyId) {
      Alert.alert("Plesae insert all values !");
    } else {
      // navigation.navigate("RequestDone");
      Alert.alert(
        "Let's see your status and then make request if you wants so."
      );
      navigation.navigate("LoanStatus", data);
    }
  };

  // Let's log the data of state of this component..
  console.log("Lets See the State data -- ", data);

  // Can Select The Companies With Name And it gives id stores into state..
  const renderSelectCompanyBar = (companies) => {
    if (companies.length) {
      return (
        <View>
          <Text
            style={{
              fontSize: 15,
              paddingLeft: 10,
              textTransform: "capitalize",
            }}
          >
            Company
          </Text>

          <SelectDropdown
            data={companies}
            onSelect={(selectedItem) => {
              // Here We can get the selected Item.. and set into state or API..
              // const { _id, name } = selectedItem;
              const { _id, name, offersRate } = selectedItem;
              // console.log(_id, name);
              setData({
                ...data,
                company: name,
                companyId: _id,
                offersRate,
              });
            }}
            buttonTextAfterSelection={(selectedItem) => {
              // text represented after item is selected
              // if data array is an array of objects then return selectedItem.property to render after item is selected
              return `${selectedItem.name}`;
            }}
            rowTextForSelection={(item) => {
              // text represented for each item in dropdown
              // if data array is an array of objects then return item.property to represent item in dropdown
              return `${item.name} (${item.offersRate}%)`;
            }}
            search={true}
            buttonStyle={{
              borderRadius: 10,
              backgroundColor: "lightgray",
              width: 350,
              margin: 10,
              padding: 10,
            }}
          />
        </View>
      );
    }
  };

  // Returning Statement...
  return (
    <ImageBackground
      style={styles.container}
      source={require("../../assets/images/post3.jpg")}
    >
      <StatusBar style="light" />
      {/* <Header>Make Loan Request</Header> */}

      <View style={{ flex: 1 }}></View>

      <Animatable.View
        animation="fadeInUpBig"
        style={styles.animatableViewContainer}
      >
        <View style={styles.body}>
          {renderSelectCompanyBar(selectCompanies)}

          <InputField
            label={"loan amount"}
            placeholder={"5000"}
            keyboardType={"numeric"}
            value={data.amounts}
            onChangeText={(value) => handleChange("AMOUNTS", value)}
          />

          {/* <InputField
            label={"pay duration"}
            placeholder={"6 Month"}
            keyboardType={"numeric"}
            value={data.payDuration}
            onChangeText={(value) => handleChange("DURATION", value)}
          /> */}

          {/* ----- Slider ----- */}
          <Text style={{ fontSize: 15, paddingLeft: 10, paddingTop: 10 }}>
            Loan Duration
            {" "}<Text style={{fontWeight: 'bold', fontSize: 18}}>{data.payDuration}</Text> {data.payDuration > 1 ? "Months" : "Month"}{" "}
          </Text>
          <SliderRange
            rangeMonthValue={data.payDuration}
            onValueChange={(value) => setData({ ...data, payDuration: value })}
            payDuration={12}
            style={styles.sliderRange}
          />

          {/* <InputField
                        label={"pay per month"}
                        placeholder={"1 Month"}
                        keyboardType={"numeric"}
                        onChangeText={() => handleChange()}
                    /> */}

          {/* title, color1st, color2nd, size, textColor, width, height, onPress, children */}
          <View style={styles.buttonContainer}>
            <Button
              title="Check Status To Request"
              color1st="lightblue"
              color2nd="royalblue"
              size={18}
              textColor="white"
              width="100%"
              height={50}
              onPress={() => handleSubmitRequest()}
            />
          </View>
        </View>
      </Animatable.View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  animatableViewContainer: {
    flex: 4,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 30,
    paddingHorizontal: 20,
    width: "100%",
  },
  body: {
    marginTop: 0,
  },
  buttonContainer: {
    margin: 10,
  },
});

export default Home;
