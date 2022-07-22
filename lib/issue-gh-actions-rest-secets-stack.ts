import { Duration, Stack, StackProps, CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as iam from 'aws-cdk-lib/aws-iam'

export class IssueGhActionsRestSecetsStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);


    const provider = new iam.OpenIdConnectProvider(this, 'MyProvider', {
      url: 'https://token.actions.githubusercontent.com',
      clientIds: ['sts.amazonaws.com']
    });

    // Change this when running in your own repo
    const githubOrganization = "awkward-minion"
    const githubRepo = "issue-gh-actions-rest-secrets"

    const GitHubPrincipal = new iam.OpenIdConnectPrincipal(provider).withConditions({
      StringLike: {
        'token.actions.githubusercontent.com:sub': `repo:${githubOrganization}/${githubRepo}:*`,
      }
    })


    const githubRole = new iam.Role(this, 'GithubIssueReproRole', {
      assumedBy: GitHubPrincipal,
      description: 'Role to reproduce issue with rest api',
      roleName: 'github-issue-test-role',
      maxSessionDuration: Duration.minutes(60),
      inlinePolicies: {
        CdkDeploymentPolicy: new iam.PolicyDocument({
          assignSids: true,
          statements: [
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: ['sts:AssumeRole'],
              resources: [`arn:aws:iam::${this.account}:role/cdk-*`]
            })
          ]
        })
      }
    })

    new CfnOutput(this, "assume_role", {
      value:
        githubRole.roleArn,
    });

  }
}
