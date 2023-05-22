const userService = require("../services/userService");
const client = require("../utils/redis");

exports.registerUser = async(req,res)=>{
    let body = req.body;
    let data = await userService.registerUser(body);
    if(data){
        return res.status(data.status).send({sucess:data.sucess,message:data.message,result:data.result})
    }
}

exports.getAllUser = async(req,res)=>{
    let resp =await client.get("all-user");
    if(resp){
        let parseData = JSON.parse(resp);
        return ({status:200,sucess:true,message:"data found sucessfuly",result:parseData})
    }
    let data = await userService.getAllUser();
    if(data){
        let data1 = JSON.stringify(data)
        await client.set("all-user",data1)
        return res.status(data.status).send({sucess:data.sucess,message:data.message,result:data.data})
    }
}

exports.getUserById = async(req,res)=>{
    let {id} = req.userDetails;
    let result = await userService.getUserById(id);
    if(result){
        return res.status(result.status).send({sucess:result.sucess,message:result.message,data:result.result})
    }
}

exports.updateUser = async(req,res)=>{
    let {id} = req.userDetails;
    let body = req.body;
    let data = await userService.updateUser(body,id);
    if(data){
        return res.status(data.status).send({sucess:data.sucess,message:data.message,result:data.result})
    }
}

exports.deleteUser = async(req,res)=>{
    let {id} = req.userDetails;
    let data = await userService.deleteUser(id);
    if(data){
        return res.status(data.status).send({sucess:data.sucess,message:data.message,result:data.result})
    }
}

exports.getApplyJobCandidate = async(req,res)=>{
    let jobId = req.params.jobId;
    let {from,to,orderBy} = req.query;
    let result = await userService.recGetApplidJob(jobId,from,to,orderBy);
    if(result){
        return res.status(result.status).send({sucess:result.sucess,message:result.message,data:result.result})
    }
}