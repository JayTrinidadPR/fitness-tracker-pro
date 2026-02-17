import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { createRoutine, getRoutines } from "../api/routines";

export default function RoutinesPage() {
  const { token } = useAuth();
  const [routines, setRoutines] = useState([]);
  const [error, setError] = useState(null);

  const syncRoutines = async () => {
    setError(null);
    try {
      const data = await getRoutines();
      setRoutines(data);
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => {
    syncRoutines();
  }, []);

  return (
    <>
      <h1>Routines</h1>
      {error && <p role="alert">{error}</p>}
      <ul>
        {routines.map((routine) => (
          <li key={routine.id}>
            <Link to={`/routines/${routine.id}`}>{routine.name}</Link>
          </li>
        ))}
      </ul>
      {token && <RoutineForm syncRoutines={syncRoutines} />}
    </>
  );
}

function RoutineForm({ syncRoutines }) {
  const { token } = useAuth();
  const [error, setError] = useState(null);

  const tryCreateRoutine = async (event) => {
    event.preventDefault();
    setError(null);
    const form = event.currentTarget;

    const formData = new FormData(form);
    const name = formData.get("name");
    const goal = formData.get("goal");

    try {
      await createRoutine(token, { name, goal });
      form.reset();
      syncRoutines();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <>
      <h2>Create a routine</h2>
      <form onSubmit={tryCreateRoutine}>
        <label>
          Name
          <input type="text" name="name" required />
        </label>
        <label>
          Goal
          <input type="text" name="goal" required />
        </label>
        <button>Add routine</button>
      </form>
      {error && <p role="alert">{error}</p>}
    </>
  );
}
