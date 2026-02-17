const API = import.meta.env.VITE_API;

export async function getRoutines() {
  const response = await fetch(API + "/routines");
  const result = await response.json();

  if (!response.ok) {
    throw Error(result.message);
  }

  return Array.isArray(result) ? result : [];
}

export async function getRoutineById(id) {
  const response = await fetch(API + "/routines/" + id);
  const result = await response.json();

  if (!response.ok) {
    throw Error(result.message);
  }

  return result;
}

export async function createRoutine(token, routine) {
  if (!token) {
    throw Error("You must be signed in to create a routine.");
  }

  const response = await fetch(API + "/routines", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(routine),
  });
  const result = await response.json();

  if (!response.ok) {
    throw Error(result.message);
  }

  return result;
}

export async function deleteRoutine(token, id) {
  if (!token) {
    throw Error("You must be signed in to delete a routine.");
  }

  const response = await fetch(API + "/routines/" + id, {
    method: "DELETE",
    headers: { Authorization: "Bearer " + token },
  });

  if (!response.ok) {
    const result = await response.json();
    throw Error(result.message);
  }
}

export async function createSet(token, routineId, set) {
  if (!token) {
    throw Error("You must be signed in to add a set.");
  }

  const response = await fetch(API + "/sets", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({ ...set, routineId: Number(routineId) }),
  });
  const result = await response.json();

  if (!response.ok) {
    throw Error(result.message);
  }

  return result;
}

export async function deleteSet(token, setId) {
  if (!token) {
    throw Error("You must be signed in to delete a set.");
  }

  const response = await fetch(API + "/sets/" + setId, {
    method: "DELETE",
    headers: { Authorization: "Bearer " + token },
  });

  if (!response.ok) {
    const result = await response.json();
    throw Error(result.message);
  }
}
