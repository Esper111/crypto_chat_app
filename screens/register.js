// import { StyleSheet, Text, View } from 'react-native'
// import React from 'react'
// import {Input,Button}  from 'react-native-elements'
// import { useState } from 'react';
// import { createUserWithEmailAndPassword } from 'firebase/auth';
// import { authentication } from '../firebase/firebaseconfig';
// import { doc, setDoc } from 'firebase/firestore';
// import { db } from '../firebase/firebaseconfig';

// export default function Register() {
//   const [email, setEmail]=useState('');
//   const [password, setPassword]=useState('');
//   const [username, setUsername]=useState('');
// //   const [avatar, setAvatar]=useState('');

// const registerUser = async()=>{
//     createUserWithEmailAndPassword(authentication, email, password)
//     .then((userCredentials)=>{
//         const userUID= userCredentials.user.uid;
//         const docref=doc(db,'users',userUID);
//         const docSnap= setDoc(docref,{
//             username,
//             password,
//             userUID,
//             email
//         })
//         .then(()=>console.log("success"))
//         // console.log(userCredentials)
//         // console.log("Register a user")
//     })
// }
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
//         <Input 
//       placeholder='Username'
//       label='username'
//       value={username}
//       onChangeText={text=>setUsername(text)}
//       leftIcon={{type:'material',name:'account-circle'}}
//       />
//     {/* <Input 
//       placeholder='Avatar url'
//       label='avatar'
//       value={avatar}
//       onChangeText={text=>setAvatar(text)}
//       leftIcon={{type:'material',name:'link'}}
//       secureTextEntry
//       /> */}
//     <Button
//     onPress={registerUser}
//     style={styles.btn}
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
import React, { useState } from 'react';
import { Input, Button } from 'react-native-elements';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { authentication } from '../firebase/firebaseconfig';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseconfig';
import { sha1 } from './sha1'; // Import your SHA-1 function

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const registerUser = async () => {
    // Hash the password using SHA-1
    const hashedPassword = sha1(password);

    createUserWithEmailAndPassword(authentication, email, hashedPassword)
      .then((userCredentials) => {
        const userUID = userCredentials.user.uid;
        const docRef = doc(db, 'users', userUID);
        setDoc(docRef, {
          username,
          hashedPassword,
          userUID,
          email
        }).then(() => console.log("Success"))
          .catch((error) => console.error("Error adding document: ", error));
      })
      .catch((error) => console.error("Error creating user: ", error));
  }

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
      <Input 
        placeholder='Username'
        label='Username'
        value={username}
        onChangeText={text => setUsername(text)}
        leftIcon={{ type: 'material', name: 'account-circle' }}
      />
      <Button
        onPress={registerUser}
        style={styles.btn}
        title='Register'
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  btn: {
    marginTop: 10,
    width: '100%'
  }
});
