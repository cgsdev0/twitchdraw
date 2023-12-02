import "@tldraw/tldraw/tldraw.css";
import React from "react";

export const OAuth = () => {
  const hash = window.location.hash.replace("#", "");
  const params = new URLSearchParams(hash);
  const twitch_access_token = params.get("access_token");
  React.useEffect(() => {
    (async () => {
      const result = await window.fetch("/api/register", {
        method: "post",
        body: JSON.stringify({ twitch_access_token }),
      });
      console.log(result);
    })();
  }, [twitch_access_token]);
  return (
    <div className="tldraw__editor">
      <p>you are logged in probably lol</p>
      <p>{twitch_access_token}</p>
    </div>
  );
};
