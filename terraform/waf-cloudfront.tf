#tf import -var 'image_tag=a5442677d9180eb8694be19b745f096e45c9c97e' \
#  'aws_wafv2_web_acl.cloudfront' 'dd488209-dad2-46e0-9de1-99a18d498d77/demo-hubzone-webmap-cloudfront-acl/CLOUDFRONT'
locals {
  waf_cloudfront = {
    name = "${terraform.workspace}-${local.env.service_name}-cloudfront-acl"
  }
}

resource "aws_wafv2_web_acl" "waf_cloudfront" {
  description = local.waf_cloudfront.name
  name        = local.waf_cloudfront.name
  scope       = "CLOUDFRONT"

  default_action {
    allow {}
  }

  # This group contains rules that are based on Amazon threat intelligence. This is useful
  # if you would like to block sources associated with bots or other threats.
  # - https://docs.aws.amazon.com/waf/latest/developerguide/aws-managed-rule-groups-ip-rep.html
  rule {
    priority = 0
    name     = "amazon-ip-reputation"
    override_action {
      none {}
    }
    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesAmazonIpReputationList"
        vendor_name = "AWS"
      }
    }
    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "${local.waf_cloudfront.name}-amazon-ip-reputation"
      sampled_requests_enabled   = false
    }
  }

  # This custom rule will check the URI for /hubzone/map/search and rate limit the user
  # based on their IP address
  # - https://docs.aws.amazon.com/waf/latest/developerguide/waf-rule-statement-type-rate-based.html
  rule {
    name     = "search-rate-limit"
    priority = 1
    action {
      block {}
    }
    statement {
      rate_based_statement {
        limit              = 100 # number of request over a 5minute period
        aggregate_key_type = "IP"

        scope_down_statement {
          byte_match_statement {
            field_to_match {
              uri_path {}
            }
            positional_constraint = "STARTS_WITH"
            search_string         = "/hubzone/map/search"
            text_transformation {
              priority = 0
              type     = "LOWERCASE"
            }
          }
        }
      }
    }
    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "${local.waf_cloudfront.name}-search-rate-limit"
      sampled_requests_enabled   = false
    }
  }

  # Use-case specific rule groups provide incremental protection for many diverse AWS WAF use cases.
  # - https://docs.aws.amazon.com/waf/latest/developerguide/aws-managed-rule-groups-use-case.html
  rule {
    name     = "sql-injection"
    priority = 2
    override_action {
      none {}
    }
    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesSQLiRuleSet"
        vendor_name = "AWS"
      }
    }
    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "${local.waf_cloudfront.name}-sql-injection"
      sampled_requests_enabled   = false
    }
  }

  # Baseline managed rule groups provide general protection against a wide variety of
  # common threats. Choose one or more of these rule groups to establish baseline protection for your resources.
  # - https://docs.aws.amazon.com/waf/latest/developerguide/aws-managed-rule-groups-baseline.html
  rule {
    priority = 3
    name     = "amazon-common"
    override_action {
      none {}
    }
    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesCommonRuleSet"
        vendor_name = "AWS"
      }
    }
    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "${local.waf_cloudfront.name}-amazon-common"
      sampled_requests_enabled   = false
    }
  }


  visibility_config {
    cloudwatch_metrics_enabled = true
    metric_name                = "${terraform.workspace}-${local.env.service_name}-cloudfront-acl"
    sampled_requests_enabled   = false
  }
}

resource "aws_cloudwatch_log_group" "waf_cloudfront" {
  name              = "aws-waf-logs-${local.waf_cloudfront.name}"
  retention_in_days = 90
}

resource "aws_wafv2_web_acl_logging_configuration" "waf_cloudfront" {
  log_destination_configs = [aws_cloudwatch_log_group.waf_cloudfront.arn]
  resource_arn            = aws_wafv2_web_acl.waf_cloudfront.arn
}

