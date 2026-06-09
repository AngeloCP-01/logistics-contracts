# Tracking Service — WebSocket Protocol (v0.6.0)

Real-time delivery tracking over Socket.IO v4. Public endpoint (gateway-proxied):
`wss://api.<domain>/v1/tracking/socket.io/` — the gateway proxies the UPGRADE to tracking's
Socket.IO server; the gateway does NOT validate the handshake JWT (tracking owns handshake auth).

## Handshake auth
The client supplies a user JWT in the Socket.IO `auth` payload: `io(url, { auth: { token } })`.
Tracking verifies HS256 with `JWT_SECRET` (= auth-service `AUTH_JWT_SECRET`), extracting `{ userId, role }`.
A missing/invalid/expired token rejects the connection (`connect_error`).

## Rooms
`order:<orderId>`. Authorization is re-checked on every room join (not just connect), from the
local `tracking_orders` projection:
- `admin` → any order's room.
- `driver` → rooms where `tracking_orders.driverId === userId`.
- `customer` → rooms where `tracking_orders.customerId === userId`.
- Unknown order / no projection yet → join denied (the client may retry).

## Client → server events (all carry `orderId`; all guarded)
| Event | Payload | Who | Effect |
|---|---|---|---|
| `room:join` | `{ orderId }` | any authorized | join `order:<orderId>` (authz checked); on success, a last-known snapshot is emitted if one exists |
| `location:update` | `{ orderId, lat, lng, accuracy? }` | the assigned driver | persist point + broadcast `driver:location` to the room |
| `delivery:pickup` | `{ orderId }` | the assigned driver | mark in-transit + publish `delivery.in_transit` (idempotent) |
| `delivery:complete` | `{ orderId }` | the assigned driver | mark completed + publish `delivery.completed` (idempotent) |

## Server → client events
| Event | Payload | When |
|---|---|---|
| `driver:location` | `{ orderId, lat, lng, ts }` | each accepted `location:update`, broadcast to `order:<orderId>`; also emitted once to a socket on room join if a last-known point exists (snapshot) |
| `delivery:in_transit` | `{ orderId }` | on pickup |
| `delivery:completed` | `{ orderId }` | on completion |
| `error` | `{ code, message }` | on any rejected action (RFC-7807-style `code`) |

## Guards (untrusted client)
The server rejects `location:update` / `delivery:pickup` / `delivery:complete` (emitting `error`, never
mutating state) when the emitting socket's `userId` is not the order's assigned `driverId`, when the order
is unknown, or when the order is already `completed`. A driver WS drop does not change status (auto-reconnect resumes).
