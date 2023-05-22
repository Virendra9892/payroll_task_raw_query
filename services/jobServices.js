const models = require("../models");
const client = require("../utils/redis");

exports.registerJob = async(data,userId)=>{
    let exist = await models.sequelize.query(`select * from jobs where jobs.title=${data.title} and jobs.recruiterId=${userId}`);
    if(exist){
       return ({status:400,sucess:false,message:"job already exist"});
    }
    else{
        let resp = await models.sequelize.query(`insert into jobs(title,description,recruiterId) values(${data.title},${data.description},${userId}})`);
        if(resp){
            return ({status:200,sucess:true,message:"job created sucessfully",result:resp})
        }
    }
}

exports.getAllJob = async()=>{
    let find = await client.get("all-job");
    if(find){
        let find1 = JSON.parse(find);
        return ({status:200,sucess:true,message:"data found sucessfully",data:find1});
    }
    let resp = await models.sequelize.query(`select * from jobs`);
    if(resp){
        let resp1= JSON.stringify(resp);
        await client.set("all-job",resp1)
        return ({status:200,sucess:true,message:"Data Found Sucessfuly",data:resp1})
    }
}

exports.getJobById = async(jobId)=>{
    // let response = await model.jobs.findOne({where:{id:jobId}});
    let response = await models.sequelize.query(`select * from jobs where id=${jobId}`);
    if(response){
        return ({status:200,sucess:true,message:"Job Found Sucessfully",result:response})
    }
    else{
        return ({status:404,sucess:false,message:"unable to find job"});
    }
}

exports.updateJob = async(data,jobId)=>{
    // let exist = await model.jobs.findOne({where:{id:data.id}});
    // if(exist){
        // let response = await model.jobs.update(data,{where:{id:jobId}});
        let response = await models.sequelize.query(`update jobs set title=${data.title},description=${data.description},recruiterId=${data.recruiterId} where id=${jobId}`);
        if(response){
            return ({status:200,sucess:true,message:"job updated sucessfully"});
        }
    // }
    else{
        return ({status:400,sucess:false,message:"unable to update job"})
    }
}

exports.deleteJob = async(jobId,userId)=>{
    // let response = await model.jobs.destroy({where:{id:jobId}});
    let exist = await models.sequelize.query(`select * from jobs where id=${jobId} and recruiterId=${userId}`);
    if(exist){
        let response = await models.sequelize.query(`delete from jobs where id=${jobId}`);
        if(response){
            return ({status:200,sucess:true,message:"job deleted sucessfully"});
        }
    }
    else{
        return ({status:400,sucess:false,message:"unable to delete"})
    }
}