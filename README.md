# Pause Vercel Projects

This small repo implements a webhook handler that pauses all your vercel projects.

## Why

Vercel **will** bill you for any metered usage traffic that hits your deployments during DDoS attack and Vercel does not offer and automatic spend cap. This means that your costs can potentially sky rocket similar to [this](https://news.ycombinator.com/item?id=39520776) story. See also:

https://vercel.com/docs/accounts/spend-management

## How

This repo can be deployed directly to vercel, just fork and then add from the Vercel dashboard. Deploy into your personal account and then setup your team's [spend management webhook](https://vercel.com/docs/accounts/spend-management#configuring-a-webhook) to call the `<your-deployment-url>/api/pause` endpoint. You will need to configure the following environment variables:

- `INTEGRATION_SECRET` The signature key vercel shows you when you save the webhook.
- `VERCEL_TEAM_ID` Your team id found under Team > Settings > General > Team Id.
- `VERCEL_TOKEN` Token for authenticating to the vercel REST API found under Settings > Tokens > Create a new token.

## Testing

You can the deployed webhook with the included test script:

```
yarn test pause --url https://your_deployment_name.vercel.app
```

## Acknowledgements

Code copied and adapted from https://gist.github.com/borispoehland/2738d2edd62e83f332260a80eb5a9335
