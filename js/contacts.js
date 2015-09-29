var contacts = (function(){

    return{
        updateContactList: updateContactList
    };

    function updateContactList(country, onResult, onStatics){

        var options = {
            sortBy: "givenName",
            sortOrder: "ascending"
        };

        var cursor = navigator.mozContacts.getAll(options);
        var contacts = [];
        var n=0;

        cursor.onsuccess = function() {
            if(cursor.result) {
                try{
                    if(cursor.result.tel){ //fixed not loading when the contact does not have a phone number
                        n++;
                        if(n%100==0){
                            onStatics(n);
                        }

                        for(var i=0; i<cursor.result.tel.length; i++) {
                            var name = cursor.result.name[0];
                            var tel = cursor.result.tel[i].value.replace(/ /g,'');
                            if(tel.length>5){

                                //parse tel
                                var cid;
                                if(tel.substr(0,1)=="+"){
                                    cid=tel.substr(1,tel.length-1);
                                }else if(tel.substr(0,2)=="00"){
                                    cid=tel.substr(2,tel.length-2);
                                }else{
                                    switch(country){
                                        case ('1'): if(tel.substr(0,1)=="1"){
                                            cid=tel;
                                        }else{
                                            cid = (country) + "" + tel;
                                        }
                                        case ('54'): cid=(country)+ "9" +  tel; break;
                                        case ('52'): cid=(country)+ "1" +  tel; break;
                                        default:
                                            tel = tel.replace(/^[0]+/g,""); //remove leading 0s
                                            cid=(country)+  tel;
                                    }
                                }

                                tel="+" + cid;

                                if(name.trim()!=''){
                                    var contact = {cid: cid, name: name, tel: tel };
                                    contacts.push(contact);
                                }
                            }

                        }
                    }
                }catch(err){
                    console.log("updateListContacts error: " + err.name );
                }
                cursor.continue();
            }
            else{
                onResult(contacts);
            }
        };

        cursor.onerror = function() {
            onStatics(-1);
        };
    }
})();