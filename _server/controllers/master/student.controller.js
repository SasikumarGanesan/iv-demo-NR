const _ = require('lodash');
const responseHelper = require('../../helpers/response.helper');

let students = [
    {id: "J1628338985209", name: "John", m1: 98, m2: 67, m3: 86},
    {id: "J1238338985643", name: "Stev", m1: 78, m2: 61, m3: 56},
];

function generateId() {
    let  randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    return randLetter + Date.now();
}

module.exports.create_student = (req, res, next) => {

    try {
        const { name, m1, m2, m3 } = req.body;
        students = [...students, {id: generateId(),   name, m1, m2, m3}];
        responseHelper.successResponse(res, null, 'Student created successfully.', students);
    } catch (err) {
        responseHelper.errorResponse(res, null, 'Can\'t create student.', err);
    }
};

module.exports.get_students = (req, res, _) => {
    responseHelper.successResponse(res, null, 'All student fetched successfully.', students);
};

module.exports.edit_student = (req, res, _) => {
    const student = students.find(({id}) => req.params.id === id);
    responseHelper.successResponse(res, null, 'Student fetched successfully.', student);
};

module.exports.update_student = (req, res, _) => {
    const studentIndex = students.findIndex(({id}) => req.body.id === id);

    students[studentIndex] = {...students[studentIndex], ...req.body};

    responseHelper.successResponse(res, null, 'Student update successfully.', students);
};


module.exports.delete_student = (req, res, next) => {
    const studentIndex = students.findIndex(({id}) => req.body.id === id);
    students.splice( studentIndex, 1);
    responseHelper.successResponse(res, null, 'Record deleted successfully..', students);
};
