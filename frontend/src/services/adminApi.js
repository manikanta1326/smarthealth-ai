const API = "http://localhost:5000/api";

export const getAdminDashboard = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API}/admin/dashboard`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.json();
};

export const deleteUser = async (id) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API}/admin/users/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.json();
};