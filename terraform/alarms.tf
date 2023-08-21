resource "aws_cloudwatch_metric_alarm" "cpu" {
  alarm_name          = "${terraform.workspace}-${local.env.service_name}-cpu-high"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 5 #consecutive failures before reporting
  metric_name         = "CPUUtilization"
  namespace           = "AWS/ECS"
  period              = 300 #seconds per period
  datapoints_to_alarm = 5

  statistic = "Average"
  threshold = 80

  alarm_description = "${terraform.workspace} ${local.env.service_name} CPU utilization over 80% for the last 25 minutes"
  alarm_actions     = [local.sns_alarms.red]
  ok_actions        = [local.sns_alarms.green]

  dimensions = {
    ClusterName = data.aws_ecs_cluster.selected.cluster_name
    ServiceName = module.webmap.service.name
  }
}

resource "aws_cloudwatch_metric_alarm" "memory" {
  alarm_name          = "${terraform.workspace}-${local.env.service_name}-memory-high"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 5
  metric_name         = "MemoryUtilization"
  namespace           = "AWS/ECS"
  period              = 300 #seconds per period
  datapoints_to_alarm = 5

  statistic = "Average"
  threshold = 80 #% cpu usage limit for failing

  alarm_description = "${terraform.workspace} ${local.env.service_name} Memory utilization over 80% for the last 25 minutes"
  alarm_actions     = [local.sns_alarms.red]
  ok_actions        = [local.sns_alarms.green]

  dimensions = {
    ClusterName = data.aws_ecs_cluster.selected.cluster_name
    ServiceName = module.webmap.service.name
  }
}

resource "aws_cloudwatch_metric_alarm" "thrash" {
  alarm_name        = "${terraform.workspace}-${local.env.service_name}-thrashing"
  alarm_description = <<EOF
The ECS service ${terraform.workspace}-${local.env.service_name} container(s) appear to be thrashing.

Possible issues:
- The service healthcheck is failing
- The service is crashing before reaching a steady state

What to check:
- Container Service Event Log
- CloudWatch Logs for indicators like memory or connectivity issues

Remediation:
- Manually roll the service back to a prior image using Terraform
EOF

  alarm_actions = [local.sns_alarms.red]
  ok_actions    = []

  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = 3
  threshold           = 1

  metric_query {
    id          = "thrash"
    expression  = "IF(CEIL(dt) - FLOOR(rt), 1, 0) AND CEIL(dc) > 1"
    label       = "Thrashing"
    return_data = true
  }

  metric_query {
    id = "dt"
    metric {
      metric_name = "DesiredTaskCount"
      namespace   = "ECS/ContainerInsights"
      period      = 300
      stat        = "Maximum"
      dimensions = {
        ClusterName = data.aws_ecs_cluster.selected.cluster_name
        ServiceName = module.webmap.service.name
      }
    }
  }

  metric_query {
    id = "rt"
    metric {
      metric_name = "RunningTaskCount"
      namespace   = "ECS/ContainerInsights"
      period      = 300
      stat        = "Minimum"
      dimensions = {
        ClusterName = data.aws_ecs_cluster.selected.cluster_name
        ServiceName = module.webmap.service.name
      }
    }
  }

  metric_query {
    id = "dc"
    metric {
      metric_name = "DeploymentCount"
      namespace   = "ECS/ContainerInsights"
      period      = 300
      stat        = "Minimum"
      dimensions = {
        ClusterName = data.aws_ecs_cluster.selected.cluster_name
        ServiceName = module.webmap.service.name
      }
    }
  }
}
