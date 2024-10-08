// const BASE_URL = 'https://smart-closet-backend.onrender.com/';
const BASE_URL = 'http://127.0.0.1:8000/';

const api = {
    async get(url: string) {
        const response = await fetch(`${BASE_URL}${url}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    },

    async post(url: string, data: Record<string, any> | FormData, content_type?: string) {
        const headers: HeadersInit = {};
    
        // Check if data is FormData and do not set Content-Type if it is
        if (data instanceof FormData) {
        } else {
            headers['Content-Type'] = content_type ?? 'application/json';
        }
    
        const response = await fetch(`${BASE_URL}${url}`, {
            method: 'POST',
            headers,
            body: data instanceof FormData ? data : JSON.stringify(data),
        });
    
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    },

    async put(url: string, data: Record<string, any>) {
        const response = await fetch(`${BASE_URL}${url}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    },

    async delete(url: string) {
        const response = await fetch(`${BASE_URL}${url}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    },
};

export { api };