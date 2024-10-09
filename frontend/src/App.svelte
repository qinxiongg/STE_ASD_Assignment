<script>
  import axios from 'axios';

  const API_URL = import.meta.env.VITE_API_URL;

  let file = null;

  function handleFileUpload(event) {
    file = event.target.files[0];
  }

  const UploadData = async (file) => {
    const formData = new FormData();
    console.log('Selected file:', file);

    formData.append('file', file);

    try {
      const response = await axios.post(`${API_URL}/UploadData`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('successfully uploaded file:', response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };
</script>

<main>
  <div>
    <p>Upload a CSV file</p>
    <input type="file" accept=".csv" on:change={handleFileUpload} />
    <button on:click={UploadData}>Submit</button>
  </div>
</main>

<style>
</style>
