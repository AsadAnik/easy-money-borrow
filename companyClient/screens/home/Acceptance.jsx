import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import {
  getUserInfoById,
  getCompanyById,
  requestAcceptance,
  getCompanyLoanRequests,
  updateLoan,
} from "../../API";
import { Button } from "../../components/widgets/Button";
import {
  calculateWithInterest,
  calculateWithPayDuration,
} from "../../services/calculations";
import { getFormatedDate } from "../../services/dateFormatService";
import { EditInputField } from "../../components/widgets/InputField";
import { SelectList } from "react-native-dropdown-select-list";
// import BottomSheet from "../../components/widgets/BottomSheet";

// Acceptance Component..
const AcceptanceComp = ({ navigation, route }) => {
  const { params: Loan } = route;
  const [userData, setUserData] = useState({});
  const [companyData, setCompanyData] = useState({});
  const [loanData, setLoanData] = useState({ ...Loan });
  const [editMode, setEditMode] = useState({
    profileEdit: false,
    loanEdit: false,
  });

  //   const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  //   const bottomSheetRef = useRef(null);

  //   // Alternative Way to Open Bottom Sheet..
  //   const handleBottomSheetOpen = () => {
  //     bottomSheetRef.current?.expand();
  //     setIsBottomSheetOpen(true);
  //   };

  //   const handleBottomSheetClose = () => {
  //     bottomSheetRef.current?.close();
  //     setIsBottomSheetOpen(false);
  //   };

  // Fetch User Information..
  const fetchUserInfo = async () => {
    const response = await getUserInfoById(Loan.userId);
    if (response.success) {
      setUserData(response?.user);
    }
  };

  // Fetch Company Information..
  const fetchComapanyInfo = async () => {
    const response = await getCompanyById(Loan.companyId);
    if (response.success) {
      setCompanyData(response?.company);
    }
  };

  useEffect(() => {
    console.log("I am useEffect Hook");
    fetchUserInfo();
    fetchComapanyInfo();
  }, []);

  // console.log('USER DATA -- ', userData);
  // console.log('COMPANY DATA -- ', companyData);
  // console.log('LOAN DATA -- ', Loan);

  // Handle Edit Done..
  const handleEditDone = async () => {
    if (loanData) {
      console.log("Profile Data ==== ", loanData);
      const response = await updateLoan(loanData?._id, loanData);
      if (!response.success) {
        Alert.alert("Can't Update");
      }
      if (response.success) {
        navigation.navigate("MainTabs");
      }
    }
  };

  // Acceptance Method..
  const handleAcceptance = async (id, request) => {
    const response = await requestAcceptance(id, request);

    if (response.success) {
      getCompanyLoanRequests();
      navigation.navigate("MainTabs");
    }
  };

  // Rendering the Expired Date ..
  const renderExpiredDate = () => {
    if (Loan?.request === "ACCEPTED") {
      return (
        <View style={[styles.headerContainer, { flex: 1 }]}>
          <Text style={styles.textHeader}>EXPIRED AT</Text>
          <Text style={styles.textHeaderBody}>{Loan?.expiredDate}</Text>
        </View>
      );
    }
  };

  // Rendering The Dipatch Button..
  const renderDispatchButton = (status) => {
    if (status === "RUNNING") {
      return (
        <View style={{ marginTop: 10 }}>
          <Button
            title="DISPATCH"
            color1st="brown"
            color2nd="chocolate"
            size={20}
            textColor="white"
            width={360}
            height={40}
            onPress={() => navigation.navigate("DispatchLoan", loanData._id)}
          />
        </View>
      );
    } else {
      return null;
    }
  };

  // Rendering Button or Status..
  const renderButtonsOrStatus = (acceptRequest) => {
    if (acceptRequest === "ACCEPTED" || acceptRequest === "DENIED") {
      return null;
    } else {
      return (
        <View style={styles.buttonSection}>
          <View>
            <Button
              title="DENIED"
              color1st="red"
              color2nd="brown"
              size={20}
              textColor="white"
              width={180}
              height={40}
              onPress={() => handleAcceptance(Loan?._id, "DENIED")}
            />
          </View>

          <View style={{ marginLeft: 10 }}>
            <Button
              title="ACCEPT"
              color1st="lightgreen"
              color2nd="green"
              size={20}
              textColor="white"
              width={180}
              height={40}
              onPress={() => handleAcceptance(Loan?._id, "ACCEPTED")}
            />
          </View>
        </View>
      );
    }
  };

  // Conditionally rendering the profile picture or the avatar demo profile picture..
  const renderProfilePicture = (profilePictureURI) =>
    profilePictureURI ? (
      <Image
        rounded
        source={{ uri: profilePictureURI }}
        style={styles.profileImage}
      />
    ) : (
      <Image
        rounded
        source={require("../../assets/images/avatar-male.png")}
        style={styles.profileImage}
      />
    );

  // Conditional Rendering..
  if (!userData) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 30, color: "lightgray", fontWeight: "bold" }}>
          No Data
        </Text>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <View style={styles.profileHeader}>
          <View style={styles.profileImg}>
            {renderProfilePicture(userData.profilePictureURI)}
          </View>

          <View style={styles.profileInfo}>
            <View style={styles.headerContainer}>
              <Text style={styles.textHeader}>NAME</Text>
              <Text style={styles.textHeaderBody}>
                {userData.firstname} {userData.lastname}
              </Text>
              <Text>({userData.title})</Text>
            </View>

            <View style={styles.headerContainer}>
              <Text style={styles.textHeader}>NID</Text>
              <Text style={styles.textHeaderBody}>{userData.nid}</Text>
            </View>
          </View>

          <View style={styles.profileInfo2}>
            <View style={styles.headerContainer}>
              <Text style={styles.textHeader}>PHONE</Text>
              <Text style={styles.textHeaderBody}>+{userData.phone}</Text>
            </View>

            <View style={styles.headerContainer}>
              <Text style={styles.textHeader}>EMAIL</Text>
              <Text style={styles.textHeaderBody}>{userData.email}</Text>
            </View>
          </View>
        </View>

        {/* ----- Loan EDIT Button ----- */}
        <View style={{ flexDirection: "row" }}>
          {editMode.loanEdit && (
            <TouchableOpacity
              style={{
                marginTop: 10,
                borderRadius: 5,
                backgroundColor: "green",
                marginRight: 5,
              }}
              onPress={handleEditDone}
            >
              <View style={{ padding: 5, flexDirection: "row" }}>
                <AntDesign name="edit" size={15} color="white" />
                <Text style={{ fontSize: 12, marginLeft: 5, color: "white" }}>
                  Done
                </Text>
              </View>
            </TouchableOpacity>
          )}

          {Loan?.status === "RUNNING" && (
            <TouchableOpacity
              style={{
                marginTop: 10,
                borderRadius: 5,
                backgroundColor: "brown",
              }}
              onPress={() =>
                setEditMode({
                  ...editMode,
                  loanEdit: !editMode.loanEdit ? true : false,
                })
              }
            >
              <View style={{ padding: 5, flexDirection: "row" }}>
                <AntDesign name="edit" size={15} color="white" />
                <Text style={{ fontSize: 12, marginLeft: 5, color: "white" }}>
                  {!editMode.loanEdit ? "Edit" : "Cancel"}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>

        {/* ----- Loan Data Row ----- */}
        <View style={styles.profileBody}>
          <View style={[styles.headerContainer, { flex: 1 }]}>
            <Text style={styles.textHeader}>LOAN</Text>

            {!editMode.loanEdit ? (
              <Text style={styles.textHeaderBody}>{Loan.amounts} TK</Text>
            ) : (
              <EditInputField
                placeholder={"XX TK"}
                value={`${loanData?.amounts}`}
                keyboardType={"numeric"}
                onChangeText={(value) =>
                  setLoanData({ ...loanData, amounts: value })
                }
              />
            )}
          </View>

          <View style={[styles.headerContainer, { flex: 1 }]}>
            <Text style={styles.textHeader}>CONDITION</Text>

            {!editMode.loanEdit ? (
              <Text
                style={[
                  styles.textHeaderBody,
                  {
                    color:
                      Loan?.request === "PENDING"
                        ? "orange"
                        : Loan?.request === "ACCEPTED"
                        ? "green"
                        : "red",
                    fontWeight: "bold",
                  },
                ]}
              >
                {Loan?.request}
              </Text>
            ) : (
              <SelectList
                setSelected={(value) =>
                  setLoanData({ ...loanData, request: value })
                }
                data={[
                  { key: "1", value: "PENDING" },
                  { key: "2", value: "ACCEPTED" },
                  { key: "3", value: "DENIED" },
                ]}
                save="value"
                inputStyles={{
                  width: 50,
                  fontSize: 10,
                  padding: 0,
                }}
                dropdownTextStyles={{
                  fontSize: 10,
                }}
              />
            )}
          </View>

          <View style={[styles.headerContainer, { flex: 1 }]}>
            <Text style={styles.textHeader}>STATUS</Text>

            {!editMode.loanEdit ? (
              <Text
                style={[
                  styles.textHeaderBody,
                  {
                    color:
                      Loan?.status === "RUNNING"
                        ? "orange"
                        : Loan?.status === "FINISHED"
                        ? "green"
                        : "red",
                    fontWeight: "bold",
                  },
                ]}
              >
                {Loan?.status}
              </Text>
            ) : (
              <SelectList
                setSelected={(value) =>
                  setLoanData({ ...loanData, status: value })
                }
                data={[
                  { key: "1", value: "NULL" },
                  { key: "2", value: "RUNNING" },
                  { key: "3", value: "FINISHED" },
                ]}
                save="value"
                inputStyles={{
                  width: 30,
                  fontSize: 10,
                  padding: 0,
                }}
                dropdownStyles={{
                  width: 100,
                }}
                dropdownTextStyles={{
                  fontSize: 10,
                }}
              />
            )}
          </View>
        </View>

        <View style={styles.loanBody}>
          <View style={[styles.headerContainer, { flex: 1 }]}>
            <Text style={styles.textHeader}>INTERESTS</Text>

            <Text style={[styles.textHeaderBody, { fontWeight: "bold" }]}>
              {companyData?.offersRate}%
            </Text>
            {/* {!editMode.loanEdit ? (
                            <Text style={[styles.textHeaderBody, { fontWeight: 'bold' }]}>{companyData?.offersRate}%</Text>
                        ) : (

                            <EditInputField
                                placeholder={"10 %"}
                                value={`${companyData?.offersRate}`}
                                onChangeText={(value) => setCompanyData({ ...companyData, offersRate: value })}
                            />
                        )} */}
          </View>

          <View style={[styles.headerContainer, { flex: 1 }]}>
            <Text style={styles.textHeader}>HAVE TO PAY</Text>

            {!editMode.loanEdit ? (
              <Text style={[styles.textHeaderBody, { fontWeight: "bold" }]}>
                {calculateWithInterest(Loan?.amounts, companyData?.offersRate)}{" "}
                TK
              </Text>
            ) : (
              <EditInputField
                placeholder={`${calculateWithInterest(
                  Loan?.amounts,
                  companyData?.offersRate
                )}`}
                value={`${calculateWithInterest(
                  Loan?.amounts,
                  companyData?.offersRate
                )}`}
                onChangeText={(value) =>
                  setLoanData({ ...loanData, amountsWithInterest: value })
                }
              />
            )}
          </View>

          <View style={[styles.headerContainer, { flex: 1 }]}>
            <Text style={styles.textHeader}>MONTHLY PAY</Text>

            {!editMode.loanEdit ? (
              <Text style={styles.textHeaderBody}>
                {calculateWithPayDuration(
                  Loan?.amounts,
                  companyData?.offersRate,
                  Loan?.payDuration
                )}{" "}
                TK
              </Text>
            ) : (
              <EditInputField
                placeholder={`${calculateWithPayDuration(
                  Loan?.amounts,
                  companyData?.offersRate,
                  Loan?.payDuration
                )}`}
                value={`${calculateWithPayDuration(
                  Loan?.amounts,
                  companyData?.offersRate,
                  Loan?.payDuration
                )}`}
                onChangeText={(value) =>
                  setLoanData({ ...loanData, payPerMonth: value })
                }
              />
            )}
          </View>
        </View>

        <View style={styles.loanBody}>
          <View style={[styles.headerContainer, { flex: 1 }]}>
            <Text style={styles.textHeader}>DURATION</Text>

            {!editMode.loanEdit ? (
              <Text style={styles.textHeaderBody}>
                {Loan?.payDuration} Months
              </Text>
            ) : (
              <EditInputField
                placeholder={`${loanData?.payDuration}`}
                value={`${loanData?.payDuration}`}
                onChangeText={(value) =>
                  setLoanData({ ...loanData, payDuration: value })
                }
              />
            )}
          </View>

          <View style={[styles.headerContainer, { flex: 1 }]}>
            <Text style={styles.textHeader}>STARTING AT</Text>
            <Text style={styles.textHeaderBody}>
              {getFormatedDate(new Date(Loan?.createdAt))}
            </Text>
          </View>

          {renderExpiredDate()}
        </View>

        {Loan?.request === "ACCEPTED" && renderDispatchButton(Loan?.status)}
        {renderButtonsOrStatus(Loan?.request)}

        {/* <BottomSheet
          bottomSheetRef={bottomSheetRef}
          setIsOpen={setIsBottomSheetOpen}
          snapPoint="40%"
          // handleSnapPress={handleSnapPress}
        >
          <View>
            <Text>Hello All</Text>

            <SelectList
              setSelected={(value) =>
                setLoanData({ ...loanData, request: value })
              }
              data={[
                { key: "1", value: "PENDING" },
                { key: "2", value: "ACCEPTED" },
                { key: "3", value: "DENIED" },
              ]}
              save="value"
              inputStyles={{
                width: 50,
                fontSize: 12,
              }}
              dropdownStyles={{
                width: 200,
              }}
            />
          </View>
        </BottomSheet> */}
      </View>
    );
  }
};

// StyleSheet..
const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
  },
  textHeader: {
    textAlign: "center",
    fontWeight: "bold",
    color: "gray",
  },
  textHeaderBody: {
    fontSize: 12,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  profileHeader: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "lightgray",
    padding: 10,
  },
  profileImg: {
    flex: 1,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 100,
    borderWidth: 5,
    borderColor: "white",
  },
  profileInfo: {
    flex: 1,
  },
  profileInfo2: {
    flex: 1,
  },

  // Profile Body CSS..
  profileBody: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "lightgray",
    padding: 10,
    marginTop: 10,
  },

  // Loan Body CSS..
  loanBody: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "lightgray",
    padding: 10,
    marginTop: 10,
  },

  // Button Section..
  buttonSection: {
    flex: 1,
    marginTop: 10,
    flexDirection: "row",
  },
});

export default AcceptanceComp;
