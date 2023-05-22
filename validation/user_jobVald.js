const { body } = require('express-validator');


// create-role
exports.createUser_jobs = [
    body('job_id').notEmpty().withMessage('job-id must be specified.')
        .isLength({ min: 1, max: 2 })
        .withMessage("job-id must be minimum 1 chars & maximum 2 chars.")
        .trim(),

];