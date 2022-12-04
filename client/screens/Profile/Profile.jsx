import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { AntDesign, Feather } from "@expo/vector-icons";
// import Header from '../../components/Header/Header';
import { StatusBar } from "expo-status-bar";
import { logoutUser } from "../../API";
import Loading from "../../components/widgets/Loading";
import { authChecker } from "../../API";
import * as Animatable from "react-native-animatable";

// title, color, height, width, size, onPress, children

const Profile = ({ navigation }) => {
  const [showBalance, setShowBalance] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState({});

  // Set profile data..
  const setProfileData = async () => {
    const response = await authChecker();

    if (response.isAuth) {
      setLoading(false);
      setData({ ...response?.user });
    }
  };

  // Make Profile Balance Show Off..
//   useEffect(() => {
//     setTimeout(() => {
//       setShowBalance(false);
//     }, 2000);
//   }, [showBalance]);

  // Hook..
  useEffect(() => {
    // useEffect..
    setLoading(true);
    setProfileData();
  }, []);

  console.log("PROFILE DATA == ", data);

  // Logout Function..
  const handleLogout = async () => {
    setLoading(true);

    try {
      const response = await logoutUser();
      if (response.data) {
        const { isAuth } = response.data;
        if (!isAuth) {
          setLoading(false);
          navigation.navigate("Login");
        }
      }
    } catch (error) {
      alert(error.message);
    }
  };

  // Profile Picture Rendering..
  const renderProfilePicture = (profileURI) =>
    profileURI === "" || !profileURI ? (
      <Image
        style={styles.profilePicture}
        source={require("../../assets/images/avatar-male.png")}
      />
    ) : (
      <Image style={styles.profilePicture} source={{ uri: profileURI }} />
    );

  // Profile Rendering..
  const renderProfile = (profileData) =>
    !profileData ? (
      <Loading visible={true} text={"Data Loading..."} />
    ) : (
      <View>
        {renderProfilePicture(profileData.profilePictureURI)}

        <View style={styles.namesTextWrapper}>
          <Text style={styles.hiText}>Hi,</Text>
          <Text style={styles.namesText}>
            {profileData.firstname} {profileData.lastname} ({profileData.title})
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => {
            setShowBalance(true);
            setTimeout(() => {
              setShowBalance(false);
            }, 2000);
          }}
        >
          {renderBalanceAmounts(showBalance, profileData.balance)}
        </TouchableOpacity>

        <View
          style={{
            flexDirection: "row",
            marginTop: 30,
            justifyContent: "center",
          }}
        >
          <View style={[styles.profileItemsBox, { marginRight: 20 }]}>
            <Text>{profileData.nid}</Text>
            <Text
              style={[styles.textCenter, { fontWeight: "bold", color: "gray" }]}
            >
              NID
            </Text>
          </View>

          <View style={styles.profileItemsBox}>
            <Text>{profileData.phone}</Text>
            <Text
              style={[styles.textCenter, { fontWeight: "bold", color: "gray" }]}
            >
              PHONE
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            marginTop: 20,
            justifyContent: "center",
          }}
        >
          <View style={[styles.profileItemsBox, { marginRight: 20 }]}>
            <Text>{profileData.email}</Text>
            <Text
              style={[styles.textCenter, { fontWeight: "bold", color: "gray" }]}
            >
              EMAIL
            </Text>
          </View>

          <View style={styles.profileItemsBox}>
            <Text>{profileData.title}</Text>
            <Text
              style={[styles.textCenter, { fontWeight: "bold", color: "gray" }]}
            >
              TITLE
            </Text>
          </View>
        </View>
      </View>
    );

  // Balance Rendering..
  const renderBalanceAmounts = (show, amount) =>
    !show ? (
      <View style={styles.checkBalance}>
        <Text style={styles.checkBalanceText}>Tap To Check Balance</Text>
      </View>
    ) : (
      <View style={[styles.checkBalance, styles.checkBalanceWithAmount]}>
        <Text
          style={[styles.checkBalanceText, styles.checkBalanceTextWithBalance]}
        >
          {amount} TK
        </Text>
      </View>
    );

  return (
    <ImageBackground
      style={styles.container}
      source={
        data.profilePictureURI
          ? { uri: data.profilePictureURI }
          : require("../../assets/images/post2.jpg")
      }
    >
      <Loading
        visible={isLoading}
        text={"Loading..."}
        textStyle={{ color: "white" }}
      />

      {/* <Header>My Profile</Header> */}
      <StatusBar style="auto" />

      <View style={{ flex: 1, flexDirection: "row" }}>
        {/*------ Logout Button -------*/}
        <View style={{ marginTop: 30, marginLeft: 300, marginRight: 10 }}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => handleLogout()}
          >
            <AntDesign name="logout" size={20} color="red" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* <View style={{ marginTop: 30, marginleft: 300, marginRight: 50 }}>
                    <TouchableOpacity
                        style={styles.logoutButton}
                        onPress={() => navigation.navigate("EditProfile", data)}
                    >
                        <Feather name="edit" size={20} color="black" />
                        <Text style={styles.logoutText}>Edit</Text>
                    </TouchableOpacity>
                </View> */}
      </View>

      {/* <View style={styles.profileBody}>
                {renderProfile(data)}
            </View> */}

      <Animatable.View
        style={styles.animatableViewContainer}
        animation="fadeInUpBig"
      >
        <View style={styles.profileBody}>{renderProfile(data)}</View>
      </Animatable.View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  profileBody: {
    flexDirection: "column",
  },
  animatableViewContainer: {
    flex: 4,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 30,
    paddingHorizontal: 20,
    width: "100%",
    alignItems: "center",
  },
  profilePicture: {
    borderRadius: 100,
    // marginTop: 10,
    width: 200,
    height: 200,
    alignSelf: 'center',
  },
  namesTextWrapper: {
    marginTop: 10,
  },
  hiText: {
    fontSize: 30,
    color: "gray",
    fontWeight: "bold",
  },
  namesText: {
    fontSize: 20,
    marginLeft: 10,
    color: "gray",
  },
  checkBalance: {
    marginTop: 20,
    backgroundColor: "brown",
    padding: 5,
    borderRadius: 20,
  },
  checkBalanceText: {
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
  },
  checkBalanceWithAmount: {
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "brown",
  },
  checkBalanceTextWithBalance: {
    color: "brown",
  },
  logoutButton: {
    flexDirection: "column",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 20,
    backgroundColor: "lightgray",
    width: 60,
    padding: 5,
    borderRadius: 8,
    // borderWidth: 1,
  },
  logoutText: {
    color: "black",
    fontSize: 10,
    // fontWeight: 'bold'
  },
  textCenter: {
    textAlign: "center",
  },
  profileItemsBox: {
    // backgroundColor: 'lightgray',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "lightgray",
  },
});

export default Profile;
