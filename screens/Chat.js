// import { StyleSheet, Text, View } from 'react-native'
// import React from 'react'
// import { useState, useCallback, useEffect } from 'react'
// import { GiftedChat } from 'react-native-gifted-chat'
// import { authentication } from '../firebase/firebaseconfig'
// import {addDoc,doc, collection, serverTimestamp, onSnapshot,query, orderBy } from 'firebase/firestore'
// import {db} from '../firebase/firebaseconfig'
// import { onAuthStateChanged } from 'firebase/auth'

// export default function Chat({route}) {
//     const uid=route.params.uid
//     const [messages, setMessages] = useState([])
//     const currentUser=authentication?.currentUser?.uid;
//     // useEffect(() => {
//     //   setMessages([
//     //     {
//     //       _id: 1,
//     //       text: 'Hello developer',
//     //       createdAt: new Date(),
//     //       user: {
//     //         _id: 2,
//     //         name: 'React Native',
//     //         avatar: 'https://placeimg.com/140/140/any',
//     //       },
//     //     },
//     //   ])
//     // }, [])
  
//     useEffect(()=>{
//         const chatId=uid > currentUser ?`${uid + '-' + currentUser}` : `${currentUser + '-' + uid}`
//         const docRef=doc(db,'chatrooms',chatId);
//         const colRef=collection(docRef,'messages');
//         const q=query(colRef, orderBy('createdAt',"desc"));
//         const docSnap=onSnapshot(q,(onSnap)=>{
//          const allMsg =  onSnap.docs.map(mes=>{
//             if(mes.data().createdAt){
//                 return{
//                     ...mes.data(),
//                     createdAt:mes.data().createdAt.toDate()
//                 }
//             }else{
//                 return{
//                     ...mes.data(),
//                     createdAt:new Date()
//                 }
//             }
                
//             })
//             setMessages(allMsg)
//         })
       

//     },[])

//     const onSend = useCallback((messagesArray) => {
//         const msg=messagesArray[0];
//     //     console.log(myMsg)
//     const myMsg={
//         ...msg,
//         sentBy:currentUser,
//         sentTo:uid
//         //chatrooms/1234567/messages/123/msg, createdat
//     }
//     console.log(myMsg)
//       setMessages(previousMessages =>
//         GiftedChat.append(previousMessages, [myMsg]))
//       const chatId=uid > currentUser ? `${uid + '-' + currentUser}` : `${currentUser + '-' + uid}`
//       const docRef=doc(db,'chatrooms',chatId);
//       const colRef=collection(docRef,'messages');
//       const chatSnap=addDoc(colRef,{
//         ...myMsg,
//         createdAt:serverTimestamp()
//       })
//     }, [])
//   return (
//     <GiftedChat
//       messages={messages}
//       onSend={text => onSend(text)}
//       user={{
//         _id: currentUser,
//       }}
//     />
//   )
// }

// const styles = StyleSheet.create({})
//================================================================
// Chat.js

import { StyleSheet, Text, View } from 'react-native';
import React, { useState, useCallback, useEffect } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import { authentication } from '../firebase/firebaseconfig';
import { addDoc, doc, collection, serverTimestamp, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase/firebaseconfig';
import { aesEncrypt, aesDecrypt } from './aes1'; 

export default function Chat({ route }) {
    const uid = route.params.uid;
    const [messages, setMessages] = useState([]);
    const currentUser = authentication?.currentUser?.uid;

    useEffect(() => {
        const chatId = uid > currentUser ? `${uid}-${currentUser}` : `${currentUser}-${uid}`;
        const docRef = doc(db, 'chatrooms', chatId);
        const colRef = collection(docRef, 'messages');
        const q = query(colRef, orderBy('createdAt', 'desc'));
        const docSnap = onSnapshot(q, (onSnap) => {
            const allMsg = onSnap.docs.map(mes => {
                if (mes.data().createdAt) {
                    return {
                        ...mes.data(),
                        createdAt: mes.data().createdAt.toDate()
                    };
                } else {
                    return {
                        ...mes.data(),
                        createdAt: new Date()
                    };
                }
            });
            setMessages(allMsg);
        });

        // Clean up listener on component unmount
        return () => docSnap();
    }, []);

    const onSend = useCallback(async (messagesArray) => {
        const msg = messagesArray[0];
        const encryptedMessage = aesEncrypt(msg.text); // Encrypt message
        const myMsg = {
            ...msg,
            text: encryptedMessage, // Store encrypted message
            sentBy: currentUser,
            sentTo: uid
        };

        setMessages(previousMessages =>
            GiftedChat.append(previousMessages, [myMsg]));

        const chatId = uid > currentUser ? `${uid}-${currentUser}` : `${currentUser}-${uid}`;
        const docRef = doc(db, 'chatrooms', chatId);
        const colRef = collection(docRef, 'messages');
        await addDoc(colRef, {
            ...myMsg,
            createdAt: serverTimestamp()
        });
    }, []);

    // Decrypt messages on display (GiftedChat expects plaintext messages)
    const decryptMessages = useCallback((messages) => {
        return messages.map(message => ({
            ...message,
            text: aesDecrypt(message.text) // Decrypt message text
        }));
    }, []);

    return (
        <GiftedChat
            messages={decryptMessages(messages)} // Decrypt messages before displaying
            onSend={text => onSend(text)}
            user={{
                _id: currentUser,
            }}
        />
    );
}

const styles = StyleSheet.create({});

//================================================================
//import CryptoJS from './aes.js';

// import React, { useState, useCallback, useEffect } from 'react';
// import { StyleSheet } from 'react-native';
// import { GiftedChat } from 'react-native-gifted-chat';
// import { authentication, db } from '../firebase/firebaseconfig';
// import { addDoc, doc, collection, serverTimestamp, onSnapshot, query, orderBy } from 'firebase/firestore';
// import { onAuthStateChanged } from 'firebase/auth';
// // import CryptoJS from './aes.js';
// import CryptoJS from 'crypto-js';


// // AES encryption and decryption functions
// const encrypt = (text, key) => {
//   const encrypted = CryptoJS.AES.encrypt(text, key).toString();
//   return encrypted;
// };

// const decrypt = (encryptedText, key) => {
//   const bytes = CryptoJS.AES.decrypt(encryptedText, key);
//   const decrypted = bytes.toString(CryptoJS.enc.Utf8);
//   return decrypted;
// };

// export default function Chat({ route }) {
//   const uid = route.params.uid;
//   const [messages, setMessages] = useState([]);
//   const currentUser = authentication?.currentUser?.uid;
//   const key = "b3f2d29c54a24e0c9b48b1d9a4e7c8f3"; // Use a 16, 24, or 32 character key for AES-128, AES-192, or AES-256

//   useEffect(() => {
//     const chatId = uid > currentUser ? `${uid + '-' + currentUser}` : `${currentUser + '-' + uid}`;
//     const docRef = doc(db, 'chatrooms', chatId);
//     const colRef = collection(docRef, 'messages');
//     const q = query(colRef, orderBy('createdAt', 'desc'));
//     const unsubscribe = onSnapshot(q, async (snapshot) => {
//       const newMessages = snapshot.docs.map((doc) => {
//         const data = doc.data();
//         const decryptedText = decrypt(data.text, key);
//         return {
//           _id: doc.id,
//           text: decryptedText,
//           createdAt: data.createdAt?.toDate() || new Date(),
//           user: {
//             _id: data.sentBy,
//           },
//         };
//       });
//       setMessages(newMessages);
//     });
//     return () => unsubscribe();
//   }, [currentUser, key, uid]);

//   const onSend = useCallback(async (messagesArray) => {
//     const msg = messagesArray[0];
//     const encryptedText = encrypt(msg.text, key);
//     const myMsg = {
//       ...msg,
//       text: encryptedText,
//       sentBy: currentUser,
//       sentTo: uid,
//     };
//     setMessages((previousMessages) => GiftedChat.append(previousMessages, [myMsg]));
//     const chatId = uid > currentUser ? `${uid + '-' + currentUser}` : `${currentUser + '-' + uid}`;
//     const docRef = doc(db, 'chatrooms', chatId);
//     const colRef = collection(docRef, 'messages');
//     await addDoc(colRef, {
//       ...myMsg,
//       createdAt: serverTimestamp(),
//     });
//   }, [currentUser, key, uid]);

//   return (
//     <GiftedChat
//       messages={messages}
//       onSend={(messages) => onSend(messages)}
//       user={{
//         _id: currentUser,
//       }}
//     />
//   );
// }

// const styles = StyleSheet.create({});
//(above is aes.js)


// import { StyleSheet, Text, View } from 'react-native';
// import React, { useState, useCallback, useEffect } from 'react';
// import { GiftedChat } from 'react-native-gifted-chat';
// import { authentication } from '../firebase/firebaseconfig';
// import { addDoc, doc, collection, serverTimestamp, onSnapshot, query } from 'firebase/firestore';
// import { db } from '../firebase/firebaseconfig';

// // Utility functions for encryption
// const arrayBufferToBase64 = (buffer) => {
//   let binary = '';
//   const bytes = new Uint8Array(buffer);
//   for (let i = 0; i < bytes.byteLength; i++) {
//     binary += String.fromCharCode(bytes[i]);
//   }
//   return window.btoa(binary);
// };

// const base64ToArrayBuffer = (base64) => {
//   const binaryString = window.atob(base64);
//   const len = binaryString.length;
//   const bytes = new Uint8Array(len);
//   for (let i = 0; i < len; i++) {
//     bytes[i] = binaryString.charCodeAt(i);
//   }
//   return bytes.buffer;
// };

// const generateKeyPair = async () => {
//   const keyPair = await window.crypto.subtle.generateKey(
//     {
//       name: 'ECDH',
//       namedCurve: 'X25519'
//     },
//     true,
//     ['deriveKey', 'deriveBits']
//   );
//   const publicKey = await window.crypto.subtle.exportKey('spki', keyPair.publicKey);
//   const privateKey = await window.crypto.subtle.exportKey('pkcs8', keyPair.privateKey);
//   return {
//     publicKey: arrayBufferToBase64(publicKey),
//     privateKey: arrayBufferToBase64(privateKey)
//   };
// };

// const deriveSharedSecret = async (privateKey, publicKey) => {
//   const privateKeyObj = await window.crypto.subtle.importKey(
//     'pkcs8',
//     base64ToArrayBuffer(privateKey),
//     {
//       name: 'ECDH',
//       namedCurve: 'X25519'
//     },
//     true,
//     ['deriveKey', 'deriveBits']
//   );
//   const publicKeyObj = await window.crypto.subtle.importKey(
//     'spki',
//     base64ToArrayBuffer(publicKey),
//     {
//       name: 'ECDH',
//       namedCurve: 'X25519'
//     },
//     true,
//     []
//   );
//   return await window.crypto.subtle.deriveKey(
//     {
//       name: 'ECDH',
//       public: publicKeyObj
//     },
//     privateKeyObj,
//     {
//       name: 'AES-GCM',
//       length: 256
//     },
//     true,
//     ['encrypt', 'decrypt']
//   );
// };

// const encryptMessage = async (message, publicKey, privateKey) => {
//   const sharedSecret = await deriveSharedSecret(privateKey, publicKey);
//   const iv = window.crypto.getRandomValues(new Uint8Array(12));
//   const encryptedMessage = await window.crypto.subtle.encrypt(
//     {
//       name: 'AES-GCM',
//       iv: iv
//     },
//     sharedSecret,
//     new TextEncoder().encode(message)
//   );
//   return {
//     cipherText: arrayBufferToBase64(encryptedMessage),
//     iv: arrayBufferToBase64(iv)
//   };
// };

// const decryptMessage = async (cipherText, iv, publicKey, privateKey) => {
//   const sharedSecret = await deriveSharedSecret(privateKey, publicKey);
//   const decryptedMessage = await window.crypto.subtle.decrypt(
//     {
//       name: 'AES-GCM',
//       iv: base64ToArrayBuffer(iv)
//     },
//     sharedSecret,
//     base64ToArrayBuffer(cipherText)
//   );
//   return new TextDecoder().decode(decryptedMessage);
// };

// export default function Chat({ route }) {
//   const uid = route.params.uid;
//   const [messages, setMessages] = useState([]);
//   const currentUser = authentication?.currentUser?.uid;
//   const [keyPair, setKeyPair] = useState({ publicKey: '', privateKey: '' });

//   useEffect(() => {
//     const fetchMessages = async () => {
//       const generatedKeyPair = await generateKeyPair();
//       setKeyPair(generatedKeyPair);

//       const chatId = uid > currentUser ? `${uid}-${currentUser}` : `${currentUser}-${uid}`;
//       const docRef = doc(db, 'chatrooms', chatId);
//       const colRef = collection(docRef, 'messages');
//       const q = query(colRef);
//       const unsubscribe = onSnapshot(q, async (onSnap) => {
//         const allMsg = await Promise.all(
//           onSnap.docs.map(async (mes) => {
//             const data = mes.data();
//             const decryptedMessage = await decryptMessage(data.text, data.iv, data.publicKey, keyPair.privateKey);
//             return {
//               ...data,
//               text: decryptedMessage,
//               createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),
//             };
//           })
//         );
//         setMessages(allMsg);
//       });
//       return unsubscribe;
//     };

//     fetchMessages();
//   }, [currentUser, uid, keyPair.privateKey]);

//   const onSend = useCallback(async (messagesArray) => {
//     const msg = messagesArray[0];
//     const { cipherText, iv } = await encryptMessage(msg.text, keyPair.publicKey, keyPair.privateKey);

//     const myMsg = {
//       ...msg,
//       text: cipherText,
//       iv: iv,
//       publicKey: keyPair.publicKey,
//       sentBy: currentUser,
//       sentTo: uid,
//     };

//     const chatId = uid > currentUser ? `${uid}-${currentUser}` : `${currentUser}-${uid}`;
//     const docRef = doc(db, 'chatrooms', chatId);
//     const colRef = collection(docRef, 'messages');
//     await addDoc(colRef, {
//       ...myMsg,
//       createdAt: serverTimestamp()
//     });
//   }, [keyPair, currentUser, uid]);

//   return (
//     <GiftedChat
//       messages={messages}
//       onSend={text => onSend(text)}
//       user={{
//         _id: currentUser,
//       }}
//     />
//   );
// }

// const styles = StyleSheet.create({});

