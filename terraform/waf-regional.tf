locals {
  waf_regional = {
    name        = "${terraform.workspace}-${local.env.service_name}-regional-acl"
    header_name = "x-ussba-origin-token"
  }
}

resource "aws_wafv2_web_acl" "waf_regional" {
  description = local.waf_regional.name
  name        = local.waf_regional.name
  scope       = "REGIONAL"

  default_action {
    allow {}
  }

  # This validation happens on the ALB listener
  #rule {
  #  priority = 0
  #  name     = local.waf_regional.header_name
  #  action {
  #    block {}
  #  }

  #  statement {
  #    byte_match_statement {
  #      positional_constraint = "EXACTLY"
  #      search_string         = nonsensitive(data.aws_ssm_parameter.origin_token.value)
  #      field_to_match {
  #        single_header {
  #          name = local.waf_regional.header_name
  #        }
  #      }
  #      text_transformation {
  #        priority = 0
  #        type     = "NONE"
  #      }
  #    }
  #  }

  #  visibility_config {
  #    cloudwatch_metrics_enabled = true
  #    metric_name                = "${local.waf_regional.name}-${local.waf_regional.header_name}"
  #    sampled_requests_enabled   = true
  #  }
  #}

  visibility_config {
    cloudwatch_metrics_enabled = true
    metric_name                = "${terraform.workspace}-hubzone-webmap-cloudfront-acl"
    sampled_requests_enabled   = false
  }
}

resource "aws_cloudwatch_log_group" "waf_regional" {
  name              = "aws-waf-logs-${local.waf_regional.name}"
  retention_in_days = 90
}

resource "aws_wafv2_web_acl_logging_configuration" "waf_regional" {
  log_destination_configs = [aws_cloudwatch_log_group.waf_regional.arn]
  resource_arn            = aws_wafv2_web_acl.waf_regional.arn
}

