# nr1-status-pages-nerdpack

![GitHub release (latest SemVer including pre-releases)](https://img.shields.io/github/v/release/newrelic/nr1-status-pages?include_prereleases&sort=semver) ![AppVeyor](https://img.shields.io/appveyor/ci/newrelic/nr1-status-pages) [![Snyk](https://snyk.io/test/github/newrelic/nr1-status-pages/badge.svg)](https://snyk.io/test/github/newrelic/nr1-status-pages)

## Usage

nr1-status-pages collects multiple [Statuspage.io](https://www.statuspage.io) in one dashboard, so you can check the status of your key dependencies in one place.

![Screenshot #1](screenshots/dashboard-view.png)

## Open Source License

This project is distributed under the [Apache 2 license](LICENSE).

## What do you need to make this work?

Nothing is required to get up and running but it is helpful if you have some status pages you'd like to monitor like:

- [NewRelic](https://status.newrelic.com/)
- [BitBucket](https://bitbucket.status.atlassian.com/)
- [GeneSys PureCloud](https://status.mypurecloud.com/)
- [Google Cloud Platform](https://status.cloud.google.com/)
- [Litmus](https://status.litmus.com/)
- [Invision](https://status.invisionapp.com/)


## Getting started

Clone this repository and run the following scripts:

```bash
git clone https://github.com/newrelic/nr1-status-pages.git
cd nr1-status-pages
nr1 nerdpack:uuid -gf
npm install
npm start
```

Visit [https://one.newrelic.com/?nerdpacks=local](https://one.newrelic.com/?nerdpacks=local), navigate to the Nerdpack, and :sparkles:

## Deploying this Nerdpack

Open a command prompt in the nerdpack's directory and run the following commands.

```bash
# this is to create a new uuid for the nerdpack so that you can deploy it to your account
nr1 nerdpack:uuid -g [--profile=your_profile_name]
# to see a list of APIkeys / profiles available in your development environment, run nr1 credentials:list
nr1 nerdpack:publish [--profile=your_profile_name]
nr1 nerdpack:deploy [-c [DEV|BETA|STABLE]] [--profile=your_profile_name]
nr1 nerdpack:subscribe [-c [DEV|BETA|STABLE]] [--profile=your_profile_name]
```

Visit [https://one.newrelic.com](https://one.newrelic.com), navigate to the Nerdpack, and :sparkles:

## Support

New Relic has open-sourced this project. This project is provided AS-IS WITHOUT WARRANTY OR SUPPORT, although you can report issues and contribute to the project here on GitHub.

_Please do not report issues with this software to New Relic Global Technical Support._

### Community

New Relic hosts and moderates an online forum where customers can interact with New Relic employees as well as other customers to get help and share best practices. Like all official New Relic open source projects, there's a related Community topic in the New Relic Explorers Hub. You can find this project's topic/threads here:

https://discuss.newrelic.com/t/statuspage-io-nerdpack/83284
*(Note: URL subject to change before GA)*

### Issues / Enhancement Requests

Issues and enhancement requests can be submitted in the [Issues tab of this repository](../../issues). Please search for and review the existing open issues before submitting a new issue.

## Contributing

Contributions are welcome (and if you submit a Enhancement Request, expect to be invited to contribute it yourself :grin:). Please review our [Contributors Guide](CONTRIBUTING.md).

Keep in mind that when you submit your pull request, you'll need to sign the CLA via the click-through using CLA-Assistant. If you'd like to execute our corporate CLA, or if you have any questions, please drop us an email at opensource@newrelic.com.
