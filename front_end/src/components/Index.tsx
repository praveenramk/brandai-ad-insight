const handleAnalyze = async (imageUrl: string) => {
  try {
    const response = await fetch('http://localhost:8000/critique', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image_url: imageUrl }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    setAnalysis(data);
  } catch (error) {
    console.error('Error details:', error);
    setError('Failed to connect to the server. Please make sure the backend is running.');
  }
};