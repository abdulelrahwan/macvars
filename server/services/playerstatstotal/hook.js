module.exports = (options = {})=>{
    return async(context) => {
        context.params.headers = {}
        if(context.params.query && context.params.query.populateplayer){
            context.params.headers.populateplayer="true"
            delete context.params.query.populateplayer
        }
    };
};
