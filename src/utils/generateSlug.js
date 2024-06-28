import slugify from "slugify";

const generateSlug = (string) => {
  return slugify(string, {
    lower: true,
    remove: /[*+~.()'"!:@]/g,
  });
};

export default generateSlug;
