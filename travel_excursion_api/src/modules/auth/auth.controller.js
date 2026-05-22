const { register, login,refresh } = require("./auth.service");
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

module.exports = { registerController, loginController, refreshController };
