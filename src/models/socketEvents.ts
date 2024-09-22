export enum SocketEvents {

    JoinRoom = "joinRoom",
    RoomJoined = "roomJoined",
    LeaveRoom = "leaveRoom",
    RoomLeft = "roomLeft",

    MarkReady = "markReady",
    playerReady = "playerReady",
    StartGame = "startGame",

    SendMessage = "sendMessage",
    MessageSent = "messageSent",

    GameUpdate = "gameUpdate",
    PlayerUpdate = "playerUpdate",

    PlayCard = "playCard",
    CannotPlayCard = "cannotPlayCard",

    GetMe = "getMe",

    SelectBestCard = "selectBestCard",

    SelectNomination = "selectNomination",
    PickUp = "pickUp",

    PlayerWon = "playerWon",
    RestartGame = "restartGame",

    SetTest = "setTest",
}