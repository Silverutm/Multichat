// this will configure the sign up field so it
// they only need a username
Accounts.ui.config({
  passwordSignupFields: 'USERNAME_ONLY',
});


Template.nuevo.events({
    'click .js-toggle-chatform':function(){
        $('#chatroomForm').toggle();
    }
});

Template.chatroomList.helpers({
    chatrooms:function(){
        //Meteor.subscribe("chatrooms");
        var x = Tipos.findOne({idusuario:Meteor.userId()});
        if (x.tipo=="super") return Chatrooms.find({finalizado:false});
        return Chatrooms.find({idasesor:Meteor.userId(), finalizado:false});
    }
});

Template.chatrodomList.helpers({
    chatrooms:function(){
        //Meteor.subscribe("chatrooms");
        var x = Tipos.findOne({idusuario:Meteor.userId()});
        if (x.tipo=="super") return Chatrooms.find({finalizado:true,email:Session.get('chat').email});
        return Chatrooms.find({idasesor:Meteor.userId(), finalizado:true,email:Session.get('chat').email});
    }
});

Template.messageList.events({
    
});

Template.header.helpers({
    nickname:function(){
        if (Meteor.user()){
            return Meteor.user().username + '--';
        }
    },
});

Template.messageList.helpers({
    messages:function(chatroomId){
        if (Meteor.user() && chatroomId){
            console.log(Messages.find({}).count());
            var objDiv = document.getElementById("scroller");
        console.log(objDiv.scrollTop);
        console.log(objDiv.scrollHeight);
        objDiv.scrollTop = 3000;
        console.log("");
        console.log(objDiv.scrollTop);
        console.log(objDiv.scrollHeight);
            return Messages.find({chatroomId:chatroomId}, {sort: {createdOn: 1}});
        }
    }
});

Template.messageItem.events({
    'click .js-del-message':function(){
        Meteor.call('removeMessage', this._id, function(err, res){
            if (!res){
                alert('Can only delete your own ones...');
            }
        });
    }
});
Template.messageItem.helpers({
    derecha:function(nickname)
    {
        if (Meteor.user()){
        if (nickname==Meteor.user().username) return "right";
        return "left";}
        if (Session.get('chat').nombre == nickname)
        return "right";
        return "left";
    },

    convertir:function(date)
    {
        var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
    }
});


Template.ApplicationLayout.helpers({
    estoy:function () {
        if (!Router.current().route.getName())
            return true;
        return Router.current().route.getName().substring(0,4) != 'duda' && Router.current().route.getName().substring(0,4) != 'otra';
    }
});

Template.info.events
({
    'submit .js-duda':function(event)
    {
        Meteor.call
            (
                "encuentra_chat",
                'nada',     //parametro
                function(error, respuesta)          //para que no se asincrono
                {                                   //para el return del method
                                                    //si no regresa un undefined
                   
                    //esta funcion se llama cuando el metodo se acaba
                    if (error)                
                    {
                        console.log('hubo un error al intentar eliminar el problema');
                        console.log(error.error);
                        return;
                    }      
                    respuesta.tema = event.target.tema.value;
                    respuesta.nombre = event.target.nombre.value;
                    respuesta.email = event.target.email.value;
                    var w = respuesta;
                    //Router.go('/cliente');
                    if (!w.idasesor){
                        var anterior = Anterior.findOne();
                        

                        var sig = Tipos.findOne({idusuario:{$ne:anterior.idasesor}, tipo:respuesta.tema});
                        w.idasesor = sig.idusuario;
                        Chatrooms.update({_id:w._id}, w);
                        //Chatrooms.update({_id:w._id},{$set:{idasesor:sig.idusuario}});
                        

                        var men=
                        {                            
                            messageText : "Hola en que te puedo ayudar",
                            chatroomId : w._id,
                            nickname : Meteor.users.findOne({_id:w.idasesor}).username,
                            createdOn : new Date(),
                            privado : false
                        };
                        console.log('aqui');
                        Messages.insert(men);

                        Anterior.update({_id:anterior._id},{$set:{idasesor:sig.idusuario}});
                    }
                    Session.set('chat', w);
                    //this.render('messageList', {to:'messageList', data:w});
                }
            );

            return false;
    },

    'click .js-checar':function (event) {
        Session.set('alumno',$("#alumno").is(':checked'));
    }
});

Template.info.helpers({
    ya:function()
    {
        return !Session.get('chat');
    },

    soy_alumno:function () 
    {
        return Session.get('alumno');
    }
});

Template.chatroomItem.helpers({
    description:function(id)
    {
        var x = Messages.findOne({chatroomId:id},{sort:{createdOn:-1}});
        if (x) return x.messageText;
        return "nuevo chat";
    }
});



Template.copiamessageList.helpers({
    messages:function(){
        //var chatroomId = Session.get('chat')._id;
            console.log(Messages.find({}).count());
            var objDiv = document.getElementById("scroller");
            if (objDiv){
        console.log(objDiv.scrollTop);
        console.log(objDiv.scrollHeight);
        objDiv.scrollTop = 3000;
        console.log("");
        console.log(objDiv.scrollTop);
        console.log(objDiv.scrollHeight);}
        console.log(Session.get('chat'));
        console.log("hola-----");
        if (Session.get('chat'))
            {var x = Messages.find({chatroomId:Session.get('chat')._id, privado:{$ne:true}}, {sort: {createdOn: 1}});
                var w = Chatrooms.findOne({_id:Session.get('chat')._id, finalizado:false});
                if (w) return x;
                else
                {
                    alert('Chat finalizado');
                    Router.go('/otra');
                }
                }
        
    }
});

Template.copiamessageForm.helpers({
    id:function()
    {
        return Session.get('chat')._id;
    },

    nombre:function()
    {
        return Session.get('chat').nombre;  
    }
});


Template.info.onCreated
(
    function()
    {
        Meteor.call
            (
                "encuentra_chat",
                'nada',     //parametro
                function(error, respuesta)          //para que no se asincrono
                {                                   //para el return del method
                                                    //si no regresa un undefined
                   
                    //esta funcion se llama cuando el metodo se acaba
                    if (error)                
                    {
                        console.log('hubo un error al intentar eliminar el problema');
                        console.log(error.error);
                        return;
                    }      
                    
                    
                    var w = respuesta;
                    //Router.go('/cliente');
                    if (!w.idasesor){
                        var anterior = Anterior.findOne();
                        w.tema = event.target.tema.value;
                        w.nombre = event.target.nombre.value;    

                        var sig = Tipos.findOne({idusuario:{$ne:anterior.idasesor}, tipo:"lic"});
                        w.idasesor = sig.idusuario;
                        Chatrooms.update({_id:w._id}, w);
                        //Chatrooms.update({_id:w._id},{$set:{idasesor:sig.idusuario}});


                        Anterior.update({_id:anterior._id},{$set:{idasesor:sig.idusuario}});
                    }
                    Session.set('chat', w);
                    //this.render('messageList', {to:'messageList', data:w});
                }
            );
    }
)



Template.messageForm.events({
    'click .js-finalizar':function()
    {
        Chatrooms.update({_id:Session.get('chat')._id},{$set:{finalizado:true}});
        Router.go('/');
    },

    'click .js-transferir':function()
    {
        if (Session.get('chat').tema=='master')
        {
            var x = Tipos.findOne({tipo:'lic'});
            Chatrooms.update({_id:Session.get('chat')._id},{$set:{idasesor:x.idusuario,tema:'lic'}});    
            var w = Meteor.users.findOne({_id:x.idusuario});
            alert('Transferido a ' + w.username);
        }
        else            
        {
            var x = Tipos.findOne({tipo:'master'});
            Chatrooms.update({_id:Session.get('chat')._id},{$set:{idasesor:x.idusuario,tema:'master'}});    
            var w = Meteor.users.findOne({_id:x.idusuario});
            alert('Transferido a ' + w.username);
        }
        //Chatrooms.update({_id:Session.get('chat')._id},{$set:{finalizado:true}});
        Router.go('/');
    }
});

Template.otra.helpers
({
    altura:function()
    {
        if (Session.get('chat'))
            return 500;
        return 355;
    }
});