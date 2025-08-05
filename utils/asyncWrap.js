const asyncWrap =(asyncFn)=>{
    return function (req,res,next){
        asyncFn(req,res,next).catch((err)=>{next(err)});
    }
}

export {asyncWrap};