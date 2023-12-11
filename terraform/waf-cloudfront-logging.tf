resource "aws_wafv2_web_acl_logging_configuration" "logs" {
  log_destination_configs = [aws_kinesis_firehose_delivery_stream.logs.arn]
  resource_arn            = aws_wafv2_web_acl.waf_cloudfront.arn
}

resource "aws_cloudwatch_log_group" "logs" {
  name              = "/kinesis/firehose/${aws_wafv2_web_acl.waf_cloudfront.name}"
  retention_in_days = 90
  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_cloudwatch_log_stream" "logs" {
  name           = "errors"
  log_group_name = aws_cloudwatch_log_group.logs.name
  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_iam_policy" "logs" {
  name = "kinesis-firehose-${aws_wafv2_web_acl.waf_cloudfront.name}-${local.region}"
  path = "/service-role/"
  policy = jsonencode(
    {
      Version = "2012-10-17"
      Statement = [
        {
          Sid    = ""
          Effect = "Allow"
          Action = [
            "s3:AbortMultipartUpload",
            "s3:GetBucketLocation",
            "s3:GetObject",
            "s3:ListBucket",
            "s3:ListBucketMultipartUploads",
            "s3:PutObject",
          ]
          Resource = [
            data.aws_s3_bucket.logs.arn,
            "${data.aws_s3_bucket.logs.arn}/*",
          ]
        },
        {
          Sid    = ""
          Effect = "Allow"
          Action = [
            "logs:PutLogEvents",
          ]
          Resource = [
            "${aws_cloudwatch_log_group.logs.arn}:log-stream:*"
          ]
        },
      ]
    }
  )
  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_iam_role" "logs" {
  name = "kinesis-firehose-${aws_wafv2_web_acl.waf_cloudfront.name}-${local.region}"
  path = "/service-role/"
  assume_role_policy = jsonencode(
    {
      Statement = [
        {
          Action = "sts:AssumeRole"
          Effect = "Allow"
          Principal = {
            Service = "firehose.amazonaws.com"
          }
        },
      ]
      Version = "2012-10-17"
    }
  )
  managed_policy_arns = [
    aws_iam_policy.logs.arn,
  ]
  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_kinesis_firehose_delivery_stream" "logs" {
  destination = "extended_s3"
  name        = "aws-waf-logs-${aws_wafv2_web_acl.waf_cloudfront.name}"

  extended_s3_configuration {
    bucket_arn         = data.aws_s3_bucket.logs.arn
    buffering_interval = 300
    buffering_size     = 5
    compression_format = "UNCOMPRESSED"
    prefix             = "wafv2/${local.account_id}/${aws_wafv2_web_acl.waf_cloudfront.name}/"
    role_arn           = aws_iam_role.logs.arn
    s3_backup_mode     = "Disabled"

    # destination errors
    cloudwatch_logging_options {
      enabled         = true
      log_group_name  = aws_cloudwatch_log_group.logs.name
      log_stream_name = aws_cloudwatch_log_stream.logs.name
    }

    processing_configuration {
      enabled = false
    }
  }

  server_side_encryption {
    enabled  = false
    key_type = "AWS_OWNED_CMK"
  }
}
