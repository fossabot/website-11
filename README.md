# website
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FATLauncher%2Fwebsite.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2FATLauncher%2Fwebsite?ref=badge_shield)


Repository for atlauncher.com website

## Overview

This project aims to contain all the code necessary for the frontend websites for ATLauncher.

## Setup

To get setup, first you need to run `npm install` to install all the dependencies.

### Create ssl certificate

You must first generate a ssl certificate using ACM for `{domain}` and `www.{domain}` in the us-east-1
region.

Once done, verified and created, you can take the ARN for it and either put it in a file called
`secrets.yml` with the below format:

```yml
acnArm:
    dev: arnHere
    prod: arnHere
```

Or alternatively specify 2 environment variables called `ACM_ARN_DEV` and `ACM_ARN_PROD`.

### Add the domain to Route53

This setup assumes hosting the domain through Route53 DNS.

The domain should be created and the DNS name servers updated on the domain.

## Build

To build the static assets, simply run `npm run build`.

## Deploy

To deploy, simple run `npm run deploy:dev` to deploy to the dev stage and `npm run dev:prod` to
deploy to the production stage.


## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FATLauncher%2Fwebsite.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2FATLauncher%2Fwebsite?ref=badge_large)