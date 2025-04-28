
const API_BASE_URL = 'http://localhost:3000'; // Change this to your local server URL

export const api = {
  async getAllPhotos() {
    const response = await fetch(`${API_BASE_URL}/photos`);
    if (!response.ok) throw new Error('Failed to fetch photos');
    return response.json();
  },

  async addPhoto(formData: FormData) {
    const response = await fetch(`${API_BASE_URL}/photos`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to add photo');
    return response.json();
  },

  async updatePhoto(id: number, data: FormData) {
    const response = await fetch(`${API_BASE_URL}/photos/${id}`, {
      method: 'PUT',
      body: data,
    });
    if (!response.ok) throw new Error('Failed to update photo');
    return response.json();
  },

  async deletePhoto(id: number) {
    const response = await fetch(`${API_BASE_URL}/photos/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete photo');
    return response.json();
  },

  async login(password: string) {
    const response = await fetch(`${API_BASE_URL}/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password }),
    });
    if (!response.ok) throw new Error('Invalid credentials');
    return response.json();
  }
};
