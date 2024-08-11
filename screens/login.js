// import { StyleSheet, Text, View } from 'react-native'
// import React from 'react'
// import {Input,Button}  from 'react-native-elements'
// import { useState } from 'react';
// import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
// import { authentication } from '../firebase/firebaseconfig';
// import { useEffect } from 'react';
// //import { createStackNavigator } from 'react-navigation/stack';
// import { useContext } from 'react';

// //import AuthContext from '../context/AuthContext'

// export default function Login({navigation}) {
//   const [email, setEmail]=useState('');
//   const [password, setPassword]=useState('');

//   const loginUser= async()=>{
//     signInWithEmailAndPassword(authentication,email,password)
//     .then(()=>console.log("logged in"))
//   }

//   useEffect(()=>{
//     onAuthStateChanged(authentication,(user)=>{
//     if(user){
//       navigation.navigate('Home')
//     }else{
//       // console.log('no user')
//       if (navigation.canGoBack()) {
//         navigation.popToTop();
//       }
//       // navigation.canGoBack() & navigation.popToTop();
//     }
//   })
//   })
//   return (
//     <View styles={styles.container}>
//       <Input 
//       placeholder='Enter your email'
//       label='email'
//       value={email}
//       onChangeText={text=>setEmail(text)}
//       leftIcon={{type:'material',name:'email'}}
//       />
//       <Input 
//       placeholder='Enter your password'
//       label='password'
//       value={password}
//       onChangeText={text=>setPassword(text)}
//       leftIcon={{type:'material',name:'lock'}}
//       secureTextEntry
//       />
//     <Button
//     title='Login'
//     onPress={loginUser}
//     />
//     <Button
//     style={styles.btn}
//     onPress={()=>navigation.navigate('Register')}
//     title='Register'
//     />
//     </View>
//   )
// }

// const styles = StyleSheet.create({
//   container:{
//     flex:1
//   },
//   btn:{
//     marginTop:10
//   }
// })

import { StyleSheet, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Input, Button } from 'react-native-elements';
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { authentication } from '../firebase/firebaseconfig';
import { sha1 } from './sha1'; // Import your SHA-1 function

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const loginUser = async () => {
    const hashedPassword = sha1(password);

    signInWithEmailAndPassword(authentication, email, hashedPassword)
      .then(() => console.log("logged in"))
      .catch((error) => console.error("Error logging in: ", error));
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(authentication, (user) => {
      if (user) {
        navigation.navigate('Home');
      } else {
        // Handle the case where no user is authenticated
        if (navigation.canGoBack()) {
          navigation.popToTop();
        }
      }
    });

    return unsubscribe;
  }, []);

  return (
    <View style={styles.container}>
      <Input 
        placeholder='Enter your email'
        label='Email'
        value={email}
        onChangeText={text => setEmail(text)}
        leftIcon={{ type: 'material', name: 'email' }}
      />
      <Input 
        placeholder='Enter your password'
        label='Password'
        value={password}
        onChangeText={text => setPassword(text)}
        leftIcon={{ type: 'material', name: 'lock' }}
        secureTextEntry
      />
      <Button
        title='Login'
        onPress={loginUser}
      />
      <Button
        style={styles.btn}
        onPress={() => navigation.navigate('Register')}
        title='Register'
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    // alignItems: 'center',
    padding: 20
  },
  btn: {
    marginTop: 10,
    width: '100%'
  }
});
