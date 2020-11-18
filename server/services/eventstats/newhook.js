module.exports = (options = {})=>{
    return async(context) => {
        context.params.headers = {}
        if(context.params.query && context.params.query.shouldupdate){
            context.params.headers.shouldupdate="true"
            delete context.params.query.shouldupdate
        }
    };
};
