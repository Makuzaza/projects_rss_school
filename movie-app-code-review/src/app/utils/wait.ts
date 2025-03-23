// rename tShirtSize to delay for better clarity.
// export function wait(delay: number): Promise<void> {
//   return new Promise((resolve) => {
//     setTimeout(resolve, delay);
//   });
// }
export function wait(tShirtSize: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, tShirtSize);
  });
}
