<script>
  import axios from 'axios';
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';

  const API_URL = import.meta.env.VITE_API_URL;

  let file;
  let data = [];

  const handleFileUpload = (event) => {
    file = event.target.files[0];
    console.log('selected:', file);
  };

  const UploadData = async () => {
    if (!file) {
      console.error('no file selected');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${API_URL}/UploadData`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      DisplayData();
      console.log('successfully uploaded file:', response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const DisplayData = async () => {
    try {
      const response = await axios.get(`${API_URL}/DisplayData`);
      data = response.data;
    } catch (error) {
      console.error('Error displaying data:', error);
    }
  };

  onMount(async () => {
    await DisplayData();
  });
</script>

<main>
  <div>
    <form on:submit|preventDefault={UploadData}>
      <p>Upload a CSV file</p>
      <input type="file" accept=".csv" on:change={handleFileUpload} />
      <input type="submit" />
    </form>
  </div>
</main>

<table>
  <thead>
    <tr>
      <th>postId</th>
      <th>id</th>
      <th>name</th>
      <th>email</th>
      <th>body</th>
    </tr>
  </thead>
  <tbody>
    {#each data as row}
      <tr>
        <td>{row.postId}</td>
        <td>{row.id}</td>
        <td>{row.name}</td>
        <td>{row.email}</td>
        <td>{row.body}</td>
      </tr>
    {/each}
  </tbody>
</table>

<style>
</style>
