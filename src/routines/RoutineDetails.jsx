import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { getActivities } from "../api/activities";
import {
  createSet,
  deleteRoutine,
  deleteSet,
  getRoutineById,
} from "../api/routines";

export default function RoutineDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [routine, setRoutine] = useState(null);
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const activityNameById = Object.fromEntries(
    activities.map((activity) => [activity.id, activity.name]),
  );

  const syncRoutine = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [routineData, activitiesData] = await Promise.all([
        getRoutineById(id),
        getActivities(),
      ]);
      setRoutine(routineData);
      setActivities(activitiesData);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    syncRoutine();
  }, [syncRoutine]);

  const tryDeleteRoutine = async () => {
    setError(null);
    try {
      await deleteRoutine(token, id);
      navigate("/routines");
    } catch (e) {
      setError(e.message);
    }
  };

  const tryDeleteSet = async (setId) => {
    setError(null);
    try {
      await deleteSet(token, setId);
      await syncRoutine();
    } catch (e) {
      setError(e.message);
    }
  };

  if (loading) return <p>Loading routine...</p>;

  if (!routine) {
    return (
      <>
        <h1>Routine not found</h1>
        {error && <p role="alert">{error}</p>}
        <Link to="/routines">Back to routines</Link>
      </>
    );
  }

  return (
    <>
      <h1>{routine.name}</h1>
      <p>Goal: {routine.goal || "No goal provided."}</p>
      <p>Created by: {routine.creatorName || "Unknown"}</p>
      {token && <button onClick={tryDeleteRoutine}>Delete routine</button>}
      {error && <p role="alert">{error}</p>}

      <h2>Sets</h2>
      {routine.sets?.length ? (
        <ul>
          {routine.sets.map((set) => (
            <li key={set.id}>
              <p>
                {set.activity?.name ||
                  activityNameById[set.activityId] ||
                  "Activity"}
                : {set.count}
              </p>
              {token && (
                <button onClick={() => tryDeleteSet(set.id)}>Delete</button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No sets yet. Add one below.</p>
      )}

      {token && (
        <SetForm
          routineId={id}
          activities={activities}
          syncRoutine={syncRoutine}
          setError={setError}
        />
      )}

      <Link to="/routines">Back to routines</Link>
    </>
  );
}

function SetForm({ routineId, activities, syncRoutine, setError }) {
  const { token } = useAuth();

  const tryCreateSet = async (event) => {
    event.preventDefault();
    setError(null);
    const form = event.currentTarget;

    const formData = new FormData(form);
    const activityId = Number(formData.get("activityId"));
    const count = Number(formData.get("count"));

    try {
      await createSet(token, routineId, { activityId, count });
      form.reset();
      await syncRoutine();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <>
      <h3>Add a set</h3>
      <form onSubmit={tryCreateSet}>
        <label>
          Activity
          <select name="activityId" defaultValue="" required>
            <option value="" disabled>
              Select an activity
            </option>
            {activities.map((activity) => (
              <option key={activity.id} value={activity.id}>
                {activity.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Count
          <input type="number" name="count" min="1" required />
        </label>
        <button>Add set</button>
      </form>
    </>
  );
}
