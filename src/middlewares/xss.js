import { inHTMLData } from "xss-filters";

export const clean = (data = "") => {
  let isObject = false;

  if (typeof data === "object") {
    data = JSON.stringify(data);
    isObject = true;
  }

  data = inHTMLData(String(data)).trim();

  if (isObject) {
    data = JSON.parse(data);
  }

  return data;
};

const middleware = () => {
  return (req, res, next) => {
    if (req.body) req.body = clean(req.body);
    if (req.query) {
      // Express 5 exposes req.query as a getter-only property, so it must
      // be sanitized in place rather than reassigned.
      const cleaned = clean(req.query);
      for (const key of Object.keys(req.query)) delete req.query[key];
      Object.assign(req.query, cleaned);
    }
    if (req.params) req.params = clean(req.params);
    next();
  };
};

export default middleware;
