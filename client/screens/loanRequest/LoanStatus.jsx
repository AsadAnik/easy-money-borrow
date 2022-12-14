import { useState } from 'react';
import { View, Text, Alert, ImageBackground, StyleSheet, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Animatable from 'react-native-animatable';
import { Button } from '../../components/widgets/Button';
import { loanRequest } from '../../API';
import { calculateWithInterest, calculateWithPayDuration } from '../../services/calculations';
import Loading from '../../components/widgets/Loading';

// Device Screen Accual Width..
const windowWidth = Dimensions.get('window').width;


// The Loan Status here..
const LoanStatus = ({ navigation, route }) => {
    const [isLoading, setLoading] = useState(false);
    const { company, amounts, companyId, payDuration, offersRate } = route.params;

    // calculate the payment with company interest..
    // const calculateWithInterest = () => {
    //     const floatAmounts = parseFloat(amounts);
    //     const floatRate = parseFloat(offersRate);

    //     const persentageAmounts = floatAmounts * (floatRate / 100);
    //     const sumWithAmounts = floatAmounts + persentageAmounts;
    //     return sumWithAmounts;
    // };

    // calculate the pay duration time with pay per time of amounts..
    // const calculateWithPayDuration = () => {
    //     const amount = calculateWithInterest() / payDuration;
    //     return amount.toFixed(2);
    // };

    // Render Month (Month or Months)..
    const renderMonth = (duration) => {
        if (duration > 1) {
            return `${duration} Months`;
        } else {
            return `${duration} Month`;
        }
    };

    // Handle Submit 
    const handleSubmitRequest = () => {
        setLoading(true);

        if (companyId && payDuration && amounts) {
            loanRequest({ amounts, companyId, payDuration })
                .then(response => {
                    if (response) {
                        setLoading(false);
                        const { _id: loanId } = response;
                        navigation.navigate("RequestDone", {companyId, loanId});
                    }
                });
        } else {
            setLoading(false);
            Alert.alert("Something went wrong!");
        }
    };


    // Returning Statement..
    return (
        <ImageBackground style={styles.container} source={require('../../assets/images/post3.jpg')}>
            <StatusBar style={"light"} />

            <Loading 
                visible={isLoading}
                text={"Requesting..."}
                textStyle={{ color: 'white' }}
            />

            <View style={styles.view1}></View>

            <Animatable.View
                animation="fadeInUpBig"
                style={styles.view2}
            >
                <View>
                    <Text style={styles.textHeading}>Request To {company}</Text>

                    {/* ---- First Row ---- */}
                    <View style={styles.row}>
                        <View style={styles.col}>
                            <Text style={styles.colHeading}>{offersRate} %</Text>
                            <Text style={styles.colSubHeading}>Interests</Text>
                        </View>

                        <View style={styles.col}>
                            <Text style={styles.colHeading}>{calculateWithInterest(amounts, offersRate)} TK</Text>
                            <Text style={styles.colSubHeading}>Have to pay</Text>
                        </View>

                        <View style={styles.col}>
                            <Text style={styles.colHeading}>{renderMonth(payDuration)}</Text>
                            <Text style={styles.colSubHeading}>Duration</Text>
                        </View>
                    </View>

                    {/* ---- Second Row ---- */}
                    <View style={styles.row}>
                        <View style={styles.col}>
                            <Text style={styles.colHeading}>{calculateWithPayDuration(amounts, offersRate, payDuration)} TK</Text>
                            <Text style={styles.colSubHeading}>Monthly</Text>
                        </View>

                        <View style={styles.col}>
                            <Text style={styles.colHeading}>1 Month</Text>
                            <Text style={styles.colSubHeading}>Per pay</Text>
                        </View>

                        {/* <View style={styles.col}>
                            <Text style={styles.colHeading}>6 Months</Text>
                            <Text style={styles.colSubHeading}>Duration</Text>
                        </View> */}
                    </View>

                    <View style={{ flexDirection: 'row', marginTop: 40 }}>
                        <View style={{ flex: 1 }}>
                            <Button
                                title="Cancel"
                                color1st="red"
                                color2nd="maroon"
                                size={20}
                                textColor="white"
                                width={windowWidth - 1000}
                                height={50}
                                onPress={() => navigation.navigate("MainTabs")}
                            />
                        </View>

                        <View style={{ flex: 2, marginLeft: 15 }}>
                            <Button
                                title="Make Requests"
                                color1st="lightgreen"
                                color2nd="green"
                                size={20}
                                textColor="white"
                                width={windowWidth - 1000}
                                height={50}
                                onPress={() => handleSubmitRequest()}
                            />
                        </View>
                    </View>

                </View>
            </Animatable.View>

            <View style={styles.view3}></View>
        </ImageBackground>
    );
};

// Stylesheet for this..
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    view1: {
        flex: 2
    },
    view2: {
        flex: 2,
        backgroundColor: 'white',
        borderRadius: 30,
        padding: 20,
        marginLeft: 15,
        marginRight: 15
    },
    textHeading: {
        fontSize: 20,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    view3: {
        flex: 2
    },

    // Row and Col of the Application items..
    row: {
        flexDirection: 'row',
        marginTop: 20
    },
    col: {
        flex: 1,
        alignItems: 'center'
    },
    colHeading: {
        fontSize: 20,
    },
    colSubHeading: {
        fontSize: 13,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        color: 'gray',
    }
});

export default LoanStatus;