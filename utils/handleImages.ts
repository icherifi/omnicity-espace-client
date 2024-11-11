export const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];

  if (file) {
    const formData = new FormData();
    formData.append("image", file);
    const imageId = Math.random().toString(36).substring(2, 15);
    fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/projects/998/images/${imageId}`,
      {
        method: "POST",
        body: formData,
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("Image uploaded successfully:", data);
      })
      .catch((error) => {
        console.error("Error uploading image:", error);
      });
  }
};
