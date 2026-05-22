const { register, login, refresh, forgotPassword, resetPassword,} = require("./auth.service");
const { registerSchema, loginSchema } = require("./auth.validation");

const registerController = async (req, res, next) => {
  try {
    const validated = registerSchema.parse(req.body);
    const result = await register(validated);
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const loginController = async (req, res, next) => {
  try {
    const validated = loginSchema.parse(req.body);
    const result = await login(validated);
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const refreshController = async (req,res,next) => {
  try {
    const {refreshToken} = req.body;
    const tokens = await refresh(refreshToken);

    res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
      data: tokens,
    });

  } catch (error){
    next(error);
  }
}



const forgotPasswordController = async (req, res, next) => {
  try {
    const { email } = req.body;
    await forgotPassword(email);

    res.status(200).json({
      success: true,
      message: "If that email exists, a reset link has been sent",
    });
  } catch (error) {
    next(error);
  }
};

const resetPasswordController = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    await resetPassword(token, newPassword);

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerController,
  loginController,
  refreshController,
  forgotPasswordController,
  resetPasswordController,
};
