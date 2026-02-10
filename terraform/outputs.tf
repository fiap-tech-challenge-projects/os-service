output "rds_endpoint" {
  description = "RDS endpoint"
  value       = aws_db_instance.os_service.endpoint
}

output "rds_arn" {
  description = "RDS ARN"
  value       = aws_db_instance.os_service.arn
}

output "database_url_secret_arn" {
  description = "ARN of the Secrets Manager secret containing the database URL"
  value       = aws_secretsmanager_secret.os_service_db.arn
}

output "service_role_arn" {
  description = "IAM role ARN for OS Service pods"
  value       = aws_iam_role.os_service.arn
}

output "security_group_id" {
  description = "Security group ID for RDS"
  value       = aws_security_group.os_service_rds.id
}
