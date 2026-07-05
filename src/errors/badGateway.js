import CustomAPIrror from "./customApiError.js";

export default class BadGatewayError extends CustomAPIrror {
  constructor(message) {
    super(message);
    this.statusCode = 502;
  }
}
