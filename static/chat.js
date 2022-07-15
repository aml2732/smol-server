console.log("chat JS loaded...");

var loadedState = false;
var chatHistory = [];
var activeUser;
var bubbleColorClasses = ['red', 'orange', 'yellow', 'green', 'blue', 'purple']

function getColorClassByHashingUserName(username){
    var index = username.length;
    var i;
    for(i=0; i<username.length; i++){
        index += username.charCodeAt(i);
    }
    index = index % bubbleColorClasses.length;
    return bubbleColorClasses[index];
}

function updateChatHistoryUI(){
    var chatLog = document.getElementById('message-log');
    chatLog.innerHTML = "";
    chatHistory.forEach(function(messageObj){
        var newDiv = document.createElement('div');
        newDiv.classList.add(getColorClassByHashingUserName(messageObj.user));
        newDiv.classList.add("message-bubble")
        newDiv.id=messageObj.user + '-' + messageObj.timestamp;
        newDiv.innerText = messageObj.message + '\n\r- '+ messageObj.user;
        chatLog.appendChild(newDiv);
    })
}

function postNewMessageToServer(messageObj, callback){
  fetch('/api/saveNewMessage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messageObj)
  })
      .then(function (response){ return response.json(); })
      .then(function (data){
        if(data.response == "success"){
            callback();
        }else{
            alert("A failure occurred while trying to save state.")
        }
    });
}


function createNewChatLog(user, message){
    var messageObj = {
        user: user,
        message: message,
        timestamp: Date.now()
    }

    function callback () {
        chatHistory.push(messageObj);
        updateChatHistoryUI();
    }

    postNewMessageToServer(messageObj, callback);

}

function selectUserButton(user){
    activeUser = user;
    //remove active-user class from others
    elementToRemoveFrom = document.getElementsByClassName('active-user');
    if(elementToRemoveFrom && elementToRemoveFrom[0] && elementToRemoveFrom[0].classList){
        elementToRemoveFrom[0].classList.remove('active-user');
    }
    //add active-user class to new active user
    document.getElementById(user).classList.add('active-user');
}

function submitMessage(){
    if(!activeUser){
        alert("You have not selected an active user yet. Message could not be posted.")
        return;
    }
    var message = document.getElementById('message');
    createNewChatLog(activeUser, message.value)
}

function onLoadFunction(){
  if(!!loadedState){ return }
  fetch('/api/getMessageHistory')
  .then(function (response){ return response.json(); })
  .then(function (data){
      if(data&&data.response){
          chatHistory = data.response
          loadedState = true;
          updateChatHistoryUI();
      }
    });
}