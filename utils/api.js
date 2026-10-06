import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

export const postData = async (url, formData) => {
    try {
        const response = await fetch(apiUrl + url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'Content-Type': 'application/json',
            },

            body: JSON.stringify(formData)
        });

        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            const errorData = await response.json();
            return errorData
        }
    } catch (error) {
        console.log('Error:', error)
    }
}

export const fetchDataFromApi = async (url) => {
    try {
        const params = {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'Content-Type': 'application/json',
            }
        }
        const { data } = await axios.get(apiUrl + url, params)
        return data;
    } catch (error) {
        console.log(error);
        return error;
    }
}

export const uploadImage = async (url, formData) => {
    const params = {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'Content-Type': 'multipart/form-data',
            }
    }
    
    var response;
    await axios.post(apiUrl + url, formData, params).then((res) => {
        response = res;
    })
    return response
}

export const editData = async (url, updatedData) => {
  try {
    const params = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.put(
      apiUrl + url,
      updatedData,
      params
    );

    return data;
  } catch (error) {
    console.log("editData error:", error);

    return {
      error: true,
      success: false,
      message:
        error?.response?.data?.message ||
        error?.message ||
        "Update failed",
    };
  }
};

export const deleteImage = async (url, image) => {
    const params = {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'Content-Type': 'application/json',
            }
    }
    const { data } = await axios.delete(apiUrl + url, params);
  return data;
};

export const deleteData = async (url) => {
    const params = {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'Content-Type': 'application/json',
            }
    }
    const { data } = await axios.delete(apiUrl + url, params)
    return data;
}

export const deleteMultipleData = async (url, body) => {
  const params = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      "Content-Type": "application/json",
    },
    data: body,
  };

  const { data } = await axios.delete(apiUrl + url, params);
  return data;
};