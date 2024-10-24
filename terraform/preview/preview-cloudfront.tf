resource "aws_route53_record" "preview_map_a" {
  name    = "preview-maps.${local.env.fqdn_base}"
  type    = "A"
  zone_id = data.aws_route53_zone.selected.id

  alias {
    evaluate_target_health = false
    name                   = aws_cloudfront_distribution.preview.domain_name
    zone_id                = aws_cloudfront_distribution.preview.hosted_zone_id
  }
}

resource "aws_route53_record" "preview_map_aaaa" {
  name    = "preview-maps.${local.env.fqdn_base}"
  type    = "AAAA"
  zone_id = data.aws_route53_zone.selected.id

  alias {
    evaluate_target_health = false
    name                   = aws_cloudfront_distribution.preview.domain_name
    zone_id                = aws_cloudfront_distribution.preview.hosted_zone_id
  }
}

resource "aws_cloudfront_distribution" "preview" {
  aliases = [
    "preview-maps.${local.env.fqdn_base}",
  ]
  comment             = "preview-hubzone-${terraform.workspace}"
  enabled             = true
  http_version        = "http2"
  is_ipv6_enabled     = true
  price_class         = "PriceClass_100"
  retain_on_delete    = false
  wait_for_deployment = true
  #  web_acl_id          = aws_wafv2_web_acl.waf_cloudfront.arn

  logging_config {
    bucket          = "${local.account_ids[terraform.workspace]}-logs.s3.amazonaws.com"
    include_cookies = false
    prefix          = "${terraform.workspace}/cloudfront/preview-hubzone"
  }

  restrictions {
    geo_restriction {
      locations        = ["RU", "HK", "CN"]
      restriction_type = "blacklist"
    }
  }

  viewer_certificate {
    acm_certificate_arn            = data.aws_acm_certificate.selected.arn
    cloudfront_default_certificate = false
    minimum_protocol_version       = "TLSv1.2_2019"
    ssl_support_method             = "sni-only"
  }

  ordered_cache_behavior {
    allowed_methods = [
      "GET",
      "HEAD",
    ]
    cache_policy_id = aws_cloudfront_cache_policy.preview_one_week_qs.id
    cached_methods = [
      "GET",
      "HEAD",
    ]
    compress                 = true
    default_ttl              = 0
    max_ttl                  = 0
    min_ttl                  = 0
    origin_request_policy_id = aws_cloudfront_origin_request_policy.preview_qs.id
    path_pattern             = "/geoserver/gwc/service/wms"
    smooth_streaming         = false
    target_origin_id         = "geoserver"
    trusted_key_groups       = []
    trusted_signers          = []
    viewer_protocol_policy   = "redirect-to-https"
  }

  ordered_cache_behavior {
    allowed_methods = [
      "DELETE",
      "GET",
      "HEAD",
      "OPTIONS",
      "PATCH",
      "POST",
      "PUT",
    ]
    cache_policy_id = data.aws_cloudfront_cache_policy.preview_cache_disabled.id
    cached_methods = [
      "GET",
      "HEAD",
    ]
    compress                   = false
    default_ttl                = 0
    max_ttl                    = 0
    min_ttl                    = 0
    origin_request_policy_id   = data.aws_cloudfront_origin_request_policy.preview_all_viewer.id
    path_pattern               = "/geoserver/*"
    response_headers_policy_id = data.aws_cloudfront_response_headers_policy.preview_security_headers.id
    smooth_streaming           = false
    target_origin_id           = "geoserver"
    trusted_key_groups         = []
    trusted_signers            = []
    viewer_protocol_policy     = "redirect-to-https"
  }

  ordered_cache_behavior {
    allowed_methods = [
      "DELETE",
      "GET",
      "HEAD",
      "OPTIONS",
      "PATCH",
      "POST",
      "PUT",
    ]
    cached_methods = [
      "GET",
      "HEAD",
    ]
    compress               = false
    default_ttl            = 0
    max_ttl                = 0
    min_ttl                = 0
    path_pattern           = "/report"
    smooth_streaming       = false
    target_origin_id       = "report"
    trusted_key_groups     = []
    trusted_signers        = []
    viewer_protocol_policy = "redirect-to-https"

    forwarded_values {
      headers = [
        "Host",
      ]
      query_string            = true
      query_string_cache_keys = []

      cookies {
        forward           = "all"
        whitelisted_names = []
      }
    }
  }

  default_cache_behavior {
    allowed_methods = [
      "DELETE",
      "GET",
      "HEAD",
      "OPTIONS",
      "PATCH",
      "POST",
      "PUT",
    ]
    cached_methods = [
      "GET",
      "HEAD",
    ]
    compress               = false
    default_ttl            = 0
    max_ttl                = 0
    min_ttl                = 0
    smooth_streaming       = false
    target_origin_id       = "preview-webmap"
    trusted_key_groups     = []
    trusted_signers        = []
    viewer_protocol_policy = "redirect-to-https"

    forwarded_values {
      headers = [
        "*",
      ]
      query_string            = true
      query_string_cache_keys = []

      cookies {
        forward           = "all"
        whitelisted_names = []
      }
    }
  }

  origin {
    connection_attempts = 3
    connection_timeout  = 10
    domain_name         = "hubzone-geoserver.${local.env.fqdn_base}"
    origin_id           = "geoserver"

    custom_origin_config {
      http_port                = 80
      https_port               = 443
      origin_keepalive_timeout = 5
      origin_protocol_policy   = "https-only"
      origin_read_timeout      = 30
      origin_ssl_protocols = [
        "TLSv1",
        "TLSv1.1",
        "TLSv1.2",
      ]
    }
  }

  origin {
    connection_attempts = 3
    connection_timeout  = 10
    domain_name         = "hubzone-report.${local.env.fqdn_base}"
    origin_id           = "report"

    custom_header {
      name  = "x-ussba-origin-token"
      value = nonsensitive(data.aws_ssm_parameter.origin_token.value)
    }

    custom_origin_config {
      http_port                = 80
      https_port               = 443
      origin_keepalive_timeout = 5
      origin_protocol_policy   = "https-only"
      origin_read_timeout      = 30
      origin_ssl_protocols = [
        "TLSv1",
        "TLSv1.1",
        "TLSv1.2",
      ]
    }
  }

  origin {
    connection_attempts = 3
    connection_timeout  = 10
    domain_name         = "preview-hubzone-webmap.${local.env.fqdn_base}"
    origin_id           = "preview-webmap"

    custom_header {
      name  = "x-ussba-origin-token"
      value = nonsensitive(data.aws_ssm_parameter.origin_token.value)
    }

    custom_origin_config {
      http_port                = 80
      https_port               = 443
      origin_keepalive_timeout = 5
      origin_protocol_policy   = "https-only"
      origin_read_timeout      = 30
      origin_ssl_protocols = [
        "TLSv1",
        "TLSv1.1",
        "TLSv1.2",
      ]
    }
  }
}

