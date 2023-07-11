terraform {
  required_providers {
    aws = {
      version = ">= 3.69, < 5.0"
      source  = "hashicorp/aws"
    }
  }
  required_version = "~> 1.0"
}

provider "aws" {
  region              = "us-east-1"
  allowed_account_ids = [local.account_ids[terraform.workspace]]
  default_tags {
    tags = {
      Environment     = terraform.workspace
      TerraformSource = "hubzone-webmap/terraform/archive"
      ManagedBy       = "terraform"
    }
  }
}

terraform {
  backend "s3" {
    bucket               = "sba-certify-terraform-remote-state"
    region               = "us-east-1"
    dynamodb_table       = "terraform-state-locktable"
    acl                  = "bucket-owner-full-control"
    key                  = "archive-hubzone-webmap.terraform.tfstate"
    workspace_key_prefix = "archive-hubzone-webmap"
  }
}

data "aws_caller_identity" "current" {}
data "aws_region" "current" {}
