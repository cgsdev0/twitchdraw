import "@tldraw/tldraw/tldraw.css";
import React from "react";

export const OAuth = () => {
  React.useEffect(() => {
    (async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");
      const redirect_uri = window.location.origin + window.location.pathname;
      const result = await window.fetch("/api/register", {
        method: "post",
        body: JSON.stringify({ code, redirect_uri }),
      });
      const { username } = await result.json();
      if (username) {
        window.location.href = `${window.location.origin}/draw/${username}`;
      }
    })();
  }, []);
  return (
    <div>
      <p>Signing in...</p>
    </div>
  );
};
