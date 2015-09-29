var c2browser = document.querySelector("iframe[mozbrowser]");

var connector = (function(){
    return{
        result: result,
        statics: statics
    };

    function sendData(operation, data){

        var tmpData = encodeURIComponent(JSON.stringify(data));
        c2browser.src = c2browser.src.split('#')[0] + '#' + operation + '#' + tmpData;
    }

    function result(data){
        sendData('result',data);
    }

    function statics(data){
        sendData('statics',data);
    }

})();

c2browser.addEventListener("mozbrowserlocationchange", function( event ) {
    console.log("Changing location: " + event.detail);

    if(event.detail.toString().indexOf("#")>0){

        var argList = event.detail.split('#');

        if(argList.length%2 == 0) {//only RX
            var country = argList[1];
            contacts.updateContactList(country, connector.result, connector.statics);
        }
    }
});