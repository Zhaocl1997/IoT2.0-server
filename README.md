IoT2.0-Server 
===========================

## Introduction

### Functionality

- Use **RESTful API** as backend

- Use **express** as the base framework

- Use **mongoDB** as a database support

- Use **socket** as data interact with frontend

- Use **MQTT** as data transfer with devices

- Use **Raspberry3** as data collection

### Structure

```
│  app.js   // app
│  index.js // entry
├─api
│  ├─data
│  │      data.controllers.js
│  │      data.model.js
│  │      data.socket.js
│  │      index.js
│  ├─device
│  │      device.controllers.js
│  │      device.model.js
│  │      index.js
│  ├─menu
│  │      index.js
│  │      menu.controllers.js
│  │      menu.model.js
│  ├─role
│  │      index.js
│  │      role.controllers.js
│  │      role.model.js
│  ├─route
│  │      index.js
│  │      route.controllers.js
│  │      route.model.js
│  └─user
│          index.js
│          user.controllers.js
│          user.model.js
├─assets
│  ├─fonts
│  └─img
├─helper
│      config.js    // config for express middleware
│      public.js    // public function
│      request.js   // request package used for development
│      validate.js  // Joi validate
├─middleware
│      appMW.js     // app middleware
│      routeMW.js   // route middleware
│      validateMW.js    // validate middleware
└─services
        express.js
        mongo.js
        mqtt.js
        routes.js
        socketio.js
```

### Usage

- Environment 
  - Node >= 10.16
  - MongoDB >= 4.0
  
- Script
  - start
    ```
    npm start
    ```
  - dev
    ```
    npm run dev
    ```
  - prod
    ```
    npm run prod
    ```
  - test
    ```
    npm test
    ```

## About

### Author

A Chinese college student who is gonna graduate in 2020.

### Experience

I left school in the middle of July.

To start with, I begin learning javascipt and node through the course on Udemy, which cost me 2 months to get them through. (**Andrew Mead** really thought well in javascript and node for new learners)

Next, I followed the guide through a book named **Practical Internet of Things with JavaScript** wirten by **Arvind Ravulavaru** published in **December 2017**
introduced by my dad to build my first own project.

- Stage One
  
  With no UI framework, I built **IoT1.0** with **frontend** and **backend**, which was more likely a **full-stack** engineer.I figured out **vue** and **mongoose** base usages which really helped me build my own develop structure mind.

- Stage Two

  With **elementUI**, I reconstructed **IoT1.0** UI, implented **MQTT** in backend and **socketio** in both. I called it **IoT2.0**

- Stage Three

  With **VantUI**, I built a mobile version app in phones, and packaged it with **cordova** and **gradle** into an apk, which can really run in cell phone like an 'app'.

By now, I'm still working on mobile and details in **IoT2.0**. There are a lot of things can be done, problems waiting for me to solve, UI stuff etc. Thera can be features in my project, I'm starting to implent them one by one. There is a lot in the future.

### Contact

[Github](https://github.com/Zhaocl1997)