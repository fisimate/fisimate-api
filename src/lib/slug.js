import slugify from "slugify";

export default function slug(text) {
  return slugify(text, {
    lower: true,
    remove: /[*+~.()'"!:@]/g,
  });
}
