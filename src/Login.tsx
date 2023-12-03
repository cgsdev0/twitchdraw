import "@tldraw/tldraw/tldraw.css";
import { TWITCH_CLIENT_ID } from "./client_id";

export const Login = () => {
  const redirect_uri = `${window.location.protocol}://${window.location.host}/oauth`;
  return (
    <div className="tldraw__editor">
      <a
        href={`https://id.twitch.tv/oauth2/authorize?client_id=${TWITCH_CLIENT_ID}&redirect_uri=${redirect_uri}&response_type=token&scope=`}
      >
        Login with Twitch
      </a>{" "}
    </div>
  );
};
