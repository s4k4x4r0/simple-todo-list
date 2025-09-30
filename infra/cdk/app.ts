import { App } from 'aws-cdk-lib';
import { PipelineStack } from './stacks/PipelineStack';

const app = new App();

new PipelineStack(app, 'PipelineStack');
