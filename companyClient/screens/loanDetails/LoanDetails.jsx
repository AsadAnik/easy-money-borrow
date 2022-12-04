import { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Button } from '../../components/widgets/Button';
import { getLoanDetailsByLoanId, getCompanyById } from '../../API';
import { calculateWithInterest, calculateWithPayDuration } from '../../services/calculations';
import { getFormatedDate } from '../../services/dateFormatService';

// title, color1st, color2nd, size, textColor, width, height, onPress, children

// Loan Details Screen ..
const LoanDetails = ({ navigation, route }) => {
    const { loanId } = route.params;
    const [data, setData] = useState(null);
    const [companyData, setCompanyData] = useState(null);

    // Fetching the Loan Details..
    const fetchLoanDetails = async () => {
        const response = await getLoanDetailsByLoanId(loanId);

        if (response.success) {
            const { loan: loanData } = response;
            setData(loanData);

            if (loanData.companyId) {
                // Company Fields Fetching from companyId..
                const companyResponse = await getCompanyById(loanData.companyId);
                if (companyResponse.success) {
                    const { company } = companyResponse;
                    setCompanyData(company);
                }
            }
        }
    };

    // Use Effect Hook..
    useEffect(() => {
        fetchLoanDetails();
        // Cleanup Function..
        return () => {
            setData(null);
            setCompanyData(null);
        };
    }, []);

    // Rendering the request..
    const renderRequest = (requestStatus) => (
        requestStatus === 'PENDING' ?
            (
                <Text style={[styles.colText, { color: 'orange' }]}>{data.request}</Text>
            )
            : requestStatus === 'ACCEPTED' ?
                (
                    <Text style={[styles.colText, { color: 'green' }]}>{data.request}</Text>
                )
                :
                (
                    <Text style={[styles.colText, { color: 'red' }]}>{data.request}</Text>
                )
    );


    // Rendering the status...
    const renderStatus = (status) => (
        status === 'NULL' ? (
            <Text style={[styles.colText, { color: 'red' }]}>{status}</Text>
        )
            : status === 'RUNNING' ? (
                <Text style={[styles.colText, { color: 'orange' }]}>{status}</Text>
            )
                :
                (
                    <Text style={[styles.colText, { color: 'green' }]}>{status}</Text>
                )
    );

    console.log('Data -- ', data);
    console.log('Company -- ', companyData);

    // Returning Statement..

    if (data && companyData) {
        return (
            <View style={styles.container}>
                <StatusBar style={"light"} />

                <View style={styles.row}>
                    <View style={styles.col}>
                        <Text style={styles.colHeadingText}>{companyData.name}</Text>
                        {renderRequest(data.request)}
                    </View>

                    <View style={styles.col}>
                        <Text style={styles.colHeadingText}>{companyData.offersRate} %</Text>
                        <Text style={[styles.colText, { color: 'brown' }]}>INTERESTS</Text>
                    </View>
                </View>

                <View style={styles.row}>
                    <View style={styles.col}>
                        <Text style={styles.colHeadingText}>{data.amounts} TK</Text>
                        {renderStatus(data.status)}
                    </View>

                    <View style={styles.col}>
                        <Text style={styles.colHeadingText}>{calculateWithInterest(data.amounts, companyData.offersRate)} TK</Text>
                        <Text style={styles.colText}>HAVE TO PAY</Text>
                    </View>
                </View>

                <View style={styles.row}>
                    <View style={styles.col}>
                        <Text style={styles.colHeadingText}>{calculateWithPayDuration(data.amounts, companyData.offersRate, data.payDuration)} TK</Text>
                        <Text style={styles.colText}>PAY PER MONTH</Text>
                    </View>

                    <View style={styles.col}>
                        <Text style={styles.colHeadingText}>{data.nextPayRound} Month</Text>
                        <Text style={styles.colText}>PER DISPATCH</Text>
                    </View>
                </View>

                <View style={styles.row}>
                    {data.status === 'RUNNING' && data.request === 'ACCEPTED' ?
                        (
                            <View style={styles.col}>
                                <Text style={styles.colHeadingText}>{data.nextPayDate}</Text>
                                <Text style={styles.colText}>NEXT PAY DATE</Text>
                            </View>
                        )
                        :
                        (
                            <View style={styles.col}>
                                <Text style={styles.colHeadingText}>{getFormatedDate(new Date(data.createdAt))}</Text>
                                <Text style={[styles.colText, { color: 'royalblue' }]}>STARTING DATE</Text>
                            </View>
                        )
                    }

                    <View style={styles.col}>
                        <Text style={styles.colHeadingText}>{data.payDuration} Months</Text>
                        <Text style={styles.colText}>DURATION</Text>
                    </View>
                </View>

                {data.status === 'RUNNING' &&
                    (
                        <View style={styles.row}>
                            <View style={styles.col}>
                                <Text style={styles.colHeadingText}>{getFormatedDate(new Date(data.createdAt))}</Text>
                                <Text style={[styles.colText, { color: 'royalblue' }]}>STARTING DATE</Text>
                            </View>

                            <View style={styles.col}>
                                <Text style={styles.colHeadingText}>{data.expiredDate}</Text>
                                <Text style={[styles.colText, { color: 'red' }]}>EXPIRED DATE</Text>
                            </View>
                        </View>
                    )}

                {/* ---- Move To Dispatch Loan Section ----- */}
                {data.status === 'RUNNING' ?
                    (
                        <Button
                            title={"Go For Dispatch"}
                            color1st={"brown"}
                            color2nd={"chocolate"}
                            size={18}
                            textColor={"white"}
                            width={380}
                            height={50}
                            onPress={() => navigation.navigate("DispatchLoan", data._id)}
                        />
                    )
                    :
                    (
                        <Button
                            title={"Nothing to Dispatch Go Back"}
                            color1st={"red"}
                            color2nd={"maroon"}
                            size={18}
                            textColor={"white"}
                            width={380}
                            height={50}
                            onPress={() => navigation.navigate("MyRequests")}
                        />
                    )}
            </View>
        );
    } else {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text style={{ fontSize: 30, color: 'lightgray', fontWeight: "bold" }}>No Loan Details Found</Text>
            </View>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 10,
        alignItems: 'center',
    },
    row: {
        flexDirection: 'row',
    },
    col: {
        flex: 1,
        margin: 10,
        padding: 10,
        marginBottom: 20,
        borderRadius: 10,
        // backgroundColor: 'lightgray',
        borderWidth: 1,
        borderColor: 'lightgray',
    },
    colHeadingText: {
        fontSize: 18,
        textAlign: 'center',
    },
    colText: {
        textAlign: 'center',
        fontWeight: 'bold',
        color: 'gray',
        fontSize: 14,
    }
});

export default LoanDetails;