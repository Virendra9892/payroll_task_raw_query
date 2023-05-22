const models = require("../models");
const bcrypt = require("bcrypt");
const XLSX = require("xlsx");
const sendMail = require("../utils/sendEmail");
const path = require("path");
const pagination = require("../utils/pagination");
const Excel = require("exceljs");
const { header } = require("express-validator");

exports.addRecruiter = async (data) => {
    // let exist = await models.users.findOne({ where: { email: data.email } });
    let exist = await models.sequelize.query(`select * from users where "email"=${data.email}`);
    if (exist) {
        return ({ status: 400, sucess: false, message: "recruiter already exist" });
    }
    else {
        let salt = await bcrypt.genSalt(10);
        data.password = await bcrypt.hash(data.password, salt);
        // let resp = await models.users.create(data);
        let resp = await models.sequelize.query(`insert into users(name,email,password,roleId) values(${data.name},${data.email},${data.password},${data.roleId})`)
        await sendMail(`Registration of job portal`, `Hi ${resp.name}, congratulation... You have sucessfully regitser in job portal and following is your credentials: password:${data.password}`, resp.email);
        if (resp) {
            return ({ status: 200, sucess: true, message: "recruiter added sucessfully", result: resp });
        }
    }
}

exports.updateRecruiter = async (data, recruiterId) => {
    // let exist = await models.users.findOne({ where: { id: recruiterId } });
    let exist = await models.sequelize.query(`select * from users where "id"=${recruiterId}`)
    if (exist) {
        // let resp = await models.users.update(data, { where: { id: recruiterId } });
        let resp = await models.sequelize.query(`update users set name=${data.name},email=${data.email} where "id"=${recruiterId}`);
        if (resp) {
            return ({ status: 200, sucess: true, message: "recruiter updated sucessfully" });
        }
    }
    else {
        return ({ status: 400, sucess: false, message: "recruiter cannot updated" });
    }
}

exports.getAllRecruiterAndCandidate = async (roleId, from, to, orderBy) => {
    let { offset, limit, order } = pagination(from, to, orderBy)
    // console.log(searchQuery);
    // let exist = await models.users.findAll({ where: { roleId: roleId }, offset: offset, limit: limit, order: [["id", order]] });
    let [exist] = await models.sequelize.query(`select * from users where "roleId"=${roleId} order by id ${order} offset ${offset} limit ${limit}`);
    if (exist) {
        return ({ status: 200, sucess: true, message: "user fetched sucessfully", data: exist});
    }
    else {
        return ({ status: 400, sucess: false, message: "user doesn't exist" });
    }
}

exports.removeUserAccount = async (id) => {
    // let exist = await models.users.findOne({ where: { id: id } });
    let exist = await models.sequelize.query(`select * from users where id=${id}`);
    if (!exist) {
        return ({ status: 404, sucess: false, message: "user doesn't exist" });
    }
    else {
        // let resp = await models.users.destroy({ where: { id: id } });
        let resp = await models.sequelize.query(`delete from users where id=${id}`)
        if (resp) {
            return ({ status: 200, sucess: true, message: "user deleted sucessfully" });
        }
    }
}

exports.userExportsData = async (roleId) => {
    // let exist = await models.users.findAll({ where: { roleId: roleId } });
    let response = await models.sequelize.query(`select * from users where "roleId"=${roleId}`)
    let details = []
    if (response && response.length) {
        for (let i = 0; i < response.length; i++) {
            details.push(response[0][i]);
        }
        const workbook = new Excel.Workbook();
        const worksheet = workbook.addWorksheet('Data');
        worksheet.columns = [
            { header: 'user_id', key: 'user_id', width: 20 },
            { header: 'user_name', key: 'user_name', width: 20 },
            { header: 'user_email', key: 'user_email', width: 20 }
        ];
        details.forEach((row) => {
            worksheet.addRow({
                user_id: row.id,
                user_name: row.name,
                user_email: row.email
            });
        });
        let userData = Date.now();
        let filePath = path.join(__dirname, `../public/excel/${userData}.xlsx`);
        workbook.xlsx.writeFile(filePath)
        return ({ status: 200, sucess: true, message: "data exported sucessfully" })
    }
    else {
        return ({ status: 500, sucess: false, message: "Internal Server Error" })
    }
}

exports.appliedJobCandidate = async (userId) => {
    // let exist = await models.users.findOne({
    //     where: { id: userId },
    //     attributes: ["name", "email"],
    //     include: {
    //         model: models.jobs,
    //         attributes: ["title", "description"]
    //     }
    // });
    // let obj = {};
    let arr = []
    let [data] = await models.sequelize.query(`select "userId" from user_jobs`);
    let user_id = data.map(x=>x.userId)
    let exist = await models.sequelize.query(`select users.id,users.name,jobs.id as jobId,jobs.title,jobs.description from users left join user_jobs on users.id=user_jobs."userId" left join jobs on jobs.id=user_jobs."jobId" where users.id in(${user_id})`);
    if (exist) {
        for(let i=0; i<exist.length; i++){
          arr.push(exist[0][i])
        }
        let workbook = new Excel.Workbook();
        let worksheet = workbook.addWorksheet("userData");
        worksheet.columns = [
            {header:"canId",key:"id",width:20},
            {header:"canName",key:"name",width:20},
            {header:"jobId",key:"jobId",width:20},
            {header:"Title",key:"title",width:20},
            {header:"Description",key:"description",width:20}
        ]
        arr.forEach((ele)=>{
            worksheet.addRow({
                userId:ele.id,
                name:ele.name,
                jobId:ele.jobId,
                title:ele.title,
                description:ele.description
            })
        })
        let userData = Date.now();
        let filePath = path.join(__dirname, `../public/excel/${userData}.xlsx`);
        workbook.xlsx.writeFile(filePath)
        return ({ status: 200, sucess: true, message: "data exported sucessfully" })
    }
    else {
        return ({ status: 400, sucess: false, message: "internal server error" })
    }
}

exports.getAppliedJobCandidate = async (userId) => {
    let resp = await models.users.findAll({
        where: { id: userId },
        include: {
            model: models.jobs,
            attributes: ["title", "description"],
            through: { attributes: [] }
        }
    })
    if (resp && resp.length > 0) {
        return ({ status: 200, sucess: true, message: "Data get sucessfully", result: resp });
    }
    else {
        return ({ status: 400, sucess: false, message: "Data not found" })
    }
}

exports.createRole_permission = async (data) => {
    if (data.roleId && data.permissionId) {
        // let resp = await models.role_permission.create(data);
        let resp = await models.sequelize.query(`insert into role_permission(roleId,permissionId values(${data.roleId},${data.permissionId}))`);
        if (resp) {
            return ({ status: 200, sucess: true, message: "role permission created sucessfully", result: data });
        }
    }
    else {
        return ({ status: 400, sucess: false, message: "Unable to create role_permission" });
    }
}