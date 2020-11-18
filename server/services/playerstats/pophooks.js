module.exports = (options = {})=>{
    return async(context) => {
        context.params.headers = {}
        if(context.params.query.populatematch){
            context.params.headers.populatematch ="true"
            delete context.params.query.populatematch
        }
        if(context.params.query.populateevent){
            context.params.headers.populateevent="true"
            delete context.params.query.populateevent
        }
        if(context.params.query.populateplayer){
            context.params.headers.populateplayer ="true"
            delete context.params.query.populateplayer
        }
        if(context.params.query.populateagent){
            context.params.headers.populateagent="true"
            delete context.params.query.populateagent
        }
        if(context.params.query.populatemap){
            context.params.headers.populatemap = "true"
            delete context.params.query.populatemap
        }
    };
};
