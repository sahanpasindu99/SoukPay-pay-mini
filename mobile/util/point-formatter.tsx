export const formatPoints = (points: number) => {
  return points.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
