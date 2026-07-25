class AuthController {
  constructor(authService) {
    this.authService = authService;
  }

  register = async (req, res) => {
    try {
      const result = await this.authService.register(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(error.statusCode || 400).json({ message: error.message });
    }
  };

  login = async (req, res) => {
    try {
      const result = await this.authService.login(req.body);
      res.json(result);
    } catch (error) {
      res.status(error.statusCode || 400).json({ message: error.message });
    }
  };

  verifyEmail = async (req, res) => {
    try {
      const user = await this.authService.verifyEmail(req.body);
      res.json(user);
    } catch (error) {
      res.status(error.statusCode || 400).json({ message: error.message });
    }
  };

  verifyPhone = async (req, res) => {
    try {
      const user = await this.authService.verifyPhone(req.body);
      res.json(user);
    } catch (error) {
      res.status(error.statusCode || 400).json({ message: error.message });
    }
  };

  forgotPassword = async (req, res) => {
    try {
      const result = await this.authService.forgotPassword(req.body);
      res.json(result);
    } catch (error) {
      res.status(error.statusCode || 400).json({ message: error.message });
    }
  };

  resetPassword = async (req, res) => {
    try {
      const result = await this.authService.resetPassword(req.body);
      res.json(result);
    } catch (error) {
      res.status(error.statusCode || 400).json({ message: error.message });
    }
  };

  me = async (req, res) => {
    try {
      res.json(this.authService.me(req.user));
    } catch (error) {
      res.status(error.statusCode || 400).json({ message: error.message });
    }
  };
}

module.exports = AuthController;
