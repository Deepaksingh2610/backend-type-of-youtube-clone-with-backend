

const asyncHandler = (requestHandler) => {
    return (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next)).catch(next)
    }
}

export {asyncHandler}




















// we can used both promises and try catach
// try and catch method ways
// const asyncHandler = (fn) => async (req, res, next) =>{
//   try {
//     await fn(req,res,next)
    
//   } catch (error) {
//     res.status(error.code || 500).json({
//         success: false,
//         message:error.message
//     })
//   }
// }