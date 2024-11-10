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

  getPromotion(promotionName) {
    return this.#promotionInfo.find((promotion) => promotion.name === promotionName);
  }

  isPromotionApplicable(promotionName, now) {
    if (!this.getPromotion(promotionName)) return false;
    const { startDate, endDate } = this.getPromotionDateByName(promotionName);
    const nowDate = new Date(now);

    if (startDate <= nowDate && nowDate <= endDate) {
      return true;
    }
    return false;
  }

  inSufficientCount(promotionName, productQuantity) {
    const { buy, get } = this.#promotionInfo.find((promotion) => promotion.name === promotionName);
    if (productQuantity < buy + get) {
      return buy + get - productQuantity;
    }
    return 0;
  }
}
