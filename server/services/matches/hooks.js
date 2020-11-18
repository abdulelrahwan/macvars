module.exports = (options = {})=>{
    return async(context) => {
        context.params.headers = {}
        if(context.params.query.populatecomments){
            context.params.headers.populatecomments="true"
            delete context.params.query.populatecomments
        }
        if(context.params.query.populatemaps){
            context.params.headers.populatemaps="true"
            delete context.params.query.populatemaps
        }
        if(context.params.query.populatemapsonly){
            context.params.headers.populatemapsonly="true"
            delete context.params.query.populatemapsonly
        }
        if(context.params.query.populateuser){
            context.params.headers.populateuser="true"
            delete context.params.query.populateuser
        }
        if(context.params.query.populateactiveplayers){
            context.params.headers.populateactiveplayers="true"
            delete context.params.query.populateactiveplayers
        }
        if(context.params.query.populatematchplayers){
            context.params.headers.populatematchplayers="true"
            delete context.params.query.populatematchplayers
        }
    };
};
