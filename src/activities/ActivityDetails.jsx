import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteActivity, getActivityById } from "../api/activities";
import { useAuth } from "../auth/AuthContext";

export default function ActivityDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [activity, setActivity] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadActivity = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getActivityById(id);
        setActivity(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    loadActivity();
  }, [id]);

  const tryDelete = async () => {
    setError(null);

    try {
      await deleteActivity(token, id);
      navigate("/activities");
    } catch (e) {
      setError(e.message);
    }
  };

  if (loading) return <p>Loading activity...</p>;

  if (!activity) {
    return (
      <>
        <h1>Activity not found</h1>
        {error && <p role="alert">{error}</p>}
        <Link to="/activities">Back to activities</Link>
      </>
    );
  }

  return (
    <>
      <h1>{activity.name}</h1>
      <p>{activity.description || "No description available."}</p>
      <p>Created by: {activity.creatorName || "Unknown"}</p>
      {token && <button onClick={tryDelete}>Delete</button>}
      {error && <p role="alert">{error}</p>}
      <Link to="/activities">Back to activities</Link>
    </>
  );
}
