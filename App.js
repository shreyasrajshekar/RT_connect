// App.js
import React, { useEffect, useState } from 'react';
import AddName from './AddName';
import ChatScreen from './ChatScreen';
import { registerForPushNotificationsAsync } from './Notification';

export default function App() {
  const [username, setUsername] = useState(null);

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  if (!username) {
    return <AddName onContinue={setUsername} />;
  }

  return <ChatScreen username={username} />;
}
