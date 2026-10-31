"use client";

import { useCallback, useEffect, useState } from "react";
import styles from "./page.module.css";

/* ── CONFIG ── adjust to match your project ── */
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const FAMILY_API = `${API}/family`;
const getToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("medaxis_token") : null;

// Values must match FamilyRelationship.RELATIONSHIP_CHOICES in your Django model
const RELATIONSHIPS = [
  "PARENT",
  "SPOUSE",
  "CHILD",
  "SIBLING",
  "GRANDPARENT",
  "GRANDCHILD",
  "OTHER",
];

/* ── TYPES ── */
type Member = {
  relationship_id: string;
  user_id: number;
  email: string;
  first_name: string;
  last_name: string;
  relationship: string;
  connected_at: string;
};

type Invitation = {
  id: string;
  sender: string;
  recipient: string;
  relationship: string;
  status: string;
  created_at: string;
  expires_at: string;
  is_sender: boolean;
};

type Doc = {
  id: number;
  title: string;
  document_type: string;
  document_date: string | null;
  file_name: string;
  file_url: string;
  uploaded_at: string;
};

type Tab = "members" | "invitations";

/* ── HELPERS ── */
async function api(path: string, options: RequestInit = {}) {
  const res = await fetch(`${FAMILY_API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
      ...(options.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || data.message || "Something went wrong.");
  return data;
}

const label = (v: string) => v.charAt(0) + v.slice(1).toLowerCase();
const fmt = (d: string | null) =>
  d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";
const initials = (m: Member) =>
  ((m.first_name?.[0] || m.email[0]) + (m.last_name?.[0] || "")).toUpperCase();

/* ── PAGE ── */
export default function FamilyPage() {
  const [tab, setTab] = useState<Tab>("members");
  const [members, setMembers] = useState<Member[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [email, setEmail] = useState("");
  const [relationship, setRelationship] = useState(RELATIONSHIPS[0]);
  const [openId, setOpenId] = useState<number | null>(null);
  const [docs, setDocs] = useState<Doc[]>([]);
  const [docsLoading, setDocsLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [sendingInvite, setSendingInvite] = useState(false);


  const load = useCallback(async () => {
    try {
      const [m, i] = await Promise.all([api("/members/"), api("/invitations/")]);
      setMembers(m);
      setInvitations(i);
    } catch (e) {
      setMsg({ type: "err", text: (e as Error).message });
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const run = async (fn: () => Promise<{ message?: string }>) => {
    try {
      const data = await fn();
      setMsg({ type: "ok", text: data.message || "Done." });
      await load();
    } catch (e) {
      setMsg({ type: "err", text: (e as Error).message });
    }
  };

  /* const sendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    
    run(async () => {
      const data = await api("/invitations/", {
        method: "POST",
        body: JSON.stringify({ email, relationship }),
      });
      setEmail("");
      setTab("invitations");
      return data;
    });
  }; */

  
const sendInvite = async (e: React.FormEvent) => {
  e.preventDefault();

  if (sendingInvite) return;

  setSendingInvite(true);

  try {
    const data = await api("/invitations/", {
      method: "POST",
      body: JSON.stringify({ email, relationship }),
    });

    setEmail("");
    setTab("invitations");
    setMsg({
      type: "ok",
      text: data.message || "Invitation sent successfully.",
    });

    await load();
  } catch (e) {
    setMsg({
      type: "err",
      text: (e as Error).message,
    });
  } finally {
    setSendingInvite(false);
  }
};


  const respond = (id: string, action: "accept" | "decline") =>
    run(() =>
      api(`/invitations/${id}/respond/`, { method: "POST", body: JSON.stringify({ action }) })
    );

  const remove = (m: Member) => {
    if (!confirm(`Remove ${m.first_name || m.email} from your family?`)) return;
    if (openId === m.user_id) setOpenId(null);
    run(() => api(`/members/${m.user_id}/`, { method: "DELETE" }));
  };

  const toggleDocs = async (m: Member) => {
    if (openId === m.user_id) return setOpenId(null);
    setOpenId(m.user_id);
    setDocs([]);
    setDocsLoading(true);
    try {
      setDocs(await api(`/members/${m.user_id}/documents/`));
    } catch (e) {
      setMsg({ type: "err", text: (e as Error).message });
    } finally {
      setDocsLoading(false);
    }
  };

  const received = invitations.filter((i) => !i.is_sender);
  const sent = invitations.filter((i) => i.is_sender);
  const pendingCount = received.filter((i) => i.status === "PENDING").length;

  return (
    <div className={styles.page}>
      {/* HEADER */}
      <header className={styles.header}>
        <div>
          <h1>Family</h1>
          <p>Connect with family members and view their shared health records.</p>
        </div>
      </header>

      <div className={styles.body}>
        {/* INVITE FORM */}
        <form className={styles.inviteCard} onSubmit={sendInvite}>
          <h2>Add a family member</h2>
          <div className={styles.inviteRow}>
            <input
              type="email"
              required
              placeholder="Their Neuronex email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
            />
            <select
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              className={styles.select}
            >
              {RELATIONSHIPS.map((r) => (
                <option key={r} value={r}>
                  {label(r)}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className={styles.primaryBtn}
              disabled={sendingInvite}
            >
              {sendingInvite ? "Sending..." : "Send invitation"}
            </button>
          </div>
        </form>

        {msg && (
          <div className={`${styles.alert} ${msg.type === "ok" ? styles.ok : styles.err}`}>
            <span>{msg.text}</span>
            <button onClick={() => setMsg(null)} aria-label="Dismiss">×</button>
          </div>
        )}

        {/* TABS */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${tab === "members" ? styles.tabActive : ""}`}
            onClick={() => setTab("members")}
          >
            Members ({members.length})
          </button>
          <button
            className={`${styles.tab} ${tab === "invitations" ? styles.tabActive : ""}`}
            onClick={() => setTab("invitations")}
          >
            Invitations
            {pendingCount > 0 && <span className={styles.dot}>{pendingCount}</span>}
          </button>
        </div>

        {/* MEMBERS */}
        {tab === "members" && (
          <div className={styles.list}>
            {members.length === 0 && (
              <div className={styles.empty}>
                No family members yet. Send an invitation to get started.
              </div>
            )}
            {members.map((m) => (
              <div key={m.relationship_id} className={styles.card}>
                <div className={styles.cardRow}>
                  <div className={styles.avatar}>{initials(m)}</div>
                  <div className={styles.info}>
                    <div className={styles.name}>
                      {`${m.first_name} ${m.last_name}`.trim() || m.email}
                      <span className={styles.badge}>{label(m.relationship)}</span>
                    </div>
                    <div className={styles.meta}>
                      {m.email} · Connected {fmt(m.connected_at)}
                    </div>
                  </div>
                  <div className={styles.actions}>
                    <button className={styles.primaryBtn} onClick={() => toggleDocs(m)}>
                      {openId === m.user_id ? "Hide records" : "View records"}
                    </button>
                    <button className={styles.ghostBtn} onClick={() => remove(m)}>
                      Remove
                    </button>
                  </div>
                </div>

                {openId === m.user_id && (
                  <div className={styles.docList}>
                    {docsLoading && <div className={styles.docEmpty}>Loading records…</div>}
                    {!docsLoading && docs.length === 0 && (
                      <div className={styles.docEmpty}>No documents uploaded yet.</div>
                    )}
                    {docs.map((d) => (
                      <div key={d.id} className={styles.docItem}>
                        <div>
                          <div className={styles.docName}>{d.title}</div>
                          <div className={styles.docMeta}>
                            {d.document_type} · {fmt(d.document_date || d.uploaded_at)}
                          </div>
                        </div>
                        <a href={d.file_url} target="_blank" rel="noreferrer" className={styles.link}>
                          Open
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* INVITATIONS */}
        {tab === "invitations" && (
          <div className={styles.list}>
            {invitations.length === 0 && (
              <div className={styles.empty}>You have no invitations.</div>
            )}

            {received.length > 0 && <h3 className={styles.sectionTitle}>Received</h3>}
            {received.map((i) => (
              <div key={i.id} className={`${styles.card} ${styles.cardRow}`}>
                <div className={styles.info}>
                  <div className={styles.name}>
                    {i.sender}
                    <span className={styles.badge}>{label(i.relationship)}</span>
                  </div>
                  <div className={styles.meta}>
                    Sent {fmt(i.created_at)} · Expires {fmt(i.expires_at)}
                  </div>
                </div>
                {i.status === "PENDING" ? (
                  <div className={styles.actions}>
                    <button className={styles.primaryBtn} onClick={() => respond(i.id, "accept")}>
                      Accept
                    </button>
                    <button className={styles.ghostBtn} onClick={() => respond(i.id, "decline")}>
                      Decline
                    </button>
                  </div>
                ) : (
                  <span className={`${styles.status} ${styles[i.status.toLowerCase()]}`}>
                    {label(i.status)}
                  </span>
                )}
              </div>
            ))}

            {sent.length > 0 && <h3 className={styles.sectionTitle}>Sent</h3>}
            {sent.map((i) => (
              <div key={i.id} className={`${styles.card} ${styles.cardRow}`}>
                <div className={styles.info}>
                  <div className={styles.name}>
                    {i.recipient}
                    <span className={styles.badge}>{label(i.relationship)}</span>
                  </div>
                  <div className={styles.meta}>
                    Sent {fmt(i.created_at)} · Expires {fmt(i.expires_at)}
                  </div>
                </div>
                <span className={`${styles.status} ${styles[i.status.toLowerCase()]}`}>
                  {label(i.status)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}