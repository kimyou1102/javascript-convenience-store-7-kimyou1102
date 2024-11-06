import { Console } from '@woowacourse/mission-utils';

export default class InputView {
  async getInput(message) {
    try {
      return await Console.readLineAsync(`${message}\n`);
    } catch (error) {
      createError(ERROR_MESSAGES.INPUT_ERROR);
    }
  }
}