# Cache Policies
data "aws_cloudfront_cache_policy" "preview_cache_disabled" {
  name = "Managed-CachingDisabled"
}

resource "aws_cloudfront_cache_policy" "preview_one_week_qs" {
  comment     = "Cache for one week, query-string included in key"
  default_ttl = 86400
  max_ttl     = 86400
  min_ttl     = 86400
  name        = "${local.env.service_name}-${terraform.workspace}-preview-one-week-qs"
  parameters_in_cache_key_and_forwarded_to_origin {
    enable_accept_encoding_brotli = true
    enable_accept_encoding_gzip   = true
    cookies_config {
      cookie_behavior = "none"
    }
    headers_config {
      header_behavior = "none"
    }
    query_strings_config {
      query_string_behavior = "all"
    }
  }
}

# Origin Request Policies
data "aws_cloudfront_origin_request_policy" "preview_all_viewer" {
  name = "Managed-AllViewer"
}

resource "aws_cloudfront_origin_request_policy" "preview_qs" {
  comment = "Allow query-strings and host header"
  name    = "${local.env.service_name}-${terraform.workspace}-preview-qs"
  cookies_config {
    cookie_behavior = "none"
  }
  headers_config {
    header_behavior = "whitelist"
    headers {
      items = [
        "Host",
        "Origin",
      ]
    }
  }
  query_strings_config {
    query_string_behavior = "all"
  }
}

# Response Header Policies
data "aws_cloudfront_response_headers_policy" "preview_security_headers" {
  name = "Managed-SecurityHeadersPolicy"
}

# Metric Alarms
resource "aws_cloudwatch_metric_alarm" "preview_hubzone_rate5xx" {
  count               = local.enable_alarm_count
  actions_enabled     = true
  alarm_actions       = [local.sns_red]
  alarm_description   = "Error Rate >= 1 percent for 5 datapoints within 25 minutes"
  alarm_name          = "${terraform.workspace}-preview-hubzone-cloudfront-5xx-error-rate"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  dimensions = {
    DistributionId = aws_cloudfront_distribution.preview.id
    Region         = "Global"
  }
  evaluation_periods        = 5
  insufficient_data_actions = []
  metric_name               = "5xxErrorRate"
  namespace                 = "AWS/CloudFront"
  ok_actions                = [local.sns_red]
  period                    = 300
  statistic                 = "Average"
  threshold                 = 1
  treat_missing_data        = "missing"
}

