<script>
  import axios from 'axios';
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';

  const API_URL = import.meta.env.VITE_API_URL;

  let file;
  let data = [];
  let totalCount = 0;
  let currentPage = 1;
  let totalPages = 0;
  const limitPerPage = 10;

  const handleFileUpload = (event) => {
    file = event.target.files[0];
  };
  function changePage(newPage) {
    if (newPage >= 1 && newPage <= totalPages) {
      DisplayData(newPage);
    }
  }

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

  const DisplayData = async (page = 1) => {
    try {
      const response = await axios.post(`${API_URL}/DisplayData`, {
        page: page,
        limitPerPage: limitPerPage,
      });
      // console.log('response', response);
      // data = response.data;

      data = response.data.data;
      totalCount = response.data.totalCount;
      currentPage = response.data.currentPage;
      totalPages = response.data.totalPages;
    } catch (error) {
      console.error('Error displaying data:', error);
    }
  };

  onMount(async () => {
    await DisplayData();
  });
</script>

<main>
  <div class="upload-form">
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

<div class="pagination-buttons">
  <button on:click={() => changePage(1)} disabled={currentPage === 1}>First</button>
  <button on:click={() => changePage(currentPage - 1)} disabled={currentPage === 1}>Previous</button
  >
  <span>Page {currentPage} of {totalPages}</span>
  <button on:click={() => changePage(currentPage + 1)} disabled={currentPage === totalPages}
    >Next</button
  >
  <button on:click={() => changePage(totalPages)} disabled={currentPage === totalPages}>Last</button
  >
</div>
<p class="totalCount">Total: {totalCount} results</p>

<style>
  .upload-form {
    margin-bottom: 20px;
  }
  tbody {
    height: 500px;
  }
  .pagination-buttons {
    text-align: center;
  }
  .totalCount{ 
    text-align: center;
  }
  
</style>
