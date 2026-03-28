# Frontend UI/UX Implementation Spec (Terranet)

This document turns the current frontend UI/UX into an implementation-ready spec for another agent, with emphasis on the chat/thread experience.

---

## 1) Product UX model

The app has three core UX surfaces:

1. **Navigation shell** (left sidebar)
2. **Thread workspace** (chat + controls)
3. **Execution workspace** (right “Kortix Computer” side panel)

The thread screen is intentionally a **dual-workspace experience**:
- Left/main = conversational control (messages, prompt composition)
- Right/side = execution visibility (tools/files/computer view)

The UI prioritizes:
- low-friction prompting,
- high streaming clarity (reasoning, tool calls, partial text),
- rapid pivot from conversation to artifacts/files/tools.

---

## 2) Route-level IA (relevant to thread/chat)

Primary thread entry points:

- `/projects/[projectId]/thread/[threadId]`  
  - main full thread surface (`ThreadComponent`)  
  - file: `apps/frontend/src/app/(dashboard)/projects/[projectId]/thread/[threadId]/page.tsx`

- `/thread/[threadId]`  
  - redirect resolver to project-aware thread route  
  - file: `apps/frontend/src/app/(dashboard)/thread/[threadId]/page.tsx`

- `/agents/[threadId]`  
  - redirect wrapper route  
  - file: `apps/frontend/src/app/(dashboard)/agents/[threadId]/page.tsx`

- `/share/[threadId]`  
  - shared/read-only playback-oriented variant  
  - file: `apps/frontend/src/app/share/[threadId]/page.tsx`

---

## 3) Global layout/navigation UX

### Left sidebar (`SidebarLeft`)
- Collapsible desktop sidebar with icon-only collapsed state.
- Mobile sheet sidebar.
- Three state views:
  - Chats
  - Workers
  - Triggers/Global config
- Separate Files entry (not a tab-state).
- Keyboard shortcuts:
  - `Cmd/Ctrl+B`: toggle sidebar
  - `Cmd/Ctrl+K`: open thread search
  - `Cmd/Ctrl+J`: start new chat (`/dashboard`)
- File: `apps/frontend/src/components/sidebar/sidebar-left.tsx`

### Thread header (`SiteHeader`)
- Left:
  - mobile menu button (on mobile)
  - mode indicator (default variant) OR project title + “Shared” badge (shared variant)
- Right:
  - Share button (normal threads) OR Copy Link button (shared threads)
  - side panel toggle (open/close Kortix Computer)
- Sticky top bar.
- File: `apps/frontend/src/components/thread/thread-site-header.tsx`

---

## 4) Thread screen architecture

Main orchestrator: `ThreadComponent`  
File: `apps/frontend/src/components/thread/ThreadComponent.tsx`

Composed by:
- `ThreadLayout` (shell: header + main pane + side pane + responsive behavior)
- `ThreadContent` (message rendering, streaming UI, reasoning, actions)
- `ChatInput` (prompt composer + uploads + controls + snack overlays)

### 4.1 Desktop structure
- Resizable horizontal panel group:
  - **Main panel**: header + message stream + input
  - **Side panel**: Kortix Computer
- Side panel can auto-open when tool calls exist.
- Default open split ~50/50.
- “Suite mode” file types (xlsx/csv/ppt/etc.) bias side panel wider.
- File: `apps/frontend/src/components/thread/layout/thread-layout.tsx`

### 4.2 Mobile structure
- Single-column vertical stack:
  - Header
  - Message stream (flex-1)
  - Input pinned bottom with safe-area inset
- Side panel is modal/overlay style (`KortixComputer` open state).

### 4.3 Shared variant
- Uses `variant="shared"` in header/layout.
- Read-only conversation playback controls.
- No active prompt submission.

### 4.4 Compact variant
- Embedded mode with simplified wrapping and overlaid side panel.

---

## 5) Thread content UX spec (chat transcript)

Component: `ThreadContent`  
File: `apps/frontend/src/components/thread/content/ThreadContent.tsx`

### 5.1 Message grouping model
- User messages render as right-aligned bubbles.
- Assistant/tool/browser_state messages form assistant groups.
- Consecutive assistant groups are merged for continuity.
- Deduplication handles optimistic temp messages vs server-confirmed messages.

### 5.2 User message rendering
- Extracts text from plain/string/JSON/multimodal block payloads.
- Strips attachment tags from text body.
- Attachments render as visual grid (`FileAttachmentGrid`).

### 5.3 Assistant rendering
- Agent header:
  - Brand assistant uses compact brand logo mark.
  - Other agents use avatar + name.
- Assistant message body rendered via shared helper (`renderAssistantMessage`).
- Tool result blocks inline with assistant turn.

### 5.4 Streaming UX behavior
- Streaming text rendered progressively (`StreamingText`, smooth stream).
- Tool-stream previews shown live (`ShowToolStream`).
- Ask/complete tool text extraction avoids duplicate rendering.
- Grace period favors reasoning surfacing before early text.

### 5.5 Reasoning UX
- Collapsible reasoning section above assistant content.
- “Show Reasoning / Hide Reasoning” toggle.
- Persistent expanded state across stream→persist transitions.
- Reasoning can show while active and persisted after completion.
- Component: `ReasoningSection`

### 5.6 Message actions
- At end of assistant block:
  - Copy
  - Like/Dislike
  - (Voice button exists in code path but currently commented out in actions UI)
- Component: `MessageActions`

### 5.7 Empty/new thread state
- Rich mode-based starter experience (Slides/Sheets/Docs/Canvas/Video/Research).
- Includes:
  - starter templates
  - quick prompts
  - category-driven prompt scaffolding
- Component: `NewThreadEmptyState`

---

## 6) Chat input/composer UX spec

Component: `ChatInput`  
File: `apps/frontend/src/components/thread/chat-input/chat-input.tsx`

### 6.1 Core composition behavior
- Auto-resizing textarea (max height 200px).
- Enter submits on desktop, Shift+Enter newline.
- Mobile Enter creates newline (submission not forced).
- Drag/drop + paste image handling.

### 6.2 File attachment behavior
- Files appear inline above textarea in attachment strip.
- Upload statuses: pending/uploading/ready/error.
- Message injects file references in canonical tag format:
  - `[Uploaded File: uploads/<name>]`

### 6.3 Left control cluster
- File upload button
- Integrations button (with rotating integration icon carousel)
- Optional agent mode switcher (feature-flagged)
- Optional selected-mode pill (suna mode metadata)

### 6.4 Right control cluster
- Context usage indicator (desktop)
- Agent/model config menu
- Voice recorder
- Submit button:
  - idle: send icon
  - running: stop square
  - uploading/loading: spinner
  - queue mode code-path exists but feature-flagged off

### 6.5 Snack layer above composer (`ChatSnack`)
Rotating/priority snack slot for:
- live tool preview shortcut (when side panel closed + tools active),
- upgrade CTA (free-tier conditionals),
- voice playback mini-control panel.

### 6.6 Advanced config rail (optional)
- Integrations / Tools / Instructions / Knowledge / Triggers quick-open actions.

---

## 7) Right side panel UX (“Kortix Computer”)

Exposed through `ThreadLayout` and controlled from `ThreadComponent`.

Behavior:
- Open/close by header toggle.
- Can auto-open on tool activity.
- Handles file browser/file viewer requests from thread content or header.
- Receives tool call context + streaming tool args + navigation index.

Design intent:
- Keep conversation and execution spatially parallel.
- Make tool/file outcomes inspectable without leaving thread context.

---

## 8) State & transition spec

### 8.1 Loading and skeleton
- `ThreadSkeleton` used while initial thread data not ready.
- Supports compact/full variants and initializing message.

### 8.2 Optimistic new-thread flow
- Optimistic user prompt displayed before server confirmation.
- De-dup strategy replaces temp user messages with persisted versions.
- Seamless transition from optimistic UI to streamed/persisted thread.

### 8.3 Agent status states
- `idle`, `connecting`, `running`, `error`
- Stream hook status synchronized with agent status to avoid stuck visuals.

### 8.4 Error states
- Thread initialization error -> `ThreadError` screen in layout shell.
- Stream and billing failures surface toast/modal/banner pathways.

### 8.5 Shared playback
- Shared view can playback stepwise message evolution with floating controls.

---

## 9) Responsive behavior summary

### Desktop
- 2-pane resizable workspace.
- Full sidebar collapse/expand support.
- Composer centered with max width.

### Mobile
- Sidebar as slide-over sheet.
- Thread header has inline menu button.
- Composer anchored to bottom with safe-area padding.
- Side panel overlays rather than occupying fixed second pane.

---

## 10) Visual language/tokens (implementation notes)

Global theme is tokenized via CSS variables in `globals.css`:
- `--background`, `--foreground`, `--card`, `--border`, etc.
- Radius convention includes heavy rounded language (`rounded-2xl`, `rounded-3xl`) for chat surfaces.

Common motif in chat surfaces:
- soft borders,
- rounded capsules/cards,
- muted foreground for metadata,
- compact icon button affordances with tooltips.

Branding source:
- `apps/frontend/src/lib/branding.ts`
- Brand assistant name/identity is driven by `branding.aiName` and logo assets.

---

## 11) Interaction contracts another agent must preserve

1. **Message grouping/dedup rules** (temp vs persisted, attachment-only handling).
2. **Reasoning-first streaming behavior** (grace period + non-duplicative merge).
3. **Tool preview split model**:
   - inline in transcript
   - expand-to-side-panel shortcut.
4. **Composer multi-input workflow**:
   - text + files + integrations + model/agent + voice.
5. **Responsive parity**:
   - desktop split pane, mobile stacked/overlay.
6. **Shared vs normal thread behavior separation**.

---

## 12) End-to-end implementation blueprint (for another agent)

1. Build shell primitives:
   - sidebar, thread header, panel toggles, route plumbing.
2. Build thread orchestrator:
   - state machine for loading/optimistic/streaming/error/shared.
3. Build transcript renderer:
   - message grouping, assistant rendering, reasoning, tool streams, actions.
4. Build composer:
   - isolated textarea, files, controls, submit/stop behavior, snack overlays.
5. Build right workspace:
   - side panel open/close, tool/file navigation, streaming-aware context.
6. Wire shared mode:
   - read-only playback + shared header semantics.
7. Validate:
   - desktop/mobile flows
   - optimistic transitions
   - dedup + streaming edge cases
   - no duplicate ask/complete text rendering
   - consistent tool/file affordances across panes.

---

## 13) Canonical source files to mirror

- `apps/frontend/src/components/thread/ThreadComponent.tsx`
- `apps/frontend/src/components/thread/layout/thread-layout.tsx`
- `apps/frontend/src/components/thread/content/ThreadContent.tsx`
- `apps/frontend/src/components/thread/chat-input/chat-input.tsx`
- `apps/frontend/src/components/thread/thread-site-header.tsx`
- `apps/frontend/src/components/sidebar/sidebar-left.tsx`
- `apps/frontend/src/components/thread/content/NewThreadEmptyState.tsx`
- `apps/frontend/src/components/thread/content/ThreadSkeleton.tsx`
- `apps/frontend/src/components/thread/content/ReasoningSection.tsx`
- `apps/frontend/src/components/thread/chat-input/chat-snack.tsx`
- `apps/frontend/src/components/thread/mode-indicator.tsx`

