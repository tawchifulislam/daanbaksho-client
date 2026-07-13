export async function uploadImageToImgbb(imageFile) {
  const formData = new FormData();
  formData.append('image', imageFile);

  const res = await fetch(
    `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
    { method: 'POST', body: formData },
  );

  const data = await res.json();
  if (!data.success) {
    throw new Error('Image upload failed. Try again.');
  }
  return data.data.url;
}
