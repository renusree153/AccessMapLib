import * as Location from 'expo-location'
import { Text, StyleSheet, View, Button, Switch, Alert,  AsyncStorage, Platform} from 'react-native';
import React, {useState, useEffect, useRef, Component, useContext} from 'react';
import database1 from 'emissions-library4/firebase';
import firebase from 'firebase/compat/app';
import { firestore, getDatabase, ref, onValue, set, collection, addDoc } from "firebase/compat/firestore";
import { doc, setDoc } from "firebase/firestore"; 
import UserContext, { UserContextProvider } from '../../src/context';

let dataPlanArray = [];

export default function LocationFinder () {
  return (
    <UserContextProvider>
      <LocationFinderComponent />
    </UserContextProvider>
  )
}

function LocationFinderComponent () {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [localStorageData, setLocalStorageData] = useState(null);
  const {isRunning, setIsRunning} = useContext(UserContext); 
  var storePhoneId = null;
  var devName = null;
  var phoneModel = null;
  console.log(isRunning);
  const intervalIdRef = useRef(null);
  // useRef will  persist btw renders, doesnt cause component to reupdate on change
  // how can I get state of isEnabled into the useEffect
  useEffect(() => {
    if (!isRunning) {
      return;
    }
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      let dataPlan;
      let dataPlanString = (await AsyncStorage.getItem('isEnabled'));
      if (dataPlanString === 'true') {
        dataPlan = true;
      }
      else {
        dataPlan = false;
      }
      /*
      if (Platform.OS === 'ios') {
        Application.getIosIdForVendorAsync()
        .then(value => {
          storePhoneId = value;
        })
      }
      else if (Platform.OS === 'android') {
        storePhoneId = Application.androidId;
      }
      devName = Device.deviceName;
      console.log("this is devname " + devName);
      phoneModel = Device.modelName;
      console.log("phone model " + phoneModel);
      // Pixel 2, iPhone X
      phoneOs = Device.osName;
      console.log("phoneOS " + phoneOs);
      // IOS, android 
      */
      // gets dataPlan value from AsyncStorage which persists betweeen screen shifts
      console.log("data plan array length " + dataPlanArray.length);
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return; 
      }
      async function updateLocation () {
        if (!isRunning) {
          return;
        }
        console.log("in the update location " + isRunning);
        let acquired_location = await Location.getCurrentPositionAsync({});
        setLocation(acquired_location);
        if (dataPlan == false) {
          console.log("data plan is set to false so currently pushing to temporary array");
          dataPlanArray.push(acquired_location);
        }
        // this wont work bc when user goes out of this screen to set data plan to true and comes back
        // then the array will be emptied 
        //  storePhoneId, devName, phoneModel, phoneOs
        else if (dataPlan == true && (dataPlanArray.length != 0)) {
            create(dataPlanArray[0]);
            console.log(dataPlanArray[0]);
            dataPlanArray.shift();
        }
        else {
          create(acquired_location);
          console.log(acquired_location);
        }
      }
      if (isRunning) {
        console.log("after thing is re-rendered hopefully " + isRunning);
        intervalIdRef.current = setInterval(updateLocation, 5000);
      }
      return () => clearInterval(intervalIdRef.current);
    })();
  }, [isRunning]);

  
  const create = (acquired_location) => {
    console.log("collected fields ");
    console.log(storePhoneId);
    console.log(devName);
    console.log(phoneModel);
    console.log(phoneOs);
    const db = firebase.firestore();
    db.collection('LocationCollector').add({
      locationVal: acquired_location,
      collectedTime: firebase.firestore.FieldValue.serverTimestamp() // gives date, hour, min, second
    });
    const data = {
      id: 0,
      deviceName: devName,
      phoneModel: phoneModel,
      phoneOs: phoneOs,
      accuracy: 123.456,
      altitude: 435.234,
      altitudeAccuracy: 222.333,
      heading: 1,
      latitude: 324554,
      longitude: 333333,
      speed: 1234,
      timestamp: 555555
    }
    /*
    fetch('http://10.0.0.6:3000/locationsPost', {
      // I need the object to automatically obtain all this data -> work on this tmrw
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to create location');
      }
      return response.json();
    })
    .then(data => {
      console.log(data);
    })
    .catch(error => {
      console.error("error is ", error);
    });
    */
  }

  function startTrip() {
    console.log("in start trip button");
    setIsRunning(true);
  }
  function endTrip() {
    console.log("in endTrip button");
    clearInterval(intervalIdRef.current);
    setIsRunning(false);
  }

  function surveyAlert () {
    Alert.alert (
      'Would you like to take a survey?', 
      '',
      [
        {
          text: 'Yes', onPress: () => {
            console.log("yes pressed");
          }
          // will want this to forward to a survey later
        },
        {
          text: 'No', onPress: () => {
            console.log("no pressed");
          }
        }
      ],
      {cancelable: false},
      // makes sure user can't press out of the alert and close out 
    );
  }

  return (
    <View style={styles.container}>
      <Button 
        title = "Start my Trip"
        onPress = {() => startTrip()}
      />
      <Button 
      title = "End my Trip"
      onPress = {() => { endTrip(); surveyAlert();}}
      />
      <Button 
      title = "Restart my Trip"
      onPress = { () => restartTrip()}
      />
      <Text style={styles.paragraph}>Your location data is currently being stored in firestore</Text>
      <Text style = {styles.paragprah}> If you want to change your preferences please end your trip prior to making 
      the change, otherwise it will not be reflected </Text>
    </View>
  );
}
// understand how useContext works here and why we needed to wrap it in another function
export function Details () {
  return (
    <UserContextProvider>
      <DetailsContent />
    </UserContextProvider>
  )
}
function DetailsContent () {
  const {isEnabled, isRunning, setIsRunning, setIsEnabled} = useContext(UserContext);
  useEffect(() => {
    setIsRunning(false);
    console.log("value of isRunning " + isRunning);
    (async () => {
      try {    
        const value = await AsyncStorage.getItem('isEnabled');
        console.log("the value from await ", value);
        if (value !== null) {
          setIsEnabled(JSON.parse(value));
        }
        // when the user closes out of component & reopens it resets the isEnabled
        // to correct value received from asynStorage
      } catch (error) {
        console.error(error);
      }
    })();
  }, [isRunning]);
  const toggleSwitch = async () => {
    const newValue = !isEnabled;
    setIsEnabled(newValue);
    try {
      await AsyncStorage.setItem('isEnabled', JSON.stringify(newValue));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View styles={styles.container}>
      <Text style={styles.paragraph}>Would you like to use your data plan?</Text>
      <Text style = {styles.paragraph}> {isEnabled.toString()} </Text>
      <Switch
        trackColor={{ false: '#767577', true: '#81b0ff' }}
        thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
        onValueChange={toggleSwitch}
        value={isEnabled}
      />
    </View>
  );
}

export function SignIn () {
  return (
    <View styles = {styles.containter} > 
      <Text style = {styles.paragraph} > This is the sign in method to be further developed </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  paragraph: {
  fontSize: 18,
  textAlign: 'center',
  },
});