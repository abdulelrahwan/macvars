module.exports = (options = {})=>{
    return async(context) => {
        context.params.headers = {}
        if(context.params.query.populateteams){
            context.params.headers.populateteams = "true"
            delete context.params.query.populateteams
        }
        if(context.params.query.populatematches){
            context.params.headers.populatematches="true"
            delete context.params.query.populatematches
        }
    };
};
