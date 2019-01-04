Meteor.methods({
    'insertMessage':function(message)
    {
        
            // force the user field to be the current user
            if (Meteor.user()) message.nickname = Meteor.user().username;
            message.createdOn  = new Date();
            
            
            
            return Messages.insert(message);
        
    },
    'insertChatroom':function(chatroom){
        
            // force the user field to be the current user
            chatroom.createdBy = Meteor.user().username;
            return Chatrooms.insert(chatroom);
        
    }
})

Meteor.methods({
    'removeMessage':function(id){
        
            var msg = Messages.findOne({_id:id});
            
                    Messages.remove({_id:id});
                    return true;
            
        
    },

    'encuentra_chat':function(nada)
    {
        if (this.isSimulation) return {};
        var z = this.connection.clientAddress;

        var x = Chatrooms.findOne({ip:z, finalizado:false});
        if (x) return x;

        var nuevo={
            ip:this.connection.clientAddress,
            finalizado:false
        };

        var id = Chatrooms.insert(nuevo);
        x = Chatrooms.findOne({_id:id});

        return x;
    }
})
