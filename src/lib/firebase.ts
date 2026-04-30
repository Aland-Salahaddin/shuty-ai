import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBtBLmx5IHTFWR3JtZLrf5C1h8fM7DkQa0",
  authDomain: "shuty-c0c9c.firebaseapp.com",
  projectId: "shuty-c0c9c",
  storageBucket: "shuty-c0c9c.firebasestorage.app",
  messagingSenderId: "705961283219",
  appId: "1:705961283219:web:9c84b91b911ed007a78766",
  measurementId: "G-XBPSH2GSDM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
export default app;
