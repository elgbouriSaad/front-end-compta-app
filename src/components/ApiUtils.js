const baseUrl = process.env.REACT_APP_BASE_URL;

const makeApiRequest = async (url, method, body = null) => {
  try {
    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : null,
    };
    const response = await fetch(baseUrl + url, options);
    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.message || "API request failed.");
    }
  } catch (error) {
    throw error;
  }
};

export const makeApiPostRequest = async (url, body = null) => {
  try {
    return await makeApiRequest(url, "POST", body);
  } catch (error) {
    throw new Error(`API POST request failed: ${error.message}`);
  }
};

export const makeApiGetRequest = async (url, method, id = null) => {
  try {
    if (id) {
      url += `/${id}`;
    }
    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await fetch(baseUrl + url, options);

    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.message || "API GET request failed.");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

export const makeApiPutRequest = async (url, body = null, id = null) => {
  try {
    if (id) {
      url += `/${id}`;
    }
    return await makeApiRequest(url, "PUT", body);
  } catch (error) {
    throw new Error(`API PUT request failed: ${error.message}`);
  }
};

export const makeApiDeleteRequest = async (url, id = null) => {
  try {
    if (id) {
      url += `/${id}`;
    }
    await makeApiRequest(url, "DELETE");
  } catch (error) {
    throw new Error(`API DELETE request failed: ${error.message}`);
  }
};
