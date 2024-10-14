// import React, {useEffect, useState} from 'react';
// import {View, Button, Text} from 'react-native';
// import {
//   RTCPeerConnection,
//   RTCIceCandidate,
//   RTCSessionDescription,
//   RTCView,
//   MediaStream,
//   mediaDevices,
// } from 'react-native-webrtc';

// const WebRTCComponent = () => {
//   const [localStream, setLocalStream] = useState(null);
//   const [remoteStream, setRemoteStream] = useState(null);
//   const [peerConnection, setPeerConnection] = useState(null);
//   const [errorMsg, setErrorMsg] = useState('');

//   useEffect(() => {
//     const initializeWebRTC = async () => {
//       try {
//         // Initialize peer connection
//         const pc = new RTCPeerConnection({
//           iceServers: [{urls: 'stun:stun.l.google.com:19302'}],
//         });
//         setPeerConnection(pc);

//         // Get local stream
//         const stream = await mediaDevices.getUserMedia({
//           audio: true,
//           video: true,
//         });
//         setLocalStream(stream);
//         stream.getTracks().forEach(track => pc.addTrack(track, stream));

//         // Listen for remote stream
//         pc.ontrack = event => {
//           setRemoteStream(event.streams[0]);
//         };

//         return () => {
//           // Clean up
//           pc.close();
//         };
//       } catch (error) {
//         console.error('Error initializing WebRTC:', error);
//         setErrorMsg(`Error initializing WebRTC: ${error.message}`);
//       }
//     };

//     initializeWebRTC();
//   }, []);

//   const createOffer = async () => {
//     try {
//       const offer = await peerConnection.createOffer();
//       await peerConnection.setLocalDescription(offer);
//       // Send this offer to the remote peer (you need to implement this part)
//     } catch (error) {
//       console.error('Error creating offer:', error);
//       setErrorMsg(`Error creating offer: ${error.message}`);
//     }
//   };

//   if (errorMsg) {
//     return <Text>{errorMsg}</Text>;
//   }

//   return (
//     <View>
//       {localStream && (
//         <RTCView
//           streamURL={localStream.toURL()}
//           style={{height: 150, width: 150}}
//         />
//       )}
//       {remoteStream && (
//         <RTCView
//           streamURL={remoteStream.toURL()}
//           style={{height: 150, width: 150}}
//         />
//       )}
//       <Button title="Create Offer" onPress={createOffer} />
//     </View>
//   );
// };

// export default WebRTCComponent;
