const Joi = require("joi");

validateRequest = async (req, next, schema, res, dataType, type = "body") => {
  const options = {
    abortEarly: false,
    allowUnknown: true,
    stripUnknown: true,
  };
  const { error, value } = schema.validate(dataType, options);
  if (error) {
    return res.send({
      status: false,
      message: error.details[0].message,
      data: [],
    });
  } else {
    if (type == "body") req.body = value;
    else req.params = value;
    next();
  }
};

function addUserValidation(req, res, next) {
  const schema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
    role: Joi.string().required(),
  });

  validateRequest(req, next, schema, res, req.body);
}

function validateUserID(req, res, next) {
  const schema = Joi.object({
    userID: Joi.string().required(),
  });

  validateRequest(req, next, schema, res, req.params, "param");
}

const loginValidation = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
  });
  validateRequest(req, next, schema, res, req.body);
};

const editUserValidation = (req, res, next) => {
  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
    role: Joi.string().required(),
  });
  validateRequest(req, next, schema, res, req.body);
};

const addGroupValidation = (req, res, next) => {
  const schema = Joi.object({
    groupName: Joi.string().required(),
    groupAdminId: Joi.string().required(),
  });
  validateRequest(req, next, schema, res, req.body);
};

const deleteGroupValidation = (req, res, next) => {
  const schema = Joi.object({
    groupId: Joi.string().required(),
    groupAdminId: Joi.string().required(),
  });
  validateRequest(req, next, schema, res, req.body);
};

const searchGroupValidation = (req, res, next) => {
  const schema = Joi.object({
    groupName: Joi.any().optional(),
    userId: Joi.string().required(),
  });
  validateRequest(req, next, schema, res, req.body);
};

const addMemberInGroupValidation = (req, res, next) => {
  const schema = Joi.object({
    groupId: Joi.string().optional(),
    memberUserId: Joi.string().required(),
    groupAdminId: Joi.string().required(),
  });
  validateRequest(req, next, schema, res, req.body);
};

const userIdValidation = (req, res, next) => {
  const schema = Joi.object({
    userId: Joi.string().required(),
  });
  validateRequest(req, next, schema, res, req.params, "param");
};

const userIdBodyValidation = (req, res, next) => {
  const schema = Joi.object({
    userId: Joi.string().required(),
  });
  validateRequest(req, next, schema, res, req.body);
};
const groupIdValidation = (req, res, next) => {
  const schema = Joi.object({
    groupId: Joi.string().required(),
  });
  validateRequest(req, next, schema, res, req.params, "param");
};

const sendMessageValidation = (req, res, next) => {
  const schema = Joi.object({
    groupId: Joi.string().required(),
    userId: Joi.string().required(),
    message: Joi.string().required(),
  });
  validateRequest(req, next, schema, res, req.body);
};

const likeUnlikeMessageValidation = (req, res, next) => {
  const schema = Joi.object({
    messageId: Joi.string().required(),
    userId: Joi.string().required(),
  });
  validateRequest(req, next, schema, res, req.body);
};

module.exports = {
  addUserValidation,
  validateUserID,
  loginValidation,
  editUserValidation,
  addGroupValidation,
  deleteGroupValidation,
  searchGroupValidation,
  addMemberInGroupValidation,
  userIdValidation,
  groupIdValidation,
  sendMessageValidation,
  likeUnlikeMessageValidation,
  userIdBodyValidation,
};
