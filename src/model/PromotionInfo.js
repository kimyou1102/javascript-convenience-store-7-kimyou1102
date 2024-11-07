import { parseDateToKr } from '../utils/parseDate';

export default class PromotionInfo {
  #promotionInfo;

  constructor(promotionInfo) {
    this.#promotionInfo = promotionInfo;
  }

  getPromotionInfo() {
    return this.#promotionInfo;
  }
}
