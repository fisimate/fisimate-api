export const createTokenUser = (user) => {
  return {
    id: user.id,
    fullname: user.fullname,
    email: user.email,
  };
};
