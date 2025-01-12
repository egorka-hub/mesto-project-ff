const renderLoading = (
  button,
  isLoading,
  buttonText = "Сохранить",
  loadingText = "Сохранение..."
) => {
  if (isLoading) {
    button.textContent = loadingText;
  } else {
    button.textContent = buttonText;
  }
};

export { renderLoading };
