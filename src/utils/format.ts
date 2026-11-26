import { CURRENCY } from "../config/appConfig";

export const formatPrice = (n: number) =>
  `${CURRENCY}${Math.round(n).toLocaleString("en-IN")}`;