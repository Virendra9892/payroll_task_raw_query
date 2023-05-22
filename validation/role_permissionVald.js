const { body } = require('express-validator');


// create-permission
exports.createRole_permission = [
    body('role_id').notEmpty().withMessage('method must be specified.')
        .isLength({ min: 1, max: 2 })
        .withMessage("role_id must be minimum 1 chars & maximum 2 chars.")
        .trim(),
    body('permission_id').notEmpty().withMessage('url must be specified.')
        .isLength({ min: 1, max: 2 })
        .withMessage("permission_id must be minimum 1 chars & maximum 2 chars.")
        .trim(),
];
