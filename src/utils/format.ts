export const formatPH = (ph: number) => {
  if (ph < 6.8) {
    return "酸性";
  } else if (ph > 7.2) {
    return "碱性";
  }
  return "中性";
};
