const API_BASE_URL = "http://localhost:5000/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

async function parseJsonResponse(response) {
  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    return {
      success: false,
      message: data?.message || "Request failed",
      data: data?.data || null,
    };
  }

  return data;
}

// ================= PROFILE =================

export const getProfile = async () => {
  const response = await fetch(`${API_BASE_URL}/profile`, {
    headers: getAuthHeaders(),
  });

  return parseJsonResponse(response);
};

export const updateProfile = async (profileData) => {
  console.log(profileData);

  const response = await fetch(`${API_BASE_URL}/profile`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(profileData),
  });

  console.log(response.status);

  return parseJsonResponse(response);
};

// ================= TODAY LOG =================

export const getTodayLog = async () => {
  const response = await fetch(`${API_BASE_URL}/today-log`, {
    headers: getAuthHeaders(),
  });

  return parseJsonResponse(response);
};

export const updateTodayLogApi = async (logData) => {
  const response = await fetch(`${API_BASE_URL}/today-log`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(logData),
  });

  return parseJsonResponse(response);
};