import { useParams } from "react-router-dom";
import Chat from "./Chat";

const ChatWrapper = () => {
  const otherUser = useParams();
  return <Chat otherUser={otherUser.id} />;
};

export default ChatWrapper;
