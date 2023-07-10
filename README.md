<p align="center">
  <p>
    <img width="50%" src="./src/assets/Logo.png" />
  </p>

  <p>
    <a href="https://reactjs.org/"><img src="https://img.shields.io/badge/React-18.2.0-blue.svg?style=flat-square" alt="react" title="React" /></a><!--
    --><a href="https://ant.design/"><img src="https://img.shields.io/badge/Ant%20Design-5.5.2-blue.svg?style=flat-square" alt="Antd" title="antd" /></a><!--
    --><a href="https://firebase.google.com/"><img src="https://img.shields.io/badge/Firebase-9.22.1-orange.svg?style=flat-square" alt="firebase" title="Firebase" /></a>
  </p>
</p>

## What is UniTasks ?

A task management web application for HUST UI/UX course

<p>
  <img src="./src/assets/app-preview.png" />
</p>

## Table of Contents

- [Getting Started](#getting-started)
- [Setup and Configuration](#setup-and-configuration)
- [Usage](#usage)
- [License](#license)

## Getting Started

Live demo: [UniTasks](https://unitasks.vercel.app)

To get a local copy of the project up and running, follow these steps:

1. Clone the repository: `git@github.com:Thdeathz/UniTasks.git`
2. Navigate to the project directory: `cd UniTasks`
3. Install the dependencies: `yarn`

## Setup and Configuration

Before running the application, you need to set up a Firebase project and configure the necessary environment variables. Follow these steps:

1. Create a Firebase project at [https://console.firebase.google.com](https://console.firebase.google.com)
2. Enable the `Firestore database`, `Authentication`, `Storage` for the project
3. Obtain the Firebase configuration values (API key, database URL, etc.)
4. Create a `.env` file in the project root directory
5. Add the following environment variables to the `.env` file:

```bash
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGE_SENDER_ID=
VITE_FIREBASE_MEASUREMENT_ID=
```

6. Save the `.env` file

## Usage

To start the application locally, use the following command:

```bash
yarn dev
```

The application will be accessible at [http://localhost:3000](http://localhost:3000)

## License

This project is licensed under the [MIT License](LICENSE).
