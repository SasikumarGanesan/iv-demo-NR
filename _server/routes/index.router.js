const express = require('express');
const router = express.Router();

const ctrlStudent = require('../controllers/master/student.controller');

router.get('/students', ctrlStudent.get_students);
router.post('/student/add', ctrlStudent.create_student);
router.post('/student/update', ctrlStudent.update_student);
router.post('/student/delete', ctrlStudent.delete_student);
router.get('/student/edit/:id', ctrlStudent.edit_student);


module.exports = router;
