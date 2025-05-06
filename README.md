467 starter repo

# Deployment

Step 1: `Work on individual branches`

Step 2: `Push to the branch and merge into main branch`

Step 3: `Merge main branch into deployment branch to trigger Github Actions`

Step 4: `Github Actions sends to our lambda file in AWS`

Step 5: `Lambda file talks to our NoSQL database and lambda AWS returns the results`

Step 6: `The CI/CD pushes the web version of the react native app to the s3 container for web hosting`

# React/Expo Frontend

- From `/Turbine`

--Install Dependencies--

- `npm install react-native-paper react-native-vector-icons`
- `npm i` to install node_modules in Turbine folder

Starting Server:

- `npx expo start`
