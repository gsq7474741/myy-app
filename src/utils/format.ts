export const formatPH = (ph: number) => {
  if (ph < 5.5) {
    return "强酸性";
  } else if (ph < 6.8) {
    return "弱酸性";
  } else if (ph <= 7.2) {
    return "中性";
  } else if (ph <= 8.5) {
    return "弱碱性";
  } else {
    return "强碱性";
  }
};
