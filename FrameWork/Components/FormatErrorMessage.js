export function errorMessage(input) {
  const parts = input.split("/");
  const errorMessage = parts[parts.length - 1].replace(/-/g, " ");
  const formattedErrorMessage = errorMessage
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  return formattedErrorMessage;
}
