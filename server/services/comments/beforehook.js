const decode = require('jwt-decode');
const { NotFound, GeneralError, BadRequest } = require('@feathersjs/errors');
module.exports = (options = {}) => {
    return async (context) => {
        //  console.log(context.params)
        let data = context.data;
        if(data){
            var decoded = decode(context.params.authentication.accessToken)
            if(data.userId!=decoded.sub){
                console.log("heree")
                throw new GeneralError('The server is sleeping. Come back later.');
                return
            }
        }

    };
};
