import AppRouter from "components/Router";
import React, { useEffect, useState } from "react";
import { authService } from "../fBase";
import { updateProfile } from "firebase/auth";

function App() {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);

  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      user
        ? setUserObj({
            displayName: user.displayName,
            uid: user.uid,
            updateProfile: (args) =>
              updateProfile(user, { displayName: user.displayName }),
          })
        : setUserObj(null);

      setInit(true);
    });
  }, []);
  const refreshUser = () => {
    const user = authService.currentUser;
    setUserObj({
      displayName: user.displayName,
      uid: user.uid,
      updateProfile: (args) =>
        user.updateProfile(user, { displaynName: user.displayName }),
    });
  };

  return (
    <>
      {init ? (
        <AppRouter
          refreshUser={refreshUser}
          isLoggedIn={Boolean(userObj)}
          userObj={userObj}
        />
      ) : (
        "Initializing..."
      )}
      <footer>&copy; Nwitter {new Date().getFullYear()}</footer>
    </>
  );
}

export default App;
