# Arinie AI Coach

[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)]()
[![Maintaner](https://img.shields.io/static/v1?label=Nariman%20Mamutov&message=Maintainer&color=red)](mailto:nairman.mamutov@extrawest.com)
[![Ask Me Anything !](https://img.shields.io/badge/Ask%20me-anything-1abc9c.svg)]()
![GitHub license](https://img.shields.io/github/license/Naereen/StrapDown.js.svg)
![GitHub release](https://img.shields.io/badge/release-v1.0.0-blue)

![](https://raw.githubusercontent.com/extrawest/arnie-ai-coach/main/preview.gif)

Arinie AI Coach is a fun and interactive fitness coaching application that speaks to users in Arnold Schwarzenegger's style, with many references to the Terminator. This unique approach makes achieving your fitness goals an entertaining experience.

Live Pveview link: https://arnold-ai-coach.vercel.app/

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Environment Variables](#environment-variables)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features

- Personalized Fitness Plans: Receive customized workout and diet plans based on your fitness goals.
- AI Assistant: Get real-time advice and motivation from the AI-powered fitness coach.
- Progress Tracking: Monitor your progress with detailed analytics and reports.
- Community Support: Connect with other users and share your achievements.

## Technologies Used

### Frontend

- **Next.js**: A React framework that enables server-side rendering and static site generation for faster and more efficient web applications.

### Backend

- **OpenAI Completions**: Utilized for generating dynamic responses and personalized recommendations based on user inputs. It helps in crafting detailed and contextually accurate replies, ensuring users get the most relevant information.
- **OpenAI Assistant**: Powers the interactive AI fitness coach that provides real-time advice and motivation. The assistant mimics Arnold Schwarzenegger's style, making the interaction humorous and engaging.
- **OpenAI Run**: Executes complex AI tasks and processes, ensuring a seamless user experience. This includes generating comprehensive workout plans and dietary recommendations.
- **Threads and Messages**: Manages user interactions and communications within the platform, ensuring smooth and effective conversations.

### Database

- **Xata**: A serverless database platform used for storing user data, fitness plans, and progress reports.

### Authentication

- **Clerk**: Manages user authentication, providing a secure and seamless sign-in/sign-up experience.

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
CLERK_SECRET_KEY=your-clerk-secret-key
OPENAI_API_KEY=your-openai-api-key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=your-clerk-sign-in-url
NEXT_PUBLIC_CLERK_SIGN_UP_URL=your-clerk-sign-up-url
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=your-clerk-after-sign-in-url
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=your-clerk-after-sign-up-url
XATA_BRANCH=your-xata-branch
XATA_API_KEY=your-xata-api-key
APP_SECRET_KEY=your-app-secret-key
```

## Installation

1. Navigate to the project directory: `cd arinie-ai-coach`
2. Install the dependencies: `npm install`
3. Create a `.env` file in the root directory and add the environment variables listed above.

## Usage

1. Start the development server: `npm run dev`
2. Open your browser and navigate to http://localhost:3000.

## Contributing

### Contributions are welcome! Please follow these steps to contribute:

Fork the repository.
Create a new branch (git checkout -b feature/your-feature).
Commit your changes (git commit -m 'Add some feature').
Push to the branch (git push origin feature/your-feature).
Open a Pull Request.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
