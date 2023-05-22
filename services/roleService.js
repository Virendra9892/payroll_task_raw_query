const models = require("../models");
const client = require("../utils/redis");

exports.addRole = async(data)=>{
    // let exist = await models.roles.findOne({where:{role:data.role}});
    let exist = await models.sequelize.query(`select * from roles where role=${data.role}`)
    if(exist){
        return ({status:400,sucess:false,message:"role already exist"});
    }
    else{
        // let resp = await models.roles.create(data);
        let resp = await models.sequelize.query(`insert into roles(role,description) values(${data.role},${data.description})`);
        if(resp){
            return ({status:200,sucess:true,message:"role created sucessfully",result:resp});
        }
    }
}

exports.getRole = async()=>{
    // let exist = await models.roles.findAll();
    let find = await client.get("all-role");
    if(find){
        let find1 = JSON.parse(find);
        return ({status:200,sucess:true,message:"data found sucessfully",result:find1});
    }
    let exist = await models.sequelize.query(`select * from roles`);
    if(exist){
        let exist1 = JSON.stringify(exist);
        await client.set("all-role",exist1);
        return ({status:200,sucess:true,message:"role found sucessfully",result:exist});
    }
    else{
        return ({status:404,sucess:false,message:"role doesn't exist"});
    }
}

exports.updateRole = async (id, data) => {
    // let response = await models.roles.update(data, {where:{ id: id}});
    let response = await models.sequelize.query(`update roles set role=${data.role},description=${data.description} where id=${id}`);
    if (response) {
        return ({status:200, sucess:true,message:"role updated sucessfully"})
    }
    else {
        return ({status:500, sucess:false,message: 'something went wrong'})
    }
}

exports.deleteRole = async (id) => {
    // let response = await models.roles.destroy({ where:{id:id}});
    let response = await models.sequelize.query(`delete from roles where id=${id}`);
    if (response) {
        return ({status:200,sucess:true,message:"role deleted sucessfully"})
    }
    else {
        return ({status:500,sucess:false, message: `something went wrong` })
    }
} 