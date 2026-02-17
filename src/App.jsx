import { Navigate, Route, Routes } from "react-router-dom";

import Layout from "./layout/Layout";
import Register from "./auth/Register";
import Login from "./auth/Login";
import ActivitiesPage from "./activities/ActivitiesPage";
import ActivityDetails from "./activities/ActivityDetails";
import RoutinesPage from "./routines/RoutinesPage";
import RoutineDetails from "./routines/RoutineDetails";
import Error404 from "./Error404.jsx";

/**
 * Fitness Trackr is a platform where fitness enthusiasts can share their workouts and
 * discover new routines. Anyone can browse the site and make an account, and users with an
 * account will be able to upload and manage their own activities.
 */
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/activities" replace />} />
        <Route path="activities" element={<ActivitiesPage />} />
        <Route path="activities/:id" element={<ActivityDetails />} />
        <Route path="routines" element={<RoutinesPage />} />
        <Route path="routines/:id" element={<RoutineDetails />} />
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
        <Route path="*" element={<Error404 />} />
      </Route>
    </Routes>
  );
}
