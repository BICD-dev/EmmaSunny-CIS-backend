import { Service } from 'node-windows';

// Create a new service object
const svc = new Service({
  name: 'EmmaSunny Server',
  description: 'EmmaSunny Customer Information System Server',
  script: 'C:\\path\\to\\your\\project\\index.js', // your main file
  env: [{
    name: "NODE_ENV",
    value: "production"
  }]
});

// Listen for the "install" event, then start the service
svc.on('install', () => {
  svc.start();
  console.log('Service installed and started!');
});

// Install the service
svc.install();
