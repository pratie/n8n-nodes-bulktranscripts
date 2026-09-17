# n8n-nodes-bulktranscripts

An [n8n](https://n8n.io) community node for [BulkTranscripts](https://bulktranscripts.co):
YouTube transcripts for a single video, a whole channel or a playlist, plus YouTube
search and free new-upload tracking. No yt-dlp, no proxies, no IP blocks to fight.

[Installation](#installation) · [Operations](#operations) · [Credentials](#credentials) ·
[Example workflow](#example-workflow) · [Resources](#resources)

## Installation

Follow the [community nodes installation guide](https://docs.n8n.io/integrations/community-nodes/installation/)
and enter the package name:

```
n8n-nodes-bulktranscripts
```

## Operations

| Resource | Operation | What it does | Cost |
| --- | --- | --- | --- |
| Transcript | Get | Transcript of a YouTube video, Short or TikTok video as text, paragraphs and optional timestamped segments | 1 credit the first time, free afterwards |
| Channel | Get Latest Uploads | Up to 15 newest uploads of a channel | Free |
| Channel | List Videos | Up to 1,000 videos of a channel | 1 credit |
| Channel | Search | Videos about a topic inside one channel | 1 credit |
| Playlist | List Videos | A playlist in order, up to 1,000 videos | 1 credit |
| Search | Search YouTube | Videos, channels or playlists matching a query | 1 credit |
| Account | Get Balance | Remaining credits for the key | Free |

List operations output **one item per video** by default, so you can connect them
straight to a Transcript node. Turn off **Split Into Items** to get the raw response
with counts and billing info instead.

Failed transcripts (no captions, private or removed video) are never charged. The node
can also be used as a tool by n8n AI Agent nodes.

## Credentials

1. Sign in with Google at [bulktranscripts.co/app?tab=mcp](https://bulktranscripts.co/app?tab=mcp).
   It is free, includes 30 credits and needs no card.
2. Open the **Connect AI** tab and press **Create key** in the **API keys** card.
3. In n8n, create a **BulkTranscripts API** credential and paste the key (it starts with `bt_ak_`).

A license key from a [credit pack](https://bulktranscripts.co/#pricing) works in the same
field. Packs are one-time purchases and credits never expire.

## Example workflow

[`examples/new-uploads-to-transcripts.json`](examples/new-uploads-to-transcripts.json) checks a
channel for new uploads every hour for free, skips videos it has already seen, and fetches a
transcript only for the new ones. Import it via **Workflows → Import from file**, select your
credential on both BulkTranscripts nodes, and connect whatever comes next: an AI summary, Slack,
Notion, a database.

[`examples/playlist-to-transcripts.json`](examples/playlist-to-transcripts.json) lists a playlist
in order and fetches every transcript, continuing past videos that have no captions (those are
never charged). Useful for turning a course or lecture series into notes or a knowledge base.

More recipes: [YouTube transcripts in n8n](https://bulktranscripts.co/integrations/n8n-youtube-transcripts)
and the [workflow library](https://bulktranscripts.co/workflows).

## Resources

- [BulkTranscripts API docs](https://bulktranscripts.co/docs) and [OpenAPI spec](https://bulktranscripts.co/openapi.json)
- [BulkTranscripts MCP server](https://bulktranscripts.co/youtube-mcp-server) for Claude, ChatGPT and Cursor
- [Agent skill](https://github.com/pratie/youtube-transcript-skill) for Claude Code, Codex and OpenClaw
- [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)

## Compatibility

Built against n8n Nodes API version 1 and tested with current n8n releases. The node has no
runtime dependencies.

## License

[MIT](LICENSE.md)
