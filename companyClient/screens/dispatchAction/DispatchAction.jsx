import { useState, useEffect } from 'react';
import { View, Alert, Text, ScrollView, RefreshControl } from 'react-native';
import Header from '../../components/Header/Header';
import LoanRequestCard from '../../components/LoanLogCard/LoanLogCard';
import { getPendingDispatchs, getLoanDetailsByLoanId } from '../../API';
import { getFormatedDate } from '../../services/dateFormatService';


// Dispatch Action Component..
const DispatchAction = () => {
    const [pendingDispatchData, setPendingDispatchData] = useState([]);
    const [loanInfo, setLoanInfo] = useState([]);
    const [refresh, setRefresh] = useState(false);

    const fetchData = async () => {
        const response = await getPendingDispatchs();

        if (response) {
            if (!response.success) {
                Alert.alert(response.message);
            }

            if (response.success) {
                setPendingDispatchData(response.loans);
                const { loanId } = response.loans;
                const loanResponse = await getLoanDetailsByLoanId(loanId);

                if (loanResponse){
                    if (!loanResponse.success){
                        Alert.alert(loanResponse.message);
                    }

                    if (loanResponse.success){
                        const { loan: loanInfo } = loanResponse;
                        setLoanInfo(loanInfo);
                    }
                }
            }
        }
    };

    console.log('The Loan Info -- ', loanInfo);

    useEffect(() => {
        fetchData();

        // The Cleanup Function here..
        return () => {
            setPendingDispatchData([]);
        };
    }, []);

    console.log('Pending ---- ', pendingDispatchData);

    // When Pull Down Refreshed the page..
    const pullMe = () => {
        setRefresh(true);

        if (pendingDispatchData.length) {
            fetchData();
            // checkLoanStatus();
        }

        setTimeout(() => {
            setRefresh(false);
        }, 1000);
    };

    const renderPendingDispatchList = (data) => {
        if (data.length) {
            return data.map(pendingDispatch => {
                return (
                    <View key={pendingDispatch._id}>
                        <LoanRequestCard
                            // type={"PENDING"}
                            status={pendingDispatch.status}
                            amount={pendingDispatch.amounts}
                            staticAmounts={"1200"}
                            duration={pendingDispatch.payDuration}
                            staticDuration={pendingDispatch.staticPayDuration}
                            company={"LJO"}
                            userId={pendingDispatch.userId}
                            startedDate={getFormatedDate(new Date(pendingDispatch?.updatedAt))}
                        // onPress={() => navigation.navigate("Acceptance", loan)}
                        />
                    </View>
                );
            });
        }

        if (!data.length) {
            return (
                <View>
                    <Text>No Data</Text>
                </View>
            );
        }
    };

    return (
        <View>
            <Header>Dispatch Actions</Header>

            <ScrollView 
                refreshControl={
                    <RefreshControl refreshing={refresh} onRefresh={() => pullMe()} />
                }
            >
                {renderPendingDispatchList(pendingDispatchData)}
            </ScrollView>
        </View>
    );
};

export default DispatchAction;