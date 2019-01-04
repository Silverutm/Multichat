Meteor.subscribe("chatrooms");

Router.configure({
  layoutTemplate: 'ApplicationLayout'
});

// the main route. showing the list of sites.
Router.route('/', function () {
    //this.render('chatroomList');
    this.render('chatroomList', {to:'chatroomList'});
    this.render('chatrodomList', {to:'chatrodomList'});

});

// this route is for the discussion page for a site
Router.route('/chats/:_id', function () {
    var chatroomId = this.params._id;
    // at this point, we know the chatroom id
    // so we can subscribe to the messages for that chatroom
    Meteor.subscribe("messages.filtered", chatroomId);
    // now we retrieve the chatroom itself
    // and pass it to the template for rendering
    chatroom = Chatrooms.findOne({_id:chatroomId});

    Session.set('chat', chatroom) ;
    this.render('messageList', {to:'messageList', data:chatroom});
    //this.render('messageList', {data:chatroom});
});

Router.route('/duda', function () {
    //var chatroomId = this.params._id;
    // at this point, we know the chatroom id
    // so we can subscribe to the messages for that chatroom
    //Meteor.subscribe("messages.filtered", chatroomId);
    // now we retrieve the chatroom itself
    // and pass it to the template for rendering
    //chatroom = Chatrooms.findOne({_id:chatroomId});
    this.render('info', {to:'duda'});
    //this.render('messageList', {data:chatroom});
});

Router.route('/otra', function () {
    //var chatroomId = this.params._id;
    // at this point, we know the chatroom id
    // so we can subscribe to the messages for that chatroom
    //Meteor.subscribe("messages.filtered", chatroomId);
    // now we retrieve the chatroom itself
    // and pass it to the template for rendering
    //chatroom = Chatrooms.findOne({_id:chatroomId});
    Session.set('caca', '1');
    this.render('otra', {to:'duda'});
    //this.render('messageList', {data:chatroom});
});
