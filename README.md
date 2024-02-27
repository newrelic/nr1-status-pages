[![New Relic One Catalog Project header](https://github.com/newrelic/opensource-website/raw/master/src/images/categories/New_Relic_One_Catalog_Project.png)](https://opensource.newrelic.com/oss-category/#new-relic-one-catalog-project)

# Status Page

![CI](https://github.com/newrelic/nr1-status-pages/workflows/CI/badge.svg) ![GitHub release (latest SemVer including pre-releases)](https://img.shields.io/github/v/release/newrelic/nr1-status-pages?include_prereleases&sort=semver) [![Snyk](https://snyk.io/test/github/newrelic/nr1-status-pages/badge.svg)](https://snyk.io/test/github/newrelic/nr1-status-pages)

## Usage

Status Page is a [Statuspage.io](https://www.statuspage.io)-inspired application that allows you to easily configure the most important key dependencies to your business in one color-coded view.

Status Page also displays an event stream of previous incidents and outages, along with updates for easy follow-along.

Choose an existing supported service like Jira, or add a new service.

![Screenshot #1](/catalog/screenshots/nr1-status-pages-1.png)

### [Statuspage.io](https://www.statuspage.io)

Example hostnames:

- [https://www.githubstatus.com/](https://www.githubstatus.com/)
- [https://jira-software.status.atlassian.com/](https://jira-software.status.atlassian.com/)
- [https://status.digitalocean.com/](https://status.digitalocean.com/)
- [https://status.hashicorp.com/](https://status.hashicorp.com/)

### [Google style](https://www.google.com)

Example hostnames:

- [https://status.cloud.google.com](https://status.cloud.google.com)

### [Status.io](https://status.io/)

Url Format:
`{baseUrl}/pages/history/{`[numeric statuspage_id](https://statusio.docs.apiary.io/#reference/incidents/list-incidents-by-id)`}`

Example hostnames:

- [https://ezidebit.status.io/pages/history/598a973f96a8201305000142](https://ezidebit.status.io/pages/history/598a973f96a8201305000142)
- [https://status.docker.com/pages/history/533c6539221ae15e3f000031](https://status.docker.com/pages/history/533c6539221ae15e3f000031)

### [Statuspal.io](https://statuspal.io)

Example subdomains:

- [galaxygate](https://status.galaxygate.net/) --> From https://status.galaxygate.net/
- [smtp](https://smtp.statuspal.io) --> From https://smtp.statuspal.io

### NRQL query

NRQL query requires three fields/aliases to be returned: _EventTimeStamp, EventStatus, EventName_.

Example NRQL query:

```sql
FROM AlertViolationsSample SELECT timestamp as EventTimeStamp, priority as EventStatus, condition_name as EventName, entity.name LIMIT 50
```

or

```sql
SELECT timestamp as EventTimeStamp, priority as EventStatus, condition_name as EventName, entity.name FROM AlertViolationsSample LIMIT 50
```

### RSS feed

It is possible to choose RSS feed as a provider for status pages.

### CORS configuration

It is possible to configure CORS proxy when creating new service. CORS proxy address must contain `{url}` placeholder that will be replaced with provided hostname.

Example: `https://cors-anywhere.herokuapp.com/{url}`

## Dependencies

Requires no specific data or additional features.

## Enabling this App

This App is available via the New Relic Catalog. 

To enable it in your account: 
1. go to `Add Data > Apps and Visualzations` and search for "Status Pages"
2. Click the `Status Pages` card, and then click the `Add this App` button to add it to your account(s)
3. Click `Open App` to launch the app (note: on the first time accessing the app, you may be prompted to enable it)

Once you have added your accounts, you can also open the app by:
1. Open the `Apps` left-hand navigation menu item (you may need to click on the `Add More` ellipsis if it doesn't show up by default)
2. In the `Your Apps` section, locate and click on the `Status Pages` card to open the app 

#### Manual Deployment
If you need to customize the app, fork the codebase and follow the instructions on how to [Customize a Nerdpack](https://developer.newrelic.com/build-apps/customize-nerdpack). If you have a change you feel everyone can benefit from, please submit a PR!

## Support

<a href="https://github.com/newrelic?q=nrlabs-viz&amp;type=all&amp;language=&amp;sort="><img src="https://user-images.githubusercontent.com/1786630/214122263-7a5795f6-f4e3-4aa0-b3f5-2f27aff16098.png" height=50 /></a>

This project is actively maintained by the New Relic Labs team. Connect with us directly by [creating issues](../../issues) or [asking questions in the discussions section](../../discussions) of this repo.

We also encourage you to bring your experiences and questions to the [Explorers Hub](https://discuss.newrelic.com) where our community members collaborate on solutions and new ideas.

New Relic has open-sourced this project, which is provided AS-IS WITHOUT WARRANTY OR DEDICATED SUPPORT.

## Security

As noted in our [security policy](https://github.com/newrelic/nr1-status-pages/security/policy), New Relic is committed to the privacy and security of our customers and their data. We believe that providing coordinated disclosure by security researchers and engaging with the security community are important means to achieve our security goals.

If you believe you have found a security vulnerability in this project or any of New Relic's products or websites, we welcome and greatly appreciate you reporting it to New Relic through [HackerOne](https://hackerone.com/newrelic).

## Contributing

Contributions are welcome (and if you submit a Enhancement Request, expect to be invited to contribute it yourself :grin:). Please review our [Contributors Guide](CONTRIBUTING.md).

Keep in mind that when you submit your pull request, you'll need to sign the CLA via the click-through using CLA-Assistant. If you'd like to execute our corporate CLA, or if you have any questions, please drop us an email at opensource@newrelic.com.

## Open Source License

This project is distributed under the [Apache 2 license](LICENSE).


