// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

import { MantineProvider } from '@mantine/core';
import { Notifications, notifications } from '@mantine/notifications';
import { IconX, IconCheck } from '@tabler/icons-react';

// Styles
const theme = {

};

const checkinBody = {
  size: '24px',
};

// StreamerBot WebSocket connection
let ws;

function connectWebSocket() {
  ws = new WebSocket('ws://localhost:1338/');

  ws.onopen = () => {
    console.log('Connected to Streamer.bot WebSocket');
    ws.send(JSON.stringify({
      request: 'Subscribe',
      events: {
        General: ['Custom']
      },
      id: 'BroCheckIns',
    }));
  };

  ws.onmessage = (event) => {
    console.log('Received message from Streamer.bot WebSocket:', event.data);
    const payload = JSON.parse(event.data);
    // Check if the event is the custom event you're looking for
    if (payload.event && payload.event.source === 'General' && payload.event.type === 'Custom') {
      console.log('Custom event received!', payload);
      const data = payload.data;
      if (data.type === 'CheckIn') {
        console.log("Queuing up check-in notification for user:", data.user);
        notifications.show({
          color: 'green',
          title: `${data.user} Checked in ${data.streamRank}`,
          icon: <IconCheck size={16} />,
          message: `This is their ${data.totalCheckIns} ever check-in!`,
          withCloseButton: false,
          autoClose: 5000,
          classNames: {
            body: checkinBody,
          }
        });
      }
    }
  };

  ws.onclose = () => {
    console.log('Disconnected from Streamer.bot WebSocket, retrying in 5s...');
    setTimeout(connectWebSocket, 5000);
  };

  ws.onerror = () => {
    console.log('WebSocket error, closing and retrying in 5s...');
    ws.close();
  };
}

connectWebSocket();

export default function App() {

  return <MantineProvider theme={theme}>
    <Notifications />
  </MantineProvider>;
}