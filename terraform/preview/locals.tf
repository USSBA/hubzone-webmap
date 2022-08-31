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
  all = {
    default = {
      service_name      = "preview-hubzone-webmap"
      service_shortname = "preview-webmap"
      ecr_name          = "hubzone/hubzone-webmap"
      log_bucket        = "${local.account_id}-logs"

      rails_port        = 3000
      task_cpu_rails    = "256"
      task_memory_rails = "512"

      health_check_path             = "/hubzone/map/aws-hc"
      desired_container_count_rails = 1
      max_container_count_rails     = 1
      min_container_count_rails     = 1
      scaling_metric                = "memory"
      scaling_threshold             = "75"
      fargate_alarm_targets         = [local.sns_yellow]

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
      rails_env   = "staging"
    }
    prod = {
      fqdn_base   = "certify.sba.gov"
      cert_domain = "certify.sba.gov"
      rails_env   = "production"
      #TODO: Delete this backend_location to point back at cloudfront once the deployment is complete
      fargate_alarm_targets = [local.sns_red]
    }
  }
  # Condense all config into a single `local.env.*`
  env = merge(local.all.default, try(local.all[terraform.workspace], {}))

  service_fqdn  = "${local.env.service_name}.${local.env.fqdn_base}"
  public_fqdn   = "preview-maps.${local.env.fqdn_base}"
  postgres_fqdn = "hubzone-db.${local.env.fqdn_base}"

  # Convenience prefixes for AWS Resources
  prefix_ecr             = "${local.account_id}.dkr.ecr.${local.region}.amazonaws.com"
  prefix_parameter_store = "arn:aws:ssm:${local.region}:${local.account_id}:parameter"
}
