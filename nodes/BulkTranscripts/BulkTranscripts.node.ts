import {
	NodeConnectionTypes,
	type INodeProperties,
	type INodeType,
	type INodeTypeDescription,
} from 'n8n-workflow';

const splitIntoItems = (resource: string, operation: string[]): INodeProperties => ({
	displayName: 'Split Into Items',
	name: 'splitIntoItems',
	type: 'boolean',
	default: true,
	description:
		'Whether to output one item per result (best for looping). Turn off to get the raw response with counts and billing info.',
	displayOptions: { show: { resource: [resource], operation } },
	routing: {
		output: {
			postReceive: [
				{
					type: 'rootProperty',
					enabled: '={{$value}}',
					properties: { property: 'results' },
				},
			],
		},
	},
});

const channelField = (operation: string[]): INodeProperties => ({
	displayName: 'Channel',
	name: 'channel',
	type: 'string',
	default: '',
	required: true,
	placeholder: '@veritasium',
	description: 'An @handle, a channel URL, or a UC… channel ID',
	displayOptions: { show: { resource: ['channel'], operation } },
	routing: { send: { type: 'query', property: 'channel' } },
});

export class BulkTranscripts implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'BulkTranscripts',
		name: 'bulkTranscripts',
		icon: {
			light: 'file:../../icons/bulktranscripts.svg',
			dark: 'file:../../icons/bulktranscripts.dark.svg',
		},
		group: ['input'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description:
			'Get YouTube transcripts, list channel and playlist videos, search YouTube, and track new uploads',
		defaults: {
			name: 'BulkTranscripts',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'bulkTranscriptsApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: 'https://bulktranscripts.co/api/v1',
			headers: {
				Accept: 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Account', value: 'account' },
					{ name: 'Channel', value: 'channel' },
					{ name: 'Playlist', value: 'playlist' },
					{ name: 'Search', value: 'search' },
					{ name: 'Transcript', value: 'transcript' },
				],
				default: 'transcript',
			},

			// ---------------------------------------------------------------- Transcript
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['transcript'] } },
				options: [
					{
						name: 'Get',
						value: 'get',
						action: 'Get a video transcript',
						description:
							'Get the transcript of a YouTube video, Short or TikTok video. Costs 1 credit the first time; repeat reads are free.',
						routing: { request: { method: 'GET', url: '/transcript' } },
					},
				],
				default: 'get',
			},
			{
				displayName: 'Video',
				name: 'video',
				type: 'string',
				default: '',
				required: true,
				placeholder: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
				description: 'A YouTube URL, an 11-character video ID, or a TikTok video URL',
				displayOptions: { show: { resource: ['transcript'], operation: ['get'] } },
				routing: { send: { type: 'query', property: 'video' } },
			},
			{
				displayName: 'Include Timestamped Segments',
				name: 'includeSegments',
				type: 'boolean',
				default: false,
				description:
					'Whether to include the timestamped segments array. Leave off for summarization: the response is much smaller and still has the full text and paragraphs.',
				displayOptions: { show: { resource: ['transcript'], operation: ['get'] } },
				routing: { send: { type: 'query', property: 'segments', value: '={{$value ? "1" : "0"}}' } },
			},
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add option',
				default: {},
				displayOptions: { show: { resource: ['transcript'], operation: ['get'] } },
				options: [
					{
						displayName: 'Force Fresh Extraction',
						name: 'fresh',
						type: 'boolean',
						default: false,
						description: 'Whether to bypass the cache. Always costs a credit.',
						routing: { send: { type: 'query', property: 'fresh', value: '={{$value ? "1" : undefined}}' } },
					},
					{
						displayName: 'Language',
						name: 'language',
						type: 'string',
						default: 'en',
						description:
							'Preferred caption language codes, comma-separated. Falls back to whatever the video has.',
						routing: { send: { type: 'query', property: 'language' } },
					},
				],
			},

			// ---------------------------------------------------------------- Channel
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['channel'] } },
				options: [
					{
						name: 'Get Latest Uploads',
						value: 'getLatest',
						action: 'Get the latest uploads of a channel',
						description:
							'Get up to 15 recent uploads. Always free, so it is safe to poll on a schedule.',
						routing: { request: { method: 'GET', url: '/channel/latest' } },
					},
					{
						name: 'List Videos',
						value: 'listVideos',
						action: 'List the videos of a channel',
						description: 'List up to 1,000 videos of a channel. Costs 1 credit.',
						routing: { request: { method: 'GET', url: '/channel/videos' } },
					},
					{
						name: 'Search',
						value: 'search',
						action: 'Search inside a channel',
						description: 'Find videos about a topic within one channel. Costs 1 credit.',
						routing: { request: { method: 'GET', url: '/channel/search' } },
					},
				],
				default: 'getLatest',
			},
			channelField(['getLatest', 'listVideos', 'search']),
			{
				displayName: 'Query',
				name: 'query',
				type: 'string',
				default: '',
				required: true,
				description: 'The topic to search for within the channel',
				displayOptions: { show: { resource: ['channel'], operation: ['search'] } },
				routing: { send: { type: 'query', property: 'q' } },
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				typeOptions: { minValue: 1, maxValue: 1000 },
				default: 50,
				description: 'Max number of results to return',
				displayOptions: { show: { resource: ['channel'], operation: ['listVideos'] } },
				routing: { send: { type: 'query', property: 'limit' } },
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				typeOptions: { minValue: 1, maxValue: 50 },
				default: 50,
				description: 'Max number of results to return',
				displayOptions: { show: { resource: ['channel'], operation: ['search'] } },
				routing: { send: { type: 'query', property: 'limit' } },
			},
			splitIntoItems('channel', ['getLatest', 'listVideos', 'search']),

			// ---------------------------------------------------------------- Playlist
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['playlist'] } },
				options: [
					{
						name: 'List Videos',
						value: 'listVideos',
						action: 'List the videos of a playlist',
						description: 'List a playlist in order, up to 1,000 videos. Costs 1 credit.',
						routing: { request: { method: 'GET', url: '/playlist/videos' } },
					},
				],
				default: 'listVideos',
			},
			{
				displayName: 'Playlist',
				name: 'playlist',
				type: 'string',
				default: '',
				required: true,
				placeholder: 'https://www.youtube.com/playlist?list=PL…',
				description: 'A playlist URL or ID. Private playlists must be set to Unlisted or Public.',
				displayOptions: { show: { resource: ['playlist'], operation: ['listVideos'] } },
				routing: { send: { type: 'query', property: 'playlist' } },
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				typeOptions: { minValue: 1, maxValue: 1000 },
				default: 50,
				description: 'Max number of results to return',
				displayOptions: { show: { resource: ['playlist'], operation: ['listVideos'] } },
				routing: { send: { type: 'query', property: 'limit' } },
			},
			splitIntoItems('playlist', ['listVideos']),

			// ---------------------------------------------------------------- Search
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['search'] } },
				options: [
					{
						name: 'Search YouTube',
						value: 'searchYoutube',
						action: 'Search for videos channels or playlists',
						description: 'Search YouTube for videos, channels or playlists. Costs 1 credit.',
						routing: { request: { method: 'GET', url: '/search' } },
					},
				],
				default: 'searchYoutube',
			},
			{
				displayName: 'Query',
				name: 'query',
				type: 'string',
				default: '',
				required: true,
				description: 'What to search YouTube for',
				displayOptions: { show: { resource: ['search'], operation: ['searchYoutube'] } },
				routing: { send: { type: 'query', property: 'q' } },
			},
			{
				displayName: 'Result Type',
				name: 'type',
				type: 'options',
				options: [
					{ name: 'Channel', value: 'channel' },
					{ name: 'Playlist', value: 'playlist' },
					{ name: 'Video', value: 'video' },
				],
				default: 'video',
				displayOptions: { show: { resource: ['search'], operation: ['searchYoutube'] } },
				routing: { send: { type: 'query', property: 'type' } },
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				typeOptions: { minValue: 1, maxValue: 50 },
				default: 50,
				description: 'Max number of results to return',
				displayOptions: { show: { resource: ['search'], operation: ['searchYoutube'] } },
				routing: { send: { type: 'query', property: 'limit' } },
			},
			splitIntoItems('search', ['searchYoutube']),

			// ---------------------------------------------------------------- Account
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['account'] } },
				options: [
					{
						name: 'Get Balance',
						value: 'getBalance',
						action: 'Get the credit balance',
						description: 'Get the remaining credits for this API key. Always free.',
						routing: { request: { method: 'GET', url: '/account' } },
					},
				],
				default: 'getBalance',
			},
		],
	};
}
