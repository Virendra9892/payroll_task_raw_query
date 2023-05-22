const models = require("../models");
const { Op } = require("sequelize")
const sendEmail = require("../utils/sendEmail");
const pagination = require("../utils/pagination");

exports.userApplyJob = async(data,userId)=>{
    // let exist = await models.jobs.findOne({where:{id:data.jobId}});
    let [exist] = await models.sequelize.query(`select * from jobs where id=${data.jobId}`);
    if(exist){
        // let resp = await models.user_jobs.create({jobId:data.jobId,userId:userId});
        let resp = await models.sequelize.query(`insert into user_jobs(userId,jobId) values(${userId},${jobId})`);
        let recId = exist.recruiterId;
        // let users = await models.users.findAll({where:{id:{[Op.in]:[userId,recId]}}});
        let [users] = await models.sequelize.query(`select * from users where id in(${userId},${recId})`);
        let canSub = `Applied Job Mail`;
        let canText = `Hi ${users[0].name}, <br><br>congratulation..... You have sucessfully applied job on ${job.title}`;
        let recSub = `Job Applied Notification`
        let recText = `Hi ${users[1].name}, <br><br>Candidate ${users[0].name} has applied job ${job.title}.`;
        await sendEmail(canSub,canText,users[0].email);
        await sendEmail(recSub,recText,users[1].email);
        if(resp){
            return ({status:200,sucess:true,message:"sucessfully applied job",result:resp})
        }
    }
    else{
        return ({status:500,sucess:false,message:"something went wrong."});
    }
}

exports.getApplyJobList = async(userId)=>{
    // let exist = await models.users.findAll({where:{id:userId},
    //    include:[{
    //      models:"jobs",
    //      attributes:["title","description"]
    //    }]
    // });
    let [exist] = await models.sequelize.query(`select users.name,users.email,jobs.title,jobs.description from users left join user_jobs on users.id=user_jobs.userid left join jobs on jobs.id=user_jobs.jobId where users.id=${userId}`);
    if(exist){
        return ({status:200,sucess:true,message:"user apllied job list found sucessfully",result:exist});
    }
    else{
        return ({status:404,sucess:false,message:"user haven't applied any job yet."})
    }
}

exports.canSeeListOfJob = async(userId,from,to,orderBy)=>{
    let {limit,offset,order} = pagination(from,to,orderBy);
//     let resp = await models.user_jobs.findAll({where:{
//         userId:userId
//     },
//     // include:{
//     //     model:models.users,
//     //     as:"user",
//     //     attribures:["name","email"]
//     // },
//     include:{
//         model:models.jobs,
//         as:"job",
//         attribures:["title","description"]
//     },
//     limit:limit,
//         offset:offset,
//         order:[["createdAt",order]]
// });
let [resp] = await models.sequelize.query(`select users.name,users.email,jobs.title,jobs.description from users left join user_jobs on users.id=user_jobs."userId" left join jobs on jobs.id=user_jobs."jobId" where users.id=${userId} order by user_jobs."createdAt" ${order} limit ${limit} offset ${offset}`);
console.log(resp,"{{{{{{{{{{{{{{{{");
if(resp){
    let jobData = resp.map(x=>{
        let title=x.title;
        let description=x.description
        return {jobTitle:title,description:description}
    });
    let candidate=resp[0].name;
    return ({status:200,sucess:true,message:"Data Found Sucessfully",result:{candidate:resp[0].name,job:jobData}});
}
else{

    return ({status:404,sucess:false,message:"Data Not Found"})
}
}