// export function formatMoney(number) {
//   const parts = number.toFixed(2).toString().split(".");
//   const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
//   return integerPart + "." + parts[1];
// }

export function formatMoney(number) {
  // if (typeof number !== "number") {
  //   return "0.00";
  // }
  const parts = number.toFixed(2).toString().split(".");
  const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return integerPart + "." + parts[1];
}
