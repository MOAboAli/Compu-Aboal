class UserController {
  constructor(userService) {
    this.userService = userService;
  }

  list = async (req, res) => {
    try {
      res.json(await this.userService.list(req.query));
    } catch (error) {
      res.status(error.statusCode || 400).json({ message: error.message });
    }
  };

  getById = async (req, res) => {
    try {
      res.json(await this.userService.getById(req.params.id));
    } catch (error) {
      res.status(error.statusCode || 400).json({ message: error.message });
    }
  };

  create = async (req, res) => {
    try {
      res.status(201).json(await this.userService.create(req.body));
    } catch (error) {
      res.status(error.statusCode || 400).json({ message: error.message });
    }
  };

  update = async (req, res) => {
    try {
      res.json(await this.userService.update(req.params.id, req.body));
    } catch (error) {
      res.status(error.statusCode || 400).json({ message: error.message });
    }
  };

  activate = async (req, res) => {
    try {
      res.json(await this.userService.setActive(req.params.id, true));
    } catch (error) {
      res.status(error.statusCode || 400).json({ message: error.message });
    }
  };

  deactivate = async (req, res) => {
    try {
      res.json(await this.userService.setActive(req.params.id, false));
    } catch (error) {
      res.status(error.statusCode || 400).json({ message: error.message });
    }
  };

  setRole = async (req, res) => {
    try {
      res.json(await this.userService.setRole(req.params.id, req.body.role));
    } catch (error) {
      res.status(error.statusCode || 400).json({ message: error.message });
    }
  };

  remove = async (req, res) => {
    try {
      res.json(await this.userService.remove(req.params.id));
    } catch (error) {
      res.status(error.statusCode || 400).json({ message: error.message });
    }
  };
}

module.exports = UserController;
