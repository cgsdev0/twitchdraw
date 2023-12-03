import "@tldraw/tldraw/tldraw.css";
import "./style.css";
import { TWITCH_CLIENT_ID } from "./client_id";

export const Login = () => {
  const redirect_uri = encodeURIComponent(
    `${window.location.protocol}//${window.location.host}/oauth`
  );
  const onClick = () => {
    window.location.href = `https://id.twitch.tv/oauth2/authorize?client_id=${TWITCH_CLIENT_ID}&redirect_uri=${redirect_uri}&response_type=code&scope=`;
  };
  return (
    <div id="garbage">
      <h1>Draw Stuff With Chat</h1>
      <div>
        This is a fork of <a href="https://tldraw.com">tldraw.com</a> that
        allows you to share a whiteboard with your Twitch community!
      </div>
      <div style={{ marginTop: 22 }}>
        <button className="button-twitch" onClick={onClick}>
          Login with Twitch
        </button>
      </div>
    </div>
  );
};
