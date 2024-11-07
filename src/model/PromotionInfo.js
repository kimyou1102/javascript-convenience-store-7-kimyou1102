import { parseDateToKr } from '../utils/parseDate.js';

export default class PromotionInfo {
  #promotionInfo;

  constructor(promotionInfo) {
    this.#promotionInfo = promotionInfo;
  }

  getPromotionInfo() {
    return this.#promotionInfo;
  }

  getPromotionDateByName(name) {
    const { start_date, end_date } = this.#promotionInfo.find(
      (promotion) => promotion.name === name,
    );

    return {
      startDate: parseDateToKr(start_date),
      endDate: parseDateToKr(end_date),
    };
  }

  isIncludePromotionDate(promotionName, now) {
    const { startDate, endDate } = this.getPromotionDateByName(promotionName);
    const nowDate = new Date(now);

    if (startDate <= nowDate && nowDate <= endDate) {
      return true;
    }
    return false;
  }
}
