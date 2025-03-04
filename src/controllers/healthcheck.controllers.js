import asyncHandler from "../utils/asyncHandler.js";


const healthcheck = asyncHandler((req, res) => {
    res.status(200).send("EndPoint Established!!!")
})

export default healthcheck