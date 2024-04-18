resource "aws_route53_record" "map_a" {
  name    = "maps.${local.env.fqdn_base}"
  type    = "A"
  zone_id = data.aws_route53_zone.selected.id

  alias {
    evaluate_target_health = false
    name                   = aws_cloudfront_distribution.distribution.domain_name
    zone_id                = aws_cloudfront_distribution.distribution.hosted_zone_id
  }
}

resource "aws_route53_record" "map_aaaa" {
  name    = "maps.${local.env.fqdn_base}"
  type    = "AAAA"
  zone_id = data.aws_route53_zone.selected.id

  alias {
    evaluate_target_health = false
    name                   = aws_cloudfront_distribution.distribution.domain_name
    zone_id                = aws_cloudfront_distribution.distribution.hosted_zone_id
  }
}

resource "aws_cloudfront_distribution" "distribution" {
  aliases = [
    "maps.${local.env.fqdn_base}",
  ]
  comment             = "hubzone-${terraform.workspace}"
  enabled             = true
  http_version        = "http2"
  is_ipv6_enabled     = true
  price_class         = "PriceClass_100"
  retain_on_delete    = false
  wait_for_deployment = true
  web_acl_id          = aws_wafv2_web_acl.waf_cloudfront.arn

  logging_config {
    bucket          = "${local.account_ids[terraform.workspace]}-us-east-1-logs.s3.amazonaws.com"
    include_cookies = false
    prefix          = "cloudfront/${local.env.service_name}/${terraform.workspace}"
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
    cache_policy_id = aws_cloudfront_cache_policy.one_week_qs.id
    cached_methods = [
      "GET",
      "HEAD",
    ]
    compress                   = true
    default_ttl                = 0
    max_ttl                    = 0
    min_ttl                    = 0
    origin_request_policy_id   = aws_cloudfront_origin_request_policy.qs.id
    response_headers_policy_id = aws_cloudfront_response_headers_policy.HSTS.id
    path_pattern               = "/geoserver/gwc/service/wms"
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
    cache_policy_id = data.aws_cloudfront_cache_policy.cache_disabled.id
    cached_methods = [
      "GET",
      "HEAD",
    ]
    compress                   = false
    default_ttl                = 0
    max_ttl                    = 0
    min_ttl                    = 0
    origin_request_policy_id   = data.aws_cloudfront_origin_request_policy.all_viewer.id
    path_pattern               = "/geoserver/*"
    response_headers_policy_id = data.aws_cloudfront_response_headers_policy.security_headers.id
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
    compress                   = false
    default_ttl                = 0
    max_ttl                    = 0
    min_ttl                    = 0
    path_pattern               = "/report"
    smooth_streaming           = false
    target_origin_id           = "report"
    trusted_key_groups         = []
    trusted_signers            = []
    viewer_protocol_policy     = "redirect-to-https"
    response_headers_policy_id = aws_cloudfront_response_headers_policy.HSTS.id

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
    compress                   = false
    default_ttl                = 0
    max_ttl                    = 0
    min_ttl                    = 0
    smooth_streaming           = false
    target_origin_id           = "webmap"
    trusted_key_groups         = []
    trusted_signers            = []
    viewer_protocol_policy     = "redirect-to-https"
    response_headers_policy_id = aws_cloudfront_response_headers_policy.HSTS.id

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
    domain_name         = "hubzone-webmap.${local.env.fqdn_base}"
    origin_id           = "webmap"

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
data "aws_cloudfront_cache_policy" "cache_disabled" {
  name = "Managed-CachingDisabled"
}

resource "aws_cloudfront_cache_policy" "one_week_qs" {
  comment     = "Cache for one week, query-string included in key"
  default_ttl = 86400
  max_ttl     = 86400
  min_ttl     = 86400
  name        = "${local.env.service_name}-${terraform.workspace}-one-week-qs"
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
data "aws_cloudfront_origin_request_policy" "all_viewer" {
  name = "Managed-AllViewer"
}

resource "aws_cloudfront_origin_request_policy" "qs" {
  comment = "Allow query-strings and host header"
  name    = "${local.env.service_name}-${terraform.workspace}-qs"
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
data "aws_cloudfront_response_headers_policy" "security_headers" {
  name = "Managed-SecurityHeadersPolicy"
}

resource "aws_cloudfront_response_headers_policy" "HSTS" {
  name    = "${terraform.workspace}-${local.env.service_name}-response-policy"
  comment = "use HSTS response header"

  security_headers_config {
    strict_transport_security {
      access_control_max_age_sec = 300
      override                   = true
      include_subdomains         = true
    }
  }
}
# Metric Alarms
/* resource "aws_cloudwatch_metric_alarm" "hubzone_rate5xx" {
  count               = local.enable_alarm_count
  actions_enabled     = true
  alarm_actions       = [local.sns_red]
  alarm_description   = "Error Rate >= 1 percent for 5 datapoints within 25 minutes"
  alarm_name          = "${terraform.workspace}-hubzone-cloudfront-5xx-error-rate"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  dimensions = {
    DistributionId = aws_cloudfront_distribution.distribution.id
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
}*/

