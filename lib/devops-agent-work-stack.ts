import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecs_patterns from 'aws-cdk-lib/aws-ecs-patterns';
import { Construct } from 'constructs';
import path from 'path';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class DevopsAgentWorkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    
    const vpc = new ec2.Vpc(this, 'DevOpsTestVpc', {
      maxAzs: 2,
      natGateways: 1,
    });

    const cluster = new ecs.Cluster(this, 'DevOpsTestCluster', {
      vpc: vpc,
      containerInsightsV2: ecs.ContainerInsights.ENABLED,
    });

    const fargateService = new ecs_patterns.ApplicationLoadBalancedFargateService(this, 'DevOpsTestService', {
      cluster: cluster,
      cpu: 256,
      desiredCount: 1,
      publicLoadBalancer: true,
      taskImageOptions: {
        image: ecs.ContainerImage.fromAsset(path.join(__dirname, '../app')),
        containerPort: 80,
        environment: {
          'NEW_RELIC_APP_NAME': 'DevOpsAgent-Test-App',
          'NEW_RELIC_LICENSE_KEY': process.env.NEW_RELIC_LICENSE_KEY || '',
          'NEW_RELIC_NO_CONFIG_FILE': 'true',
          'NEW_RELIC_DISTRIBUTED_TRACING_ENABLED': 'true',
          'NEW_RELIC_LOG': 'stdout'
        },
      },
    });

    fargateService.targetGroup.configureHealthCheck({
      path: '/',
      healthyThresholdCount: 2,
      unhealthyThresholdCount: 2,
      timeout: cdk.Duration.seconds(5),
      interval: cdk.Duration.seconds(10),
    });

    new cdk.CfnOutput(this, 'LoadBalancerDNS', {
      value: fargateService.loadBalancer.loadBalancerDnsName,
      description: 'Access this URL to test the application',
    });
  }
}

