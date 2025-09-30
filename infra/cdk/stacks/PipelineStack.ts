import { Stack, StackProps, Stage, StageProps } from 'aws-cdk-lib';
import { BuildSpec } from 'aws-cdk-lib/aws-codebuild';
import { CfnConnection } from 'aws-cdk-lib/aws-codeconnections';
import { PipelineType } from 'aws-cdk-lib/aws-codepipeline';
import * as pipelines from 'aws-cdk-lib/pipelines';
import { Construct } from 'constructs';
import { StaticSiteStack } from './StaticSiteStack';

class AppStage extends Stage {
  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);
    // デプロイ対象: 静的サイト
    new StaticSiteStack(this, 'StaticSite');
  }
}

export class PipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const gitHubConnection = new CfnConnection(this, 'GitHubConnection', {
      connectionName: `GitHubConnection-${this.stackName}`,
      providerType: 'GitHub',
    });

    const pipeline = new pipelines.CodePipeline(this, 'Pipeline', {
      pipelineName: 'SimpleTodoPipeline',
      pipelineType: PipelineType.V2,
      selfMutation: true,
      synth: new pipelines.ShellStep('Synth', {
        input: pipelines.CodePipelineSource.connection('s4k4x4r0/simple-todo-list', 'main', {
          connectionArn: gitHubConnection.ref,
        }),
        commands: [
          'npm ci',
          'npx playwright install --with-deps',
          'npm run format:check',
          'npm run lint',
          'npm run typecheck',
          'npm run build',
          'npm run test:e2e',
          'npx cdk synth',
        ],
      }),
      codeBuildDefaults: {
        partialBuildSpec: BuildSpec.fromObject({
          phases: {
            install: {
              'runtime-versions': {
                nodejs: '22',
              },
            },
          },
        }),
      },
    });

    pipeline.addStage(new AppStage(this, 'Prod'));
  }
}
