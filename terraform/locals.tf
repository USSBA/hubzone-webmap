locals {
  region             = data.aws_region.current.name
  account_id         = data.aws_caller_identity.current.account_id
  account_name       = contains(["stg", "prod"], terraform.workspace) ? "upper" : "lower"
  enable_alarm_count = contains(["prod"], terraform.workspace) ? 1 : 0
  account_ids = {
    demo = "997577316207"
    stg  = "222484291001"
    prod = "222484291001"
  }
  sns_alarms = {
    #green    = "arn:aws:sns:us-east-1:502235151991:alarm-green"
    #yellow   = "arn:aws:sns:us-east-1:502235151991:alarm-yellow"
    #red      = "arn:aws:sns:us-east-1:502235151991:alarm-red"
    #security = "arn:aws:sns:us-east-1:502235151991:alarm-security"
    green    = data.aws_sns_topic.alerts["green"].arn
    yellow   = data.aws_sns_topic.alerts["yellow"].arn
    red      = data.aws_sns_topic.alerts["red"].arn
    security = data.aws_sns_topic.alerts["security"].arn
  }
  all = {
    default = {
      service_name      = "hubzone-webmap"
      service_shortname = "hubzone-webmap"
      ecr_name          = "hubzone/hubzone-webmap"
      db_identifier     = "hubzone-aurora"
      public_subdomain  = "maps"
      backend_location  = "cloudfront"
      log_bucket        = "${local.account_id}-us-east-1-logs"

      rails_port        = 3000
      task_cpu_rails    = "256"
      task_memory_rails = "512"

      health_check_path             = "/hubzone/map/aws-hc"
      desired_container_count_rails = 1
      max_container_count_rails     = 1
      min_container_count_rails     = 1
      scaling_metric                = "memory"
      scaling_threshold             = "75"

      scheduled_actions          = []
      scheduled_actions_timezone = "America/New_York"
    }
    demo = {
      fqdn_base   = "demo.sba-one.net"
      cert_domain = "sba-one.net"
      rails_env   = "demo"
    }
    stg = {
      fqdn_base   = "stg.certify.sba.gov"
      cert_domain = "stg.certify.sba.gov"

      desired_container_count_rails = 2
      min_container_count_rails     = 2
      max_container_count_rails     = 2
      rails_env                     = "staging"

      scheduled_actions = [
        { expression = "cron(0 7 * * ? *)", max_capacity = 2, min_capacity = 2 },  # Everyday at 7:00 AM EST
        { expression = "cron(0 19 * * ? *)", max_capacity = 1, min_capacity = 1 }, # Everyday at 7:00 PM EST
      ]
    }
    prod = {
      fqdn_base                     = "certify.sba.gov"
      cert_domain                   = "certify.sba.gov"
      desired_container_count_rails = 2
      min_container_count_rails     = 2
      max_container_count_rails     = 4
      rails_env                     = "production"
      #TODO: Delete this backend_location to point back at cloudfront once the deployment is complete
    }
  }
  # Condense all config into a single `local.env.*`
  env = merge(local.all.default, try(local.all[terraform.workspace], {}))

  service_fqdn        = "${local.env.service_name}.${local.env.fqdn_base}"
  public_fqdn         = "${local.env.public_subdomain}.${local.env.fqdn_base}"
  postgres_fqdn       = "hubzone-db.${local.env.fqdn_base}"
  wms_url_without_gwc = "https://maps.${local.env.fqdn_base}/geoserver/hubzone/wms?"

  # Convenience prefixes for AWS Resources
  prefix_bucket          = "arn:aws:s3:::"
  prefix_ecr             = "222484291001.dkr.ecr.${local.region}.amazonaws.com"
  prefix_parameter_store = "arn:aws:ssm:${local.region}:${local.account_id}:parameter"
}
