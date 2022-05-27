# vpc
data "aws_vpc" "selected" {
  tags = {
    Name = "${terraform.workspace}-vpc"
  }
}

# subnet ids
data "aws_subnets" "private" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.selected.id]
  }
  filter {
    name   = "tag:Name"
    values = ["${terraform.workspace}-private-subnet-*"]
  }
}
data "aws_subnets" "public" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.selected.id]
  }
  filter {
    name   = "tag:Name"
    values = ["${terraform.workspace}-public-subnet-*"]
  }
}

## hosted zone
data "aws_route53_zone" "selected" {
  name = "${local.env.fqdn_base}."
}

## acm
data "aws_acm_certificate" "selected" {
  domain      = local.env.cert_domain
  statuses    = ["ISSUED"]
  most_recent = true
}

## ecs cluster
data "aws_ecs_cluster" "selected" {
  cluster_name = terraform.workspace
}

## RDS Postgres Instance
data "aws_db_instance" "rds" {
  db_instance_identifier = "${terraform.workspace}-${local.env.db_identifier}"
}

data "aws_ssm_parameter" "origin_token" {
  name            = "/${terraform.workspace}/waf/${local.waf_regional.header_name}"
  with_decryption = true
}

# WAF (cloudfront)
#data "aws_wafv2_web_acl" "cloudfront" {
#  name  = "basic-waf-cloudfront"
#  scope = "CLOUDFRONT"
#}

## WAF (regional)
#data "aws_wafv2_web_acl" "regional" {
#  name  = "basic-waf-regional"
#  scope = "REGIONAL"
#}

# SNS Topics
data "aws_sns_topic" "topics" {
  for_each = toset(["red", "green", "yellow", "security", "email-admins"])
  name     = "sba-notification-framework-${each.key}"
}
locals {
  sns_red          = data.aws_sns_topic.topics["red"].arn
  sns_yellow       = data.aws_sns_topic.topics["yellow"].arn
  sns_green        = data.aws_sns_topic.topics["green"].arn
  sns_security     = data.aws_sns_topic.topics["security"].arn
  sns_email_admins = data.aws_sns_topic.topics["email-admins"].arn
}
