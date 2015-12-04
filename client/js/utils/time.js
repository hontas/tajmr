function zeroPad(num) {
  return num < 10 ? '0' + num : num;
}

export function getTimePartsFromElapsedTime(timestamp) {
  const hours = zeroPad(Math.floor(timestamp / 1000 / 3600));
  const minutes = zeroPad(Math.floor(timestamp / 1000 / 60) % 60);
  const seconds = zeroPad(Math.floor(timestamp / 1000) % 60);

  return { hours, minutes, seconds };
}

export function getTimePartsFromTimestamp(timestamp) {
  const date = new Date(timestamp);
  const hours = zeroPad(date.getHours());
  const minutes = zeroPad(date.getMinutes());
  const seconds = zeroPad(date.getSeconds());

  return { hours, minutes, seconds };
}
