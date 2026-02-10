# Store database credentials in Secrets Manager
resource "aws_secretsmanager_secret" "os_service_db" {
  name_prefix             = "${var.project_name}/os-service/${var.environment}/database-"
  description             = "OS Service database credentials"
  recovery_window_in_days = var.environment == "production" ? 30 : 0

  tags = local.common_tags
}

resource "aws_secretsmanager_secret_version" "os_service_db" {
  secret_id = aws_secretsmanager_secret.os_service_db.id
  secret_string = jsonencode({
    username = aws_db_instance.os_service.username
    password = random_password.db_password.result
    engine   = "postgres"
    host     = aws_db_instance.os_service.endpoint
    port     = aws_db_instance.os_service.port
    dbname   = aws_db_instance.os_service.db_name
    url      = "postgresql://${aws_db_instance.os_service.username}:${random_password.db_password.result}@${aws_db_instance.os_service.endpoint}/${aws_db_instance.os_service.db_name}"
  })
}
