export const parsePayload=(payload)=>{
    if(payload instanceof Buffer){
        
        payload.toString('utf-8')
    }
    try{
        payload=JSON.parse(payload);
    }
    catch(err){
        payload=null;
    }
    return payload


}