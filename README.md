[![New Relic One Catalog Project header](https://github.com/newrelic/opensource-website/raw/master/src/images/categories/New_Relic_One_Catalog_Project.png)](https://opensource.newrelic.com/oss-category/#new-relic-one-catalog-project)

# Status Page

![CI](https://github.com/newrelic/nr1-status-pages/workflows/CI/badge.svg) ![GitHub release (latest SemVer including pre-releases)](https://img.shields.io/github/v/release/newrelic/nr1-status-pages?include_prereleases&sort=semver) [![Snyk](https://snyk.io/test/github/newrelic/nr1-status-pages/badge.svg)](https://snyk.io/test/github/newrelic/nr1-status-pages)

## Usage

Status Page is a [Statuspage.io](https://www.statuspage.io)-inspired application that allows you to easily configure the most important key dependencies to your business in one color-coded view.

![Screenshot #1](/catalog/screenshots/nr1-status-pages-1.png)

Status Page also displays an event stream of active/previous incidents and outages, along with updates for easy follow-along. The following table lists details for each provider or popular status page.

| Provider | Description | Incidents Fetched | URL(s)/Mechanism Polled | Examples |
|---|---|---|---|---|
| Statuspage.io | Atlassian Statuspage-hosted pages | Active/Past | `{host}/api/v2/summary.json`, `{host}/api/v2/incidents.json` | githubstatus.com, status.digitalocean.com |
| Google | GCP-style status dashboard | Active/Past | `{host}/incidents.json` | status.cloud.google.com |
| Status.io | status.io-hosted pages | Active only | `{host}/1.0/status/{id}` | ezidebit.status.io/pages/history/598a973f... |
| Statuspal.io | Statuspal-hosted pages | Active/Past | `{proxy}/status_pages/{subdomain}/status`, `/incidents` | galaxygate, smtp |
| NRQL query | User-defined NRQL against own account | Depends on query | NerdGraph NRQL query (user-supplied) | `FROM NrAiIncident SELECT timestamp as EventTimeStamp, priority as EventStatus, conditionName as EventName, entity.name LIMIT 50` |
| Workload | NR Workload entity status | Active/Past (2-wk history) | NRQL on `WorkloadStatus`, `SINCE 2 WEEKS AGO` | — |
| RSS feed | User-provided RSS/Atom feed | Past only | Direct fetch of user RSS URL via proxy, parsed w/ `DOMParser` | user-supplied |
| Apple | Apple Developer System Status (built-in) | Active only | Hostname JSONP feed (`apple.com/support/systemstatus/data/*`), via proxy | apple.com/.../developer/system_status_en_US.js |
| AWS Health | AWS Service Health Dashboard (built-in) | Active only | `{host}/public/currentevents`, via proxy | health.aws.amazon.com |
| Azure | Azure status feed (built-in) | Active only | Hostname RSS/Atom feed, via proxy | azure.status.microsoft/en-us/status/feed/ |
| Okta | Okta status RSS (built-in) | Active only | Hostname RSS feed, via proxy | feeds.feedburner.com/OktaStatusRSS |
| Oracle Cloud Infra. | OCI status page (built-in) | Active/Past | `{host}/api/v2/status.json` + `/api/v2/incident-summary.rss`, direct (no proxy) | ocistatus.oraclecloud.com |

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

### Status Pal

Status Pal requires the sub domain of the status page (not the full status URL).

- [galaxygate](https://status.galaxygate.net/) --> From https://status.galaxygate.net/
- [smtp](https://smtp.statuspal.io) --> From https://smtp.statuspal.io


### Workload

Workloads require the entity guid of the workload (i.e: `MTYwNjg2MnxOUjF8V09SS0xPQUR8M3fimMTM4`).

### CORS configuration

Some status-page providers do not send permissive CORS headers, so the nerdpack routes those requests through a small Cloudflare Worker operated by the maintainers.

The "Host requires CORS proxy" checkbox in the Add Service modal defaults to that Worker. Advanced users can substitute their own proxy — the address must contain a `{url}` placeholder that will be replaced with the target hostname.

Example (default): `https://nr1-status-page-proxy.kpeet.workers.dev/{url}`

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


