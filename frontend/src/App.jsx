import { useState } from "react";

function ImageUpload() {
  const [images, setImages] = useState([]);

  const handleFileChange = (event) => {
    setImages(event.target.files);
  };

  const handleUpload = async (event) => {
    event.preventDefault();

    if (images.length !== 4) {
      alert("Please upload exactly 4 images.");
      return;
    }

    const formData = new FormData();
    for (let i = 0; i < images.length; i++) {
      formData.append("images", images[i]);
    }

    try {
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log(data);
      alert("Images uploaded successfully!");
    } catch (error) {
      console.error("Error uploading images:", error);
    }
  };

  return (
    <form onSubmit={handleUpload}>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        required
      />
      <button type="submit">Upload</button>
    </form>
  );
}

export default ImageUpload;
