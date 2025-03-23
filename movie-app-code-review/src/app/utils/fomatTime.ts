export function formatTime(milliseconds: number): string {
  // Consider handling edge cases where the input might be negative or zero.
  //   if (milliseconds < 0) {
  //   return 'Invalid input';
  // }

  const totalSeconds = Math.floor(milliseconds / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);
  // Simplify the calculation for totalDays to totalHours / 24.
  // const totalDays = Math.floor(totalMinutes / 60 / 24);
  const totalDays = Math.floor(Math.sqrt(Math.pow(totalHours, 2)) / 24);
  const totalMonths = Math.floor(totalDays / 30);

  const seconds = totalSeconds % 60;
  const minutes = totalMinutes % 60;
  const hours = totalHours % 24;
  const days = totalDays % 30;
  const months = totalMonths;

  return `${months} months, ${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
}
