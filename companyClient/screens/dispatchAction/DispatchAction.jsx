import { useState, useEffect } from 'react';
import { View, TouchableOpacity, Alert, Text } from 'react-native';
import Header from '../../components/Header/Header';
import LoanRequestCard from '../../components/LoanLogCard/LoanLogCard';
import { getPendingDispatchs } from '../../API';
import { getFormatedDate } from '../../services/dateFormatService';

const DispatchAction = () => {
    const [pendingDispatchData, setPendingDispatchData] = useState([]);

    const fetchData = async () => {
        const response = await getPendingDispatchs();

        if (response) {
            if (!response.success) {
                Alert.alert(response.message);
            }

            if (response.success) {
                setPendingDispatchData(response.loans);
            }
        }
    };

    useEffect(() => {
        fetchData();

        // The Cleanup Function here..
        return () => {
            setPendingDispatchData([]);
        };
    }, []);

    console.log('Pending ---- ', pendingDispatchData);

    const renderPendingDispatchList = (data) => {
        if (data.length) {
            return data.map(pendingDispatch => {
                return (
                    <View key={pendingDispatch._id}>
                        <LoanRequestCard
                            // type={"PENDING"}
                            status={pendingDispatch.dispatchAction}
                            amount={1200}
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

            <TouchableOpacity>
                {/* <LoanRequestCard
                    type={"PENDING"}
                    status={"NULL"}
                    amount={1200}
                    staticAmounts={"1200"}
                    duration={5}
                    staticDuration={5}
                    company={"loan.companyId"}
                    userId={"loan.userId"}
                    startedDate={"getFormatedDate(new Date(loan?.createdAt))"}
                // onPress={() => navigation.navigate("Acceptance", loan)}
                /> */}

                {renderPendingDispatchList(pendingDispatchData)}
            </TouchableOpacity>
        </View>
    );
};

export default DispatchAction;