import yup from 'yup';

const schemas = {
  loginSchema: yup.object({
    body: yup.object({
      email: yup.string().email().required(),
      password: yup.string().min(1).max(128).required(),
    }),
  }),

  logoutSchema: yup.object({
    body: yup.object({
      refreshToken: yup.string().required(),
    }),
  }),

  refreshTokenSchema: yup.object({
    body: yup.object({
      refreshToken: yup.string().required(),
    }),
  }),

  registerSchema: yup.object({
    body: yup.object({
      name: yup.string().required(),
      email: yup.string().required().email(),
      password: yup.string().min(1).max(128).required()
    }),
  }),

  resetPasswordSchema: yup.object({
    body: yup.object({
      password: yup.string().min(1).max(128).required(),
      newPassword: yup.string().min(1).max(128).required(),
      newPasswordConfirm: yup
        .string()
        .required()
        .oneOf([yup.ref('newPassword'), null], 'Passwords must match'),
    }),
  }),
}
 
export default schemas;
