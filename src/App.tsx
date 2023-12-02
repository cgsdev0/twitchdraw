import { Tldraw, track, useEditor } from "@tldraw/tldraw";
import "@tldraw/tldraw/tldraw.css";
import { useYjsStore } from "./useYjsStore";
import { useParams } from "react-router-dom";
import React from "react";

const HOST_URL =
  import.meta.env.MODE === "development"
    ? "ws://localhost:5200/api/ws"
    : "wss://demos.yjs.dev";

type AuthKey = "pending" | "gtfo" | "ok";
type AuthState = {
  state: AuthKey;
  name?: string;
};
export const App = () => {
  const { streamer } = useParams();
  // const editor = useEditor();
  const [authorized, setAuthorized] = React.useState<AuthState>({
    state: "pending",
  });

  React.useEffect(() => {
    (async () => {
      const result = await window.fetch(`/api/permission_slip/${streamer}`);
      if (result.status === 200) {
        const { username } = await result.json();
        console.warn(username);
        setAuthorized({ state: "ok", name: username });
        // setTimeout(() => {
        // }, 100);
      } else {
        setAuthorized({ state: "gtfo" });
      }
    })();
  }, [setAuthorized, streamer]);
  return authorized.state === "pending" ? (
    <p>Loading...</p>
  ) : authorized.state === "gtfo" ? (
    <p>Unauthorized</p>
  ) : (
    <AuthorizedApp
      host={authorized.name === streamer}
      name={authorized.name || ""}
    />
  );
};

const AuthorizedApp = track(
  ({ host, name }: { name: string; host: boolean }) => {
    const { streamer } = useParams();
    const store = useYjsStore({
      roomId: streamer,
      hostUrl: HOST_URL,
    });

    return (
      <div className="tldraw__editor">
        <Tldraw
          autoFocus
          store={store}
          shareZone={host ? <InviteList /> : undefined}
          onMount={(editor) => {
            editor.user.updateUserPreferences({
              name,
            });
          }}
        />
      </div>
    );
  }
);

const InviteRow = ({
  username,
  user_id,
  allowed,
}: {
  username: string;
  user_id: number;
  allowed: number;
}) => {
  return (
    <div>
      <input
        type="checkbox"
        id={`checkbox-${username}`}
        defaultChecked={Boolean(allowed)}
        onChange={async (e) => {
          const method = e.target.checked ? "put" : "delete";
          e.target.disabled = true;
          await window.fetch(`/api/perms/${user_id}`, { method });
          e.target.disabled = false;
        }}
      />
      <label htmlFor={`checkbox-${username}`}>{username}</label>
    </div>
  );
};
const InviteListActual = track(() => {
  const [data, setData] = React.useState<any>(null);
  React.useEffect(() => {
    (async () => {
      const result = await window.fetch(`/api/list`);
      if (result.status === 200) {
        const { data } = await result.json();
        setData(data);
      }
    })();
  }, [setData]);
  return data?.map((e: any) => <InviteRow {...e} key={e.user_id} />);
});

const InviteList = track(() => {
  const [show, setShow] = React.useState(false);
  // onChange={(e) => {
  //   editor.user.updateUserPreferences({
  //     color: e.currentTarget.value,
  //   });
  // }}
  return (
    <div
      style={{ pointerEvents: "all", display: "flex", flexDirection: "column" }}
    >
      <button
        onClick={() => {
          setShow((show) => !show);
        }}
      >
        Permissions
      </button>
      {show ? (
        <div>
          <InviteListActual />
        </div>
      ) : null}
    </div>
  );
});
