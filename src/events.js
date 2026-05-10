import "dotenv/config";
import instance from "./ethers.js";

(()=>{
    console.log("Listening for events....");
    console.log("Contract"+instance.target);
    instance.on("Issued",(course,id,grade,event)=>{
        console.log("Event Occured **********");
        console.log("course:",course);
        console.log("id:",id.toString());
        console.log("grade:",grade);
        console.log("tx:",event.log.transactionHash);
        console.log("*******************");       
        
    });   
    
})();