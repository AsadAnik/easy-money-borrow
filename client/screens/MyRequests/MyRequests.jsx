import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Header from '../../components/Header/Header';
import LoanLogCard from '../../components/LoanLogCard/LoanLogCard';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getUserLoanRequests, loanStatus } from '../../API';


const MyRequests = ({ navigation }) => {
    const [data, setData] = useState([]);
    const [refresh, setRefresh] = useState(false);

    // Fetching Get User Loan Requests..
    const fetchLoanRequests = async () => {
        const response = await getUserLoanRequests();
        if (response.success) {
            const { loans } = response;
            setData(loans);
        }
    };

    // Checking the loan status..
    const checkLoanStatus = async () => {
        const response = await loanStatus();
        return response;
    };

    useEffect(() => {
        // Fetch Loan Requests..
        fetchLoanRequests();
        checkLoanStatus();
    }, []);

    // When Pull Down Refreshed the page..
    const pullMe = () => {
        setRefresh(true);

        if (data.length) {
            fetchLoanRequests();
            checkLoanStatus();
        }
        
        setTimeout(() => {
            setRefresh(false);
        }, 1000);
    };

    // Rendering Loan Requests List..
    const renderLoanRequestsList = (loans) => (
        loans.length > 0 ?
            loans.map(loan => (
                <View key={loan._id}>
                    <LoanLogCard
                        type={loan.request}
                        status={loan.status}
                        amount={loan.amounts}
                        staticAmounts={loan.staticAmounts}
                        duration={loan.payDuration}
                        staticDuration={loan.staticPayDuration}
                        companyId={loan.companyId}
                        startedDate={loan.createdAt}
                        onPress={() => navigation.navigate("LoanDetails", { loanId: loan._id })}
                    />
                </View>
            ))
            :
            (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center", marginTop: 200 }}>
                    <MaterialCommunityIcons name="flask-empty-outline" size={50} color="lightgray" />
                    <Text style={styles.noRequests}>No Requests</Text>
                </View>
            )
    );

    // Returning Statement..
    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <Header>My Requests</Header>

            <ScrollView
                style={{ padding: 5 }}
                refreshControl={
                    <RefreshControl refreshing={refresh} onRefresh={() => pullMe()} />
                }
            >
                {renderLoanRequestsList(data)}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        backgroundColor: 'gray',
        paddingTop: 50,
        paddingBottom: 10,
        width: '100%',
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'white',
    },
    noRequests: {
        fontSize: 30,
        color: 'lightgray',
        fontWeight: 'bold',
        textAlign: 'center',
    }
});

export default MyRequests;