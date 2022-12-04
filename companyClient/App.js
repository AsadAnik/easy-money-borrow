import 'react-native-gesture-handler';
import { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loanStatus } from './API';

import SplashScreen from './screens/splash/Splash';
import LoginScreen from './screens/authentication/Login';
import RegisterScreen from './screens/authentication/Register';
import RegisterScreen2 from './screens/authentication/Register2';
import RegisterScreen3 from './screens/authentication/Register3';
import UploadProfile from './screens/authentication/UploadProfile';
import MainTabs from './screens/MainTabs';
import AcceptanceScreen from './screens/home/Acceptance';

// import LoanStatusScreen from './screens/loanRequest/LoanStatus';
// import RequestDoneScreen from './screens/loanRequest/RequestDone';
import LoanDetailsScreen from './screens/loanDetails/LoanDetails';
import DispatchLoanScreen from './screens/dispatchLoan/DispatchLoan';
import DispatchDoneScreen from './screens/dispatchLoan/DispatchDone';

// Stack Navigation..
const Stack = createNativeStackNavigator();

export default function App() {
  const [isFirstLaunch, setFirstLaunch] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem("alreadyLaunched").then(value => {
      if (value === null) {
        AsyncStorage.setItem("alreadyLaunched", 'true');
        setFirstLaunch(true);
      } else {
        setFirstLaunch(false);
      }
    });
  }, []);

  // Firstly Checks the loan status here..
  // Checking the loan status..
  const checkLoanStatus = async () => {
    const response = await loanStatus();
    return response;
  };

  useEffect(() => {
    checkLoanStatus();
  }, []);

  /**
   * ---- First Launch will showing Onboarding and Splash screen ----
   * ---- Or Showing with 2nd entry without Onboarding and Splash screen ----
   */

  if (isFirstLaunch === null) {
    return null;

  } else if (isFirstLaunch === true) {
    return (
      <NavigationContainer>
        <Stack.Navigator
          useLagacyImplementation={true}
          initialRouteName="Onboarding"
        >

          {/* ---- Splash Screen ---- */}
          <Stack.Screen
            name="Splash"
            component={SplashScreen}
            options={{
              headerShown: false,
            }}
          />

          {/* ---- Login Screen ---- */}
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{
              headerShown: false,
            }}
          />

          {/* ---- Register Screen ---- */}
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{
              headerShown: false,
            }}
          />

          {/* ----- 2nd Register Screen ---- */}
          <Stack.Screen
            name="Register2"
            component={RegisterScreen2}
            options={{
              headerShown: false,
            }}
          />

          {/* ---- 3rd Register Screen ---- */}
          <Stack.Screen
            name="Register3"
            component={RegisterScreen3}
            options={{
              headerShown: false,
            }}
          />

          {/* ----- 4th Stage Uploading Profile Picture ---- */}
          <Stack.Screen
            name="UploadProfile"
            component={UploadProfile}
            options={{
              headerShown: false,
            }}
          />

          {/* ---- Main Screens Stack Of Tab Navigation ---- */}
          <Stack.Screen
            name="MainTabs"
            component={MainTabs}
            options={{
              headerShown: false,
            }}
          />

          {/* ----- Acceptance Screen ----- */}
          <Stack.Screen
            name="Acceptance"
            component={AcceptanceScreen}
            options={{
              headerShown: true,
              headerStyle: {
                backgroundColor: 'gray',
              },
              headerTintColor: 'white',
            }}
          />

          {/* ----- Status Screen ----- */}
          {/* <Stack.Screen
            name="LoanStatus"
            component={LoanStatusScreen}
            options={{
              headerShown: false,
            }}
          /> */}

          {/* ---- Request Done ----- */}
          {/* <Stack.Screen
            name="RequestDone"
            component={RequestDoneScreen}
            options={{
              // headerTitle: "",
              headerShown: false
            }}
          /> */}

          {/* ---- Loan Details Screen ----- */}
          <Stack.Screen
            name="LoanDetails"
            component={LoanDetailsScreen}
            options={{
              headerTitle: "Loan Details",
              headerStyle: {
                backgroundColor: 'gray'
              },
              headerTintColor: 'white',
              headerTitleStyle: {
                fontWeight: 'bold',
                fontSize: 20
              }
            }}
          />

          {/* ---- Dispatch Loan Screen ----- */}
          <Stack.Screen
            name="DispatchLoan"
            component={DispatchLoanScreen}
            options={{
              headerTitle: "Dispatch Your Loan",
              headerStyle: {
                backgroundColor: 'gray'
              },
              headerTintColor: 'white',
              headerTitleStyle: {
                fontWeight: 'bold',
                fontSize: 20
              }
            }}
          />

          {/* ---- Request Done ----- */}
          <Stack.Screen
            name="DispatchDone"
            component={DispatchDoneScreen}
            options={{
              // headerTitle: "",
              headerShown: false
            }}
          />

        </Stack.Navigator>
      </NavigationContainer>
    );

  } else {
    return (
      <NavigationContainer>
        <Stack.Navigator
          useLagacyImplementation={true}
          initialRouteName="Login"
        >
          {/* ---- Login Screen ---- */}
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{
              headerShown: false,
            }}
          />

          {/* ---- Register Screen ---- */}
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{
              headerShown: false,
            }}
          />

          {/* ----- 2nd Register Screen ---- */}
          <Stack.Screen
            name="Register2"
            component={RegisterScreen2}
            options={{
              headerShown: false,
            }}
          />

          {/* ---- 3rd Register Screen ---- */}
          <Stack.Screen
            name="Register3"
            component={RegisterScreen3}
            options={{
              headerShown: false,
            }}
          />

          {/* ----- 4th Stage Uploading Profile Picture ---- */}
          <Stack.Screen
            name="UploadProfile"
            component={UploadProfile}
            options={{
              headerShown: false,
            }}
          />

          {/* ---- Main Screens Stack Of Tab Navigation ---- */}
          <Stack.Screen
            name="MainTabs"
            component={MainTabs}
            options={{
              headerShown: false,
            }}
          />

          {/* ----- Acceptance Screen ----- */}
          <Stack.Screen
            name="Acceptance"
            component={AcceptanceScreen}
            options={{
              headerShown: true,
              headerStyle: {
                backgroundColor: 'gray',
              },
              headerTintColor: 'white',
            }}
          />

          {/* ----- Status Screen ----- */}
          {/* <Stack.Screen
            name="LoanStatus"
            component={LoanStatusScreen}
            options={{
              headerShown: false,
            }}
          /> */}

          {/* ---- Request Done ----- */}
          {/* <Stack.Screen
            name="RequestDone"
            component={RequestDoneScreen}
            options={{
              // headerTitle: "",
              headerShown: false
            }}
          /> */}

          {/* ---- Loan Details Screen ----- */}
          <Stack.Screen
            name="LoanDetails"
            component={LoanDetailsScreen}
            options={{
              headerTitle: "Loan Details",
              headerStyle: {
                backgroundColor: 'gray'
              },
              headerTintColor: 'white',
              headerTitleStyle: {
                fontWeight: 'bold',
                fontSize: 20
              }
            }}
          />

          {/* ---- Dispatch Loan Screen ----- */}
          <Stack.Screen
            name="DispatchLoan"
            component={DispatchLoanScreen}
            options={{
              headerTitle: "Dispatch Your Loan",
              headerStyle: {
                backgroundColor: 'gray'
              },
              headerTintColor: 'white',
              headerTitleStyle: {
                fontWeight: 'bold',
                fontSize: 20
              }
            }}
          />

          {/* ---- Request Done ----- */}
          <Stack.Screen
            name="DispatchDone"
            component={DispatchDoneScreen}
            options={{
              // headerTitle: "",
              headerShown: false
            }}
          />

        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}