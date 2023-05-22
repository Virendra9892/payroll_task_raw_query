const models = require("../models");
const bcrypt = require("bcrypt");
const { QueryTypes,Op } = require('sequelize');
const pagination = require("../utils/pagination")


exports.registerUser = async(data)=>{
    let exist = await models.sequelize.query(`select * from user where email = ${data.email}`);
    if(exist){
        return ({status:400,sucess:false,message:"User Already Exist"});
    }
    else{
        let salt = await bcrypt.genSalt(10);
        data.password = await bcrypt.hash(data.password,salt);
        let resp = await models.sequelize.query(`INSERT INTO user(name,email,password,roleId) VALUES(${data.name,data.email,data.password,data.roleId})`);
        if(resp){
            return ({status:201,sucess:true,message:"User Created Sucessfully"});
        }
    }
}

exports.getAllUser = async()=>{
    let resp = await models.sequelize.query(`select * from user where isActive=true`);
    if(resp){
        return ({status:200,sucess:true,message:"Data Found Sucessfully",data:resp});
    }
    else{
        return ({status:404,sucess:false,message:"Data Not Found"});
    }
}

exports.getUserById = async(id)=>{
    // let exist = await model.users.findOne({id:id});
    let exist = await models.sequelize.query(`select * from user where id=${id}`)
    if(exist){
       return ({status:200,sucess:true,message:"user found sucessfully",result:exist});
    }
    else{
       return ({status:404,sucess:false,message:"user doesn't exist"});
    }
}

exports.updateUser = async(data,id)=>{
   if(data.password){
       let salt = await bcrypt.genSalt(10);
       data.password = await bcrypt.hash(data.password,salt);
   }
//    let response = await model.users.update(data,{where:{id:id}});
      let response = await models.sequelize.query(`update user set name=${data.name},email=${data.email},password=${data.password} where id=${id}`);
   if(response){
       return ({status:200,sucess:true,message:"user updated sucessfully",result:response})
   }
   else{
       return ({status:404,sucess:false,message:"something went wrong"});
   }
}

exports.deleteUser = async(id)=>{
//    let response = await model.users.destroy({where:{id:id}});
   let response = await models.sequelize.query(`delete from user where id=${id}`);
   if(response){
       return ({status:200,sucess:true,message:"user deleted sucessfully",result:response});
   }
   else{
       return ({status:404,sucess:false,message:"something went wrong"});
   }
}   

exports.recGetApplidJob = async(jobId,fromPara,toPara,orderBy)=>{
   let {offset,limit,order} = pagination(fromPara,toPara,orderBy)
   // let resp =await model.jobs.findAll({
   //   where:{id:jobId},offset:offset,limit:limit,
   //   include:{
   //     model:model.users,
   //     attributes:["name","email","id","createdAt"],
   //     through: {attributes: [

   //     ]},
   //     // order:[["id",order]]
   //   },
   //   order:[["createdAt",order]]
    
   // });

//    let resp1 = await models.user_jobs.findAll({
//        where:{
//            jobId:jobId,
//            userId:{
//                [Op.ne]: null
//            }
//        },
//        include:[
//            {
//                model:models.users,
//                as:'user',
//                attributes:["name","email"],
//            },
//            {
//                model:models.jobs,
//                as:'job',
//                attributes:["title","description"],
//            },

//        ],
//        order:[["createdAt",order]],
//        offset:offset,
//        limit:limit
//    })
   let resp1 = await models.sequelize.query(`select jobs.title,users.name,users.email from user_jobs left join users on user_jobs.userId=users.id left join jobs on user_jobs.jobId=jobs.id where user_jobs.jobId=${jobId} and user_jobs.userId not null`)
    //   let res
   if(resp1){
       const maindata = resp1.map(x=>x.user.dataValues)
       return ({status:200,sucess:true,message:"Data Found Sucessfully",result:{job:resp1[0].job.dataValues,users:maindata}});
   }
   else{
       return ({status:400,sucess:false,message:"Data Not Found"});
   }
}