import { Tldraw, track } from "@tldraw/tldraw";
import "@tldraw/tldraw/tldraw.css";
import "./style.css";
import { useYjsStore } from "./useYjsStore";
import { useParams } from "react-router-dom";
import React from "react";

const HOST_URL =
  import.meta.env.MODE === "development"
    ? "ws://localhost:5200/api/ws"
    : "wss://draw.badcop.live/api/ws";

type AuthKey = "pending" | "gtfo" | "ok";
type AuthState = {
  state: AuthKey;
  name?: string;
};

export const Unauthorized = () => {
  const { streamer } = useParams();
  return (
    <div id="garbage">
      <h1>You need permission</h1>
      <div>
        You need <a href={`https://twitch.tv/${streamer}`}>{streamer}</a>&apos;s
        permission to view this page
      </div>
      <div style={{ marginTop: 12 }}>(try asking in their chat!)</div>
    </div>
  );
};
export const App = () => {
  const { streamer } = useParams();
  const [authorized, setAuthorized] = React.useState<AuthState>({
    state: "pending",
  });

  React.useEffect(() => {
    (async () => {
      const result = await window.fetch(`/api/permission_slip/${streamer}`);
      if (result.status === 200) {
        const { username } = await result.json();
        setAuthorized({ state: "ok", name: username });
      } else if (result.status === 403) {
        window.location.pathname = "/";
      } else {
        setAuthorized({ state: "gtfo" });
      }
    })();
  }, [setAuthorized, streamer]);
  return authorized.state === "pending" ? (
    <div>Loading...</div>
  ) : authorized.state === "gtfo" ? (
    <Unauthorized />
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

    console.warn(streamer);

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

  const [search, setSearch] = React.useState("");
  const onSearch = (e: any) => {
    setSearch(e.target.value);
  };
  React.useEffect(() => {
    (async () => {
      const result = await window.fetch(`/api/list`);
      if (result.status === 200) {
        const { data } = await result.json();
        setData(data);
      }
    })();
  }, [setData]);
  const filtered = data?.filter((e: any) =>
    e?.username?.toLowerCase().includes(search)
  );

  return (
    <>
      <input
        type="text"
        placeholder="search"
        value={search}
        onChange={onSearch}
      />
      <hr />
      {filtered?.length ? (
        <section>
          {filtered.map((e: any) => (
            <InviteRow {...e} key={e.user_id} />
          ))}
        </section>
      ) : (
        <div>No users found</div>
      )}
    </>
  );
});

const InviteList = track(() => {
  const [show, setShow] = React.useState(false);

  return (
    <div
      style={{ pointerEvents: "all", display: "flex", flexDirection: "column" }}
    >
      <button
        className="button-share"
        onClick={() => {
          setShow((show) => !show);
        }}
      >
        Invite
      </button>
      {show ? (
        <div className="invite-list">
          <InviteListActual />
        </div>
      ) : null}
    </div>
  );
});
