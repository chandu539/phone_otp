import { Button, Card, CardContent, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { auth } from './firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

const App = () => {
  const [phone, setPhone] = useState('+91');
  const [hasFilled, setHasFilled] = useState(false);
  const [otp, setOtp] = useState('');

  // Initialize reCAPTCHA
  const generateRecaptcha = () => {
    if (!auth) {
      console.error("Firebase auth is not initialized.");
      return;
    }

    try {
      // Create the reCAPTCHA verifier instance
      window.recaptchaVerifier = new RecaptchaVerifier('recaptcha', {
        'size': 'invisible',
        'callback': (response) => {
          console.log('reCAPTCHA verified:', response);
        },
      }, auth);
    } catch (error) {
      console.error('Error initializing reCAPTCHA:', error);
    }
  }

  // Handle sending the OTP
  const handleSend = (event) => {
    event.preventDefault();
    setHasFilled(true);
    generateRecaptcha();
    let appVerifier = window.recaptchaVerifier;

    // Send OTP using Firebase
    signInWithPhoneNumber(auth, phone, appVerifier)
      .then((confirmationResult) => {
        // Store the confirmation result for later OTP verification
        window.confirmationResult = confirmationResult;
      })
      .catch((error) => {
        // Handle errors during OTP sending
        console.log(error);
      });
  }

  // Verify OTP entered by the user
  const verifyOtp = (event) => {
    let otp = event.target.value;
    setOtp(otp);
  
    // Ensure confirmationResult is available
    let confirmationResult = window.confirmationResult;
  
    if (!confirmationResult) {
      console.error("confirmationResult is undefined. Please ensure OTP was sent successfully.");
      alert("Error: OTP not sent or expired. Please try sending the OTP again.");
      return;
    }
  
    // Automatically verify OTP when it reaches 6 characters
    if (otp.length === 6) {
      confirmationResult.confirm(otp)
        .then((result) => {
          // User signed in successfully
          let user = result.user;
          console.log(user);
          alert('User signed in successfully');
        })
        .catch((error) => {
          // Handle error if OTP is incorrect
          console.log(error);
          alert('User couldn\'t sign in (bad verification code?)');
        });
    }
  }
  

  // UI for entering phone number and OTP
  if (!hasFilled) {
    return (
      <div className='app__container'>
        <Card sx={{ width: '300px' }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
            <Typography sx={{ padding: '20px' }} variant='h5' component='div'>Enter your phone number</Typography>
            <form onSubmit={handleSend}>
              <TextField sx={{ width: '240px' }} variant='outlined' autoComplete='off' label='Phone Number' value={phone} onChange={(event) => setPhone(event.target.value)} />
              <Button type='submit' variant='contained' sx={{ width: '240px', marginTop: '20px' }}>Send Code</Button>
            </form>
          </CardContent>
        </Card>
        <div id="recaptcha"></div>
      </div>
    );
  } else {
    return (
      <div className='app__container'>
        <Card sx={{ width: '300px' }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
            <Typography sx={{ padding: '20px' }} variant='h5' component='div'>Enter the OTP</Typography>
            <TextField sx={{ width: '240px' }} variant='outlined' label='OTP ' value={otp} onChange={verifyOtp} />
          </CardContent>
        </Card>
        <div id="recaptcha"></div>
      </div>
    );
  }
};

export default App;
