import * as signalR from "@microsoft/signalr";

const connection = new signalR.HubConnectionBuilder()
  .withUrl("http://192.168.1.59:5220/chatHub", {
    accessTokenFactory: () => {
      return localStorage.getItem("jwtToken");
    },
    skipNegotiation: false,
    transport: signalR.HttpTransportType.WebSockets
  })
  .withAutomaticReconnect()
  .build();

export default connection;
