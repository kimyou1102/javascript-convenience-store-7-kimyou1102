import { Console } from '@woowacourse/mission-utils';

export default class InputView {
  async getInput(message) {
    try {
      return await Console.readLineAsync(`${message}\n`);
    } catch (error) {
      console.error(error);
      return 'N';
    }
  }
}
