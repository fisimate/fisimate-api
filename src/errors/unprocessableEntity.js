import CustomAPIrror from "./customApiError.js";

export default class UnprocessableEntityError extends CustomAPIrror {
  constructor(message) {
    super(message);
    this.statusCode = 422;
  }
}
