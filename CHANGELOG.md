# Changelog

## 0.1.4 (2026-10-14)

- Return All on the four list operations (Channel → List Videos, Channel → Search, Playlist → List Videos, Search → Search YouTube), as asked in n8n's manual review. With Return All on, Limit hides and the node pages through the API on `next_start` (1,000 per page for channels and playlists, 50 for searches). Off by default, so existing workflows behave exactly as before.
- Descriptions say each page costs 1 credit.

## 0.1.3

- Codex categories use the supported community-node values: "Marketing & Content" and
  "Data & Storage" (dropped "Marketing" and "AI"), per n8n verification review.

## 0.1.2

- New icon: the current BulkTranscripts brand mark (red transcript page with a play button),
  replacing the old BT speech-bubble mark.

## 0.1.1

- First release published from GitHub Actions with npm provenance.
- Add a playlist-to-transcripts example workflow.

## 0.1.0

- Initial release: Transcript (Get), Channel (Get Latest Uploads, List Videos, Search),
  Playlist (List Videos), Search (Search YouTube), Account (Get Balance).
