import type {
	IAuthenticateGeneric,
	Icon,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class BulkTranscriptsApi implements ICredentialType {
	name = 'bulkTranscriptsApi';

	displayName = 'BulkTranscripts API';

	icon: Icon = {
		light: 'file:../icons/bulktranscripts.svg',
		dark: 'file:../icons/bulktranscripts.dark.svg',
	};

	documentationUrl = 'https://bulktranscripts.co/docs';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description:
				'Create a free key (30 credits, no card) at bulktranscripts.co/app?tab=mcp. Keys start with bt_ak_. A license key from a credit pack works too.',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials?.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://bulktranscripts.co',
			url: '/api/v1/account',
			method: 'GET',
		},
	};
}
