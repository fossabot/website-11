workflow "Deploy on push" {
  on = "push"
  resolves = [
    "Deploy to dev",
  ]
}

action "Install dependencies" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  args = "install"
}

action "Build" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  needs = ["Install dependencies"]
  args = "run build"
}

action "Test" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  needs = ["Install dependencies"]
  args = "run test:ci"
}

action "Deploy to dev" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  needs = ["Build", "Test"]
  args = "run deploy:dev -- --conceal"
  secrets = ["AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY", "ACM_ARN_DEV", "ACM_ARN_PROD"]
}
