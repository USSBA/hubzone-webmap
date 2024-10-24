variable "image_tag" {
  type = string
}

locals {
  container_environment = {
    AWS_ENVIRONMENT = terraform.workspace

    # These services live behind CloudFront, so the base domain will be identical upon deployment
    # Conditionally they can be configured to refer directly to the back-end service.  This is useful
    # when migrating cloudfront or testing new services without impacting the existing cloudfront
    HUBZONE_MAP_HOST     = local.env.backend_location == "cloudfront" ? "https://${local.public_fqdn}" : "https://${local.env.service_name}.${local.env.fqdn_base}"
    HUBZONE_REPORT_HOST  = local.env.backend_location == "cloudfront" ? "https://${local.public_fqdn}" : "https://hubzone-report.${local.env.fqdn_base}"
    HUBZONE_WMS_URL_ROOT = local.env.backend_location == "cloudfront" ? "https://${local.public_fqdn}/geoserver/gwc/service/wms?" : "https://hubzone-geoserver.${local.env.fqdn_base}/geoserver/gwc/service/wms?"

    # Users do not connect directly to hubzone-api; use the API url directly
    HUBZONE_API_HOST = "https://hubzone-api.${local.env.fqdn_base}" #TODO: API has not been deployed yet.

    RAILS_SERVE_STATIC_FILES = "true"
    RAILS_ENV                = local.env.rails_env

    HUBZONE_WMS_URL_ROOT_WITHOUT_GWC = local.wms_url_without_gwc
  }
  container_secrets_parameterstore = {
    HUBZONE_MAP_DB_PASSWORD = "${terraform.workspace}/hubzone/rds/password"
    HUBZONE_MAP_DB_USER     = "${terraform.workspace}/hubzone/rds/username"
    SECRET_KEY_BASE         = "${terraform.workspace}/hubzone/report/secret_key_base"
    HUBZONE_API_KEY         = "${terraform.workspace}/hubzone/api/api_gateway_key"
    HUBZONE_GOOGLE_API_KEY  = "${terraform.workspace}/hubzone/api/google_api_key"
  }
}

module "webmap" {
  #source  = "../../terraform-aws-easy-fargate-service"
  source  = "USSBA/easy-fargate-service/aws"
  version = "~> 11.0"

  # cloudwatch logging
  log_group_name              = "/ecs/${terraform.workspace}/${local.env.service_name}"
  log_group_retention_in_days = 90

  # access logs
  # note: bucket permission may need to be adjusted
  # https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-access-logs.html#access-logging-bucket-permissions
  alb_log_bucket_name = local.env.log_bucket
  alb_log_prefix      = "alb/${local.env.service_name}/${terraform.workspace}"


  cloudfront_header = {
    key   = "x-ussba-origin-token",
    value = nonsensitive(data.aws_ssm_parameter.origin_token.value)
  }

  family                 = "${terraform.workspace}-${local.env.service_shortname}-fg"
  task_cpu               = local.env.task_cpu_rails
  task_memory            = local.env.task_memory_rails
  enable_execute_command = true
  ipv6                   = true
  #alb_idle_timeout      = 60

  ## If the ecs task needs to access AWS API for any reason, grant
  ## it permissions with this parameter and the policy resource below
  #task_policy_json       = data.aws_iam_policy_document.fargate.json

  # Deployment
  enable_deployment_rollbacks        = true
  wait_for_steady_state              = true
  deployment_maximum_percent         = 400
  deployment_minimum_healthy_percent = 100

  # Scaling and health
  desired_capacity                 = local.env.desired_container_count_rails
  max_capacity                     = local.env.max_container_count_rails
  min_capacity                     = local.env.min_container_count_rails
  scaling_metric                   = local.env.scaling_metric
  scaling_threshold                = local.env.scaling_threshold
  scheduled_actions                = try(local.env.scheduled_actions, [])
  scheduled_actions_timezone       = try(local.env.scheduled_actions_timezone, "UTC")
  health_check_path                = local.env.health_check_path
  health_check_timeout             = 5
  health_check_interval            = 20
  health_check_healthy_threshold   = 2
  health_check_unhealthy_threshold = 9

  # networking
  service_fqdn       = local.service_fqdn
  hosted_zone_id     = data.aws_route53_zone.selected.zone_id
  public_subnet_ids  = data.aws_subnets.public.ids
  private_subnet_ids = data.aws_subnets.private.ids
  vpc_id             = data.aws_vpc.selected.id
  certificate_arn    = data.aws_acm_certificate.selected.arn
  #regional_waf_acl   = aws_wafv2_web_acl.waf_regional.arn

  # container(s)
  cluster_name   = data.aws_ecs_cluster.selected.cluster_name
  container_port = local.env.rails_port
  container_definitions = [
    {
      name        = "webmap"
      image       = "${local.prefix_ecr}/${local.env.ecr_name}:${var.image_tag}"
      environment = [for k, v in local.container_environment : { name = k, value = v }]
      secrets     = [for k, v in local.container_secrets_parameterstore : { name = k, valueFrom = "${local.prefix_parameter_store}/${v}" }]
    },
  ]
}

## If the ecs task needs to access AWS API for any reason, grant it permissions with this
#
#data "aws_iam_policy_document" "fargate" {
#  #TODO: Simple example until we figure out what's needed
#  statement {
#    sid = "AllResources"
#    actions = [
#      "s3:ListAllMyBuckets",
#      "s3:GetBucketLocation",
#    ]
#    resources = ["*"]
#  }
#}
