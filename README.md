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

### NRQL query

NRQL query requires three fields/aliases to be returned: *EventTimeStamp, EventStatus, EventName*.

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

## Open Source License

This project is distributed under the [Apache 2 license](LICENSE).

## Dependencies

Requires no specific data or additional features.

## Getting started

First, ensure that you have [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) and [NPM](https://www.npmjs.com/get-npm) installed. If you're unsure whether you have one or both of them installed, run the following command(s) (If you have them installed these commands will return a version number, if not, the commands won't be recognized):

```bash
git --version
npm -v
```

Next, clone this repository and run the following scripts:

```bash
nr1 nerdpack:clone -r https://github.com/newrelic/nr1-status-pages.git
cd nr1-status-pages
nr1 nerdpack:uuid -gf
npm install
npm start
```

Visit [https://one.newrelic.com/?nerdpacks=local](https://one.newrelic.com/?nerdpacks=local), navigate to the Nerdpack, and :sparkles:

## Deploying this Nerdpack

Open a command prompt in the nerdpack's directory and run the following commands.

```bash
# To create a new uuid for the nerdpack so that you can deploy it to your account:
# nr1 nerdpack:uuid -g [--profile=your_profile_name]

# To see a list of APIkeys / profiles available in your development environment:
# nr1 profiles:list

nr1 nerdpack:publish [--profile=your_profile_name]
nr1 nerdpack:deploy [-c [DEV|BETA|STABLE]] [--profile=your_profile_name]
nr1 nerdpack:subscribe [-c [DEV|BETA|STABLE]] [--profile=your_profile_name]
```

Visit [https://one.newrelic.com](https://one.newrelic.com), navigate to the Nerdpack, and :sparkles:

## Community Support

New Relic hosts and moderates an online forum where you can interact with New Relic employees as well as other customers to get help and share best practices. Like all New Relic open source community projects, there's a related topic in the New Relic Explorers Hub. You can find this project's topic/threads here:

[https://discuss.newrelic.com/t/statuspage-io-nerdpack/83284](https://discuss.newrelic.com/t/statuspage-io-nerdpack/83284)

Please do not report issues with Status Page to New Relic Global Technical Support. Instead, visit the [`Explorers Hub`](https://discuss.newrelic.com/c/build-on-new-relic) for troubleshooting and best-practices.

## Issues / Enhancement Requests

Issues and enhancement requests can be submitted in the [Issues tab of this repository](../../issues). Please search for and review the existing open issues before submitting a new issue.

## Security
As noted in our [security policy](https://github.com/newrelic/nr1-status-pages/security/policy), New Relic is committed to the privacy and security of our customers and their data. We believe that providing coordinated disclosure by security researchers and engaging with the security community are important means to achieve our security goals.

If you believe you have found a security vulnerability in this project or any of New Relic's products or websites, we welcome and greatly appreciate you reporting it to New Relic through [HackerOne](https://hackerone.com/newrelic).

## Contributing

Contributions are welcome (and if you submit a Enhancement Request, expect to be invited to contribute it yourself :grin:). Please review our [Contributors Guide](CONTRIBUTING.md).

Keep in mind that when you submit your pull request, you'll need to sign the CLA via the click-through using CLA-Assistant. If you'd like to execute our corporate CLA, or if you have any questions, please drop us an email at opensource@newrelic.com.
