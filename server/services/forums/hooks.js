module.exports = (options = {})=>{
    return async(context) => {
        context.params.headers = {}
        if(context.params.query.populatecomments){
            context.params.headers.populatecomments="true"
            delete context.params.query.populatecomments
        }
        if(context.params.query.populateuser){
            context.params.headers.populateuser="true"
            delete context.params.query.populateuser
        }
    };
};
