import React, { useState, useEffect } from 'react';
import './App.css';
import WebSDK, { LoginBehavior } from 'websdk';

const redirectUri = 'http://localhost:3000';

export const sphereoneSdk = new WebSDK(
  process.env.REACT_APP_CLIENT_ID as string,
  redirectUri,
  process.env.REACT_APP_API_KEY as string,
  LoginBehavior.REDIRECT,
);

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  console.log(isLoggedIn);
  //hook to listen for authentication response
  useEffect(() => {
    try {
      const handleAuth = async () => {
        const authResult: any = await sphereoneSdk.handleCallback();
        if (authResult?.access_token) {
          const { access_token, profile } = authResult;
          setIsLoggedIn(true); // handle authentication with your database
        } else {
          setIsLoggedIn(false);
        }
      };
      handleAuth();
    } catch (e) {
      console.log(e);
    }
  }, []);

  const login = async () => {
    try {
      console.log('logged in');

      await sphereoneSdk.login();
    } catch (e: any) {
      console.error(e);
    }
  };

  const logout = async () => {
    try {
      await sphereoneSdk.logout();
      setIsLoggedIn(false);
    } catch (e: any) {
      console.error(e);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={login}>Login</button>
        {isLoggedIn ? (
          <button onClick={getUserInfo}>Get User Info</button>
        ) : null}{' '}
        {isLoggedIn ? <button onClick={logout}>Logout</button> : null}
      </header>
    </div>
  );
};

const getUserInfo = async () => {
  try {
    const userInfo = await sphereoneSdk.getUserInfo({ forceRefresh: false });
    console.log('userInfo', JSON.stringify(userInfo));
  } catch (e: any) {
    console.error(e);
  }
};

export default App;
