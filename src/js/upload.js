function longImageButton() {
  const selectElement = document.getElementById('PreviewImage');
  const widthInput = document.getElementById('image_width')
  const heightInput = document.getElementById('image_height')

  selectElement.addEventListener('load', (event) => {
    widthInput.value = 1000
    heightInput.value = 1
  });
}

export default longImageButton