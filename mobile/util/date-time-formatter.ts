export const formatTime = (isoString: string) => {
  const date = new Date(isoString);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

export const formatDateHeader = (isoString: string) => {
  const date = new Date(isoString);
  return date
    .toLocaleString("en-US", {
      month: "long",
      year: "numeric",
    })
    .toUpperCase();
};
