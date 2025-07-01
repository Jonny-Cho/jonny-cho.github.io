---
title: 'Docker Compose로 로컬 개발환경 구축하기 - 개발 생산성 혁신 가이드'
date: 2025-07-01 18:00:00
categories: 'devops'
draft: false
tags: ['Docker', 'Docker Compose', 'Development Environment', 'DevOps', 'Spring Boot', 'MySQL', 'Redis', 'Kafka']
---

# Docker Compose로 로컬 개발환경 구축하기

"내 컴퓨터에서는 잘 되는데?"라는 말을 더 이상 듣고 싶지 않다면, Docker Compose를 활용한 표준화된 개발환경 구축이 답입니다.

이 글에서는 Spring Boot 백엔드 개발자를 위한 완전한 Docker Compose 개발환경 구축 방법을 실무 중심으로 다루겠습니다.

## 1. 개발환경 표준화의 필요성

### "내 컴퓨터에서는 잘 되는데?" 문제 해결

**전통적인 로컬 개발환경의 문제점:**

```bash
# 개발자 A의 환경
MySQL 8.0.35, Redis 7.2, Node.js 18.17.1

# 개발자 B의 환경  
MySQL 5.7.44, Redis 6.0, Node.js 16.20.0

# 개발자 C의 환경 (Mac M1)
MySQL 8.0.35 (ARM), Redis 7.0, Node.js 20.10.0
```

**결과**: 각자 다른 환경에서 서로 다른 버그 발생 😱

### Docker Compose의 장점

- **일관성**: 모든 개발자가 동일한 환경에서 작업
- **격리**: 기존 시스템에 영향 없이 독립적인 환경 구성  
- **재현 가능**: 언제든 깨끗한 상태로 초기화 가능
- **확장성**: 새로운 서비스 추가가 간단
- **팀 온보딩**: 새 팀원이 5분 만에 개발 환경 구축

## 2. Docker Compose 기초

### 2.1 Docker vs Docker Compose

**Docker (단일 컨테이너)**:
```bash
# 각각 따로 실행해야 함
docker run -d --name mysql -e MYSQL_ROOT_PASSWORD=password mysql:8.0
docker run -d --name redis redis:7.2-alpine
docker run -d --name app -p 8080:8080 my-spring-app

# 네트워크 연결을 수동으로 설정
docker network create my-network
docker network connect my-network mysql
docker network connect my-network redis
docker network connect my-network app
```

**Docker Compose (멀티 컨테이너)**:
```yaml
# docker-compose.yml 하나로 모든 것 해결
version: '3.8'
services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: password
  
  redis:
    image: redis:7.2-alpine
  
  app:
    image: my-spring-app
    ports:
      - "8080:8080"
    depends_on:
      - mysql
      - redis
```

```bash
# 한 번에 모든 서비스 시작
docker-compose up -d
```

### 2.2 docker-compose.yml 구조

```yaml
version: '3.8'  # Docker Compose 파일 형식 버전

services:       # 애플리케이션을 구성하는 서비스들
  web:
    # 서비스 설정
    
networks:       # 커스텀 네트워크 정의 (선택사항)
  default:
    # 네트워크 설정
    
volumes:        # 데이터 영속성을 위한 볼륨 (선택사항)
  mysql_data:
    # 볼륨 설정
```

## 3. Spring Boot 프로젝트 개발환경 구성

### 3.1 기본 구성 요소

실무에서 가장 많이 사용하는 **Spring Boot + MySQL + Redis** 조합으로 시작해보겠습니다.

**프로젝트 구조:**
```
my-spring-project/
├── src/
├── docker/
│   ├── mysql/
│   │   └── init.sql
│   └── redis/
│       └── redis.conf
├── docker-compose.yml
├── docker-compose.override.yml
├── .env
└── Makefile
```

### 3.2 완전한 docker-compose.yml

```yaml
version: '3.8'

services:
  # ===================
  # 데이터베이스 서비스
  # ===================
  mysql:
    image: mysql:8.0.35
    container_name: ${PROJECT_NAME:-myapp}-mysql
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD:-root123!}
      MYSQL_DATABASE: ${MYSQL_DATABASE:-myapp}
      MYSQL_USER: ${MYSQL_USER:-app_user}
      MYSQL_PASSWORD: ${MYSQL_PASSWORD:-app_pass}
      # MySQL 8.0 성능 최적화
      MYSQL_INNODB_BUFFER_POOL_SIZE: 1G
      MYSQL_INNODB_LOG_FILE_SIZE: 256M
    ports:
      - "${MYSQL_PORT:-3306}:3306"
    volumes:
      - mysql_data:/var/lib/mysql
      - ./docker/mysql/init.sql:/docker-entrypoint-initdb.d/init.sql:ro
      - ./docker/mysql/conf.d:/etc/mysql/conf.d:ro
    command: >
      --character-set-server=utf8mb4
      --collation-server=utf8mb4_unicode_ci
      --init-connect='SET NAMES utf8mb4;'
      --innodb-flush-log-at-trx-commit=0
      --sync-binlog=0
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      timeout: 20s
      retries: 10
    restart: unless-stopped
    networks:
      - app-network

  # ===================
  # 캐시 서비스
  # ===================
  redis:
    image: redis:7.2.3-alpine
    container_name: ${PROJECT_NAME:-myapp}-redis
    ports:
      - "${REDIS_PORT:-6379}:6379"
    volumes:
      - redis_data:/data
      - ./docker/redis/redis.conf:/usr/local/etc/redis/redis.conf:ro
    command: redis-server /usr/local/etc/redis/redis.conf
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      timeout: 3s
      retries: 5
    restart: unless-stopped
    networks:
      - app-network

  # ===================
  # 애플리케이션 서비스
  # ===================
  app:
    build:
      context: .
      dockerfile: Dockerfile
      target: ${BUILD_TARGET:-development}
    container_name: ${PROJECT_NAME:-myapp}-app
    environment:
      # Spring Profile
      SPRING_PROFILES_ACTIVE: ${SPRING_PROFILES_ACTIVE:-docker}
      
      # Database Configuration
      SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/${MYSQL_DATABASE:-myapp}?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=Asia/Seoul
      SPRING_DATASOURCE_USERNAME: ${MYSQL_USER:-app_user}
      SPRING_DATASOURCE_PASSWORD: ${MYSQL_PASSWORD:-app_pass}
      
      # Redis Configuration
      SPRING_REDIS_HOST: redis
      SPRING_REDIS_PORT: 6379
      
      # JVM 최적화 (개발환경)
      JAVA_OPTS: >-
        -Xms512m -Xmx1024m
        -XX:+UseG1GC
        -XX:G1HeapRegionSize=16m
        -Dspring.devtools.restart.enabled=true
        -Dspring.devtools.livereload.enabled=true
    ports:
      - "${APP_PORT:-8080}:8080"
      - "${DEBUG_PORT:-5005}:5005"  # 디버깅 포트
    volumes:
      # 개발 시 소스 코드 핫 리로드 (선택사항)
      - ./src:/app/src:ro
      - ./target:/app/target
    depends_on:
      mysql:
        condition: service_healthy
      redis:
        condition: service_healthy
    restart: unless-stopped
    networks:
      - app-network

  # ===================
  # 개발 도구 서비스
  # ===================
  adminer:
    image: adminer:4.8.1
    container_name: ${PROJECT_NAME:-myapp}-adminer
    environment:
      ADMINER_DEFAULT_SERVER: mysql
      ADMINER_DESIGN: pepa-linha-dark
    ports:
      - "${ADMINER_PORT:-8081}:8080"
    depends_on:
      - mysql
    restart: unless-stopped
    networks:
      - app-network

  redis-commander:
    image: rediscommander/redis-commander:latest
    container_name: ${PROJECT_NAME:-myapp}-redis-commander
    environment:
      REDIS_HOSTS: local:redis:6379
      HTTP_USER: ${REDIS_COMMANDER_USER:-admin}
      HTTP_PASSWORD: ${REDIS_COMMANDER_PASSWORD:-admin123}
    ports:
      - "${REDIS_COMMANDER_PORT:-8082}:8081"
    depends_on:
      - redis
    restart: unless-stopped
    networks:
      - app-network

# ===================
# 네트워크 설정
# ===================
networks:
  app-network:
    driver: bridge
    name: ${PROJECT_NAME:-myapp}-network

# ===================
# 볼륨 설정
# ===================
volumes:
  mysql_data:
    name: ${PROJECT_NAME:-myapp}-mysql-data
  redis_data:
    name: ${PROJECT_NAME:-myapp}-redis-data
```

### 3.3 환경변수 설정 (.env)

```bash
# 프로젝트 설정
PROJECT_NAME=myapp
BUILD_TARGET=development

# Spring Boot 설정
SPRING_PROFILES_ACTIVE=docker
APP_PORT=8080
DEBUG_PORT=5005

# MySQL 설정
MYSQL_ROOT_PASSWORD=root123!
MYSQL_DATABASE=myapp
MYSQL_USER=app_user
MYSQL_PASSWORD=app_pass
MYSQL_PORT=3306

# Redis 설정
REDIS_PORT=6379

# 관리도구 설정
ADMINER_PORT=8081
REDIS_COMMANDER_PORT=8082
REDIS_COMMANDER_USER=admin
REDIS_COMMANDER_PASSWORD=admin123
```

## 4. 실무 시나리오별 구성

### 4.1 데이터베이스 환경

**MySQL 초기 설정 스크립트 (docker/mysql/init.sql):**

```sql
-- 데이터베이스 초기화
USE myapp;

-- 사용자 테이블
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 게시글 테이블
CREATE TABLE IF NOT EXISTS posts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    content TEXT,
    status ENUM('DRAFT', 'PUBLISHED', 'DELETED') DEFAULT 'DRAFT',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    FULLTEXT INDEX ft_title_content (title, content)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 샘플 데이터
INSERT INTO users (username, email, password) VALUES
('admin', 'admin@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('user1', 'user1@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('user2', 'user2@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi')
ON DUPLICATE KEY UPDATE username=username;

INSERT INTO posts (user_id, title, content, status) VALUES
(1, 'Docker Compose 개발환경 구축', 'Docker Compose를 활용한 효율적인 개발환경 구축 방법을 알아봅시다.', 'PUBLISHED'),
(2, 'Spring Boot 최적화 팁', 'Spring Boot 애플리케이션 성능 최적화 방법들을 정리했습니다.', 'PUBLISHED'),
(3, '개발 중인 글', '아직 작성 중인 글입니다.', 'DRAFT')
ON DUPLICATE KEY UPDATE title=title;
```

**MySQL 설정 최적화 (docker/mysql/conf.d/my.cnf):**

```ini
[mysqld]
# 기본 설정
default-storage-engine = InnoDB
character-set-server = utf8mb4
collation-server = utf8mb4_unicode_ci

# 성능 최적화 (개발환경)
innodb_buffer_pool_size = 1G
innodb_log_file_size = 256M
innodb_flush_log_at_trx_commit = 0
innodb_flush_method = O_DIRECT
sync_binlog = 0

# 연결 설정
max_connections = 200
wait_timeout = 28800
interactive_timeout = 28800

# 쿼리 최적화
query_cache_type = 1
query_cache_size = 128M
tmp_table_size = 128M
max_heap_table_size = 128M

# 로깅 (개발환경에서만)
general_log = 1
general_log_file = /var/log/mysql/general.log
slow_query_log = 1
slow_query_log_file = /var/log/mysql/slow.log
long_query_time = 2

[client]
default-character-set = utf8mb4
```

### 4.2 메시지 큐 환경

**Kafka + Zookeeper 추가:**

```yaml
# docker-compose.kafka.yml
version: '3.8'

services:
  zookeeper:
    image: confluentinc/cp-zookeeper:7.5.1
    container_name: ${PROJECT_NAME:-myapp}-zookeeper
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
      ZOOKEEPER_TICK_TIME: 2000
      ZOOKEEPER_SYNC_LIMIT: 2
    ports:
      - "2181:2181"
    volumes:
      - zookeeper_data:/var/lib/zookeeper/data
      - zookeeper_logs:/var/lib/zookeeper/log
    restart: unless-stopped
    networks:
      - app-network

  kafka:
    image: confluentinc/cp-kafka:7.5.1
    container_name: ${PROJECT_NAME:-myapp}-kafka
    depends_on:
      - zookeeper
    ports:
      - "9092:9092"
      - "29092:29092"
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://localhost:9092,PLAINTEXT_HOST://localhost:29092
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: PLAINTEXT:PLAINTEXT,PLAINTEXT_HOST:PLAINTEXT
      KAFKA_INTER_BROKER_LISTENER_NAME: PLAINTEXT
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
      KAFKA_AUTO_CREATE_TOPICS_ENABLE: true
      KAFKA_NUM_PARTITIONS: 3
      KAFKA_DEFAULT_REPLICATION_FACTOR: 1
      # 개발환경 최적화
      KAFKA_LOG_RETENTION_HOURS: 24
      KAFKA_LOG_RETENTION_BYTES: 1073741824
      KAFKA_LOG_SEGMENT_BYTES: 134217728
    volumes:
      - kafka_data:/var/lib/kafka/data
    healthcheck:
      test: ["CMD", "kafka-topics", "--bootstrap-server", "localhost:9092", "--list"]
      timeout: 10s
      retries: 5
    restart: unless-stopped
    networks:
      - app-network

  kafka-ui:
    image: provectuslabs/kafka-ui:latest
    container_name: ${PROJECT_NAME:-myapp}-kafka-ui
    depends_on:
      - kafka
    ports:
      - "8083:8080"
    environment:
      KAFKA_CLUSTERS_0_NAME: local
      KAFKA_CLUSTERS_0_BOOTSTRAPSERVERS: kafka:9092
      KAFKA_CLUSTERS_0_ZOOKEEPER: zookeeper:2181
      AUTH_TYPE: LOGIN_FORM
      SPRING_SECURITY_USER_NAME: ${KAFKA_UI_USER:-admin}
      SPRING_SECURITY_USER_PASSWORD: ${KAFKA_UI_PASSWORD:-admin123}
    restart: unless-stopped
    networks:
      - app-network

volumes:
  zookeeper_data:
  zookeeper_logs:
  kafka_data:
```

### 4.3 모니터링 스택

**Prometheus + Grafana 모니터링:**

```yaml
# docker-compose.monitoring.yml
version: '3.8'

services:
  prometheus:
    image: prom/prometheus:v2.47.2
    container_name: ${PROJECT_NAME:-myapp}-prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./docker/prometheus/prometheus.yml:/etc/prometheus/prometheus.yml:ro
      - ./docker/prometheus/rules:/etc/prometheus/rules:ro
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.console.libraries=/etc/prometheus/console_libraries'
      - '--web.console.templates=/etc/prometheus/consoles'
      - '--storage.tsdb.retention.time=30d'
      - '--web.enable-lifecycle'
      - '--web.enable-admin-api'
    restart: unless-stopped
    networks:
      - app-network

  grafana:
    image: grafana/grafana:10.2.0
    container_name: ${PROJECT_NAME:-myapp}-grafana
    ports:
      - "3000:3000"
    environment:
      GF_SECURITY_ADMIN_PASSWORD: ${GRAFANA_PASSWORD:-admin123}
      GF_INSTALL_PLUGINS: grafana-clock-panel,grafana-simple-json-datasource
    volumes:
      - grafana_data:/var/lib/grafana
      - ./docker/grafana/provisioning:/etc/grafana/provisioning:ro
      - ./docker/grafana/dashboards:/var/lib/grafana/dashboards:ro
    depends_on:
      - prometheus
    restart: unless-stopped
    networks:
      - app-network

  node-exporter:
    image: prom/node-exporter:v1.6.1
    container_name: ${PROJECT_NAME:-myapp}-node-exporter
    ports:
      - "9100:9100"
    volumes:
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro
      - /:/rootfs:ro
    command:
      - '--path.procfs=/host/proc'
      - '--path.rootfs=/rootfs'
      - '--path.sysfs=/host/sys'
      - '--collector.filesystem.mount-points-exclude=^/(sys|proc|dev|host|etc)($$|/)'
    restart: unless-stopped
    networks:
      - app-network

volumes:
  prometheus_data:
  grafana_data:
```

**Prometheus 설정 (docker/prometheus/prometheus.yml):**

```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  - "rules/*.yml"

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  - job_name: 'spring-boot-app'
    metrics_path: '/actuator/prometheus'
    static_configs:
      - targets: ['app:8080']
    scrape_interval: 5s

  - job_name: 'node-exporter'
    static_configs:
      - targets: ['node-exporter:9100']

  - job_name: 'mysql-exporter'
    static_configs:
      - targets: ['mysql-exporter:9104']
```

## 5. 환경별 설정 관리

### 5.1 프로필별 환경 분리

**개발환경 (docker-compose.override.yml):**
```yaml
version: '3.8'

services:
  app:
    environment:
      SPRING_PROFILES_ACTIVE: dev
      LOGGING_LEVEL_ROOT: DEBUG
      SPRING_JPA_SHOW_SQL: true
      SPRING_JPA_PROPERTIES_HIBERNATE_FORMAT_SQL: true
    volumes:
      # 개발 시 소스 코드 실시간 반영
      - ./src:/app/src:ro
      - ~/.m2:/root/.m2:cached

  mysql:
    environment:
      # 개발환경에서는 보안 설정 완화
      MYSQL_ROOT_HOST: '%'
    volumes:
      # 개발 시 쿼리 로그 확인
      - ./logs/mysql:/var/log/mysql
```

**테스트환경 (docker-compose.test.yml):**
```yaml
version: '3.8'

services:
  app:
    environment:
      SPRING_PROFILES_ACTIVE: test
      SPRING_JPA_HIBERNATE_DDL_AUTO: create-drop
    depends_on:
      mysql-test:
        condition: service_healthy

  mysql-test:
    image: mysql:8.0.35
    container_name: ${PROJECT_NAME:-myapp}-mysql-test
    environment:
      MYSQL_ROOT_PASSWORD: test123
      MYSQL_DATABASE: myapp_test
      MYSQL_USER: test_user
      MYSQL_PASSWORD: test_pass
    ports:
      - "3307:3306"
    tmpfs:
      - /var/lib/mysql  # 메모리에 저장하여 테스트 속도 향상
    command: --innodb-flush-log-at-trx-commit=0 --sync-binlog=0
```

### 5.2 시크릿 관리

**민감정보 분리 (.env.secret):**
```bash
# 데이터베이스 비밀번호
MYSQL_ROOT_PASSWORD=super_secret_root_password
MYSQL_PASSWORD=app_secret_password

# JWT 시크릿
JWT_SECRET=very_long_jwt_secret_key_for_production

# 외부 API 키
EXTERNAL_API_KEY=your_external_api_key_here

# SSL 인증서 경로
SSL_CERT_PATH=/certs/server.crt
SSL_KEY_PATH=/certs/server.key
```

**Docker Secrets 활용:**
```yaml
version: '3.8'

services:
  app:
    secrets:
      - mysql_password
      - jwt_secret
    environment:
      MYSQL_PASSWORD_FILE: /run/secrets/mysql_password
      JWT_SECRET_FILE: /run/secrets/jwt_secret

secrets:
  mysql_password:
    file: ./secrets/mysql_password.txt
  jwt_secret:
    file: ./secrets/jwt_secret.txt
```

## 6. 개발 워크플로우 최적화

### 6.1 빠른 시작을 위한 Makefile

```makefile
# Makefile
.PHONY: help up down restart logs clean build test

# 기본 설정
COMPOSE_FILE := docker-compose.yml
PROJECT_NAME := myapp

# Help 명령어
help: ## 사용 가능한 명령어 표시
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# 환경 시작
up: ## 개발환경 시작
	@echo "🚀 Starting development environment..."
	docker-compose -f $(COMPOSE_FILE) up -d
	@echo "✅ Development environment is ready!"
	@echo "📱 Application: http://localhost:8080"
	@echo "🗄️  Database Admin: http://localhost:8081"
	@echo "🔴 Redis Commander: http://localhost:8082"

# 전체 스택 시작 (모니터링 포함)
up-full: ## 전체 스택 시작 (모니터링 포함)
	@echo "🚀 Starting full stack with monitoring..."
	docker-compose -f $(COMPOSE_FILE) -f docker-compose.monitoring.yml up -d
	@echo "✅ Full stack is ready!"
	@echo "📊 Grafana: http://localhost:3000 (admin/admin123)"
	@echo "📈 Prometheus: http://localhost:9090"

# Kafka 환경 시작
up-kafka: ## Kafka 환경 포함 시작
	@echo "🚀 Starting with Kafka..."
	docker-compose -f $(COMPOSE_FILE) -f docker-compose.kafka.yml up -d
	@echo "✅ Kafka environment is ready!"
	@echo "📨 Kafka UI: http://localhost:8083"

# 환경 중지
down: ## 개발환경 중지
	@echo "🛑 Stopping development environment..."
	docker-compose -f $(COMPOSE_FILE) down

# 환경 재시작
restart: ## 개발환경 재시작
	@echo "🔄 Restarting development environment..."
	docker-compose -f $(COMPOSE_FILE) restart

# 애플리케이션만 재시작
restart-app: ## 애플리케이션만 재시작
	@echo "🔄 Restarting application..."
	docker-compose -f $(COMPOSE_FILE) restart app

# 로그 확인
logs: ## 전체 로그 확인
	docker-compose -f $(COMPOSE_FILE) logs -f

# 특정 서비스 로그
logs-app: ## 애플리케이션 로그 확인
	docker-compose -f $(COMPOSE_FILE) logs -f app

logs-db: ## 데이터베이스 로그 확인
	docker-compose -f $(COMPOSE_FILE) logs -f mysql

# 테스트 실행
test: ## 테스트 실행
	@echo "🧪 Running tests..."
	docker-compose -f $(COMPOSE_FILE) -f docker-compose.test.yml up --build --abort-on-container-exit app-test
	docker-compose -f $(COMPOSE_FILE) -f docker-compose.test.yml down

# 빌드
build: ## 애플리케이션 빌드
	@echo "🔨 Building application..."
	docker-compose -f $(COMPOSE_FILE) build app

# 데이터베이스 초기화
db-reset: ## 데이터베이스 초기화
	@echo "🗑️  Resetting database..."
	docker-compose -f $(COMPOSE_FILE) stop mysql
	docker volume rm $(PROJECT_NAME)_mysql_data || true
	docker-compose -f $(COMPOSE_FILE) up -d mysql
	@echo "✅ Database reset complete!"

# 전체 정리
clean: ## 모든 컨테이너, 이미지, 볼륨 정리
	@echo "🧹 Cleaning up..."
	docker-compose -f $(COMPOSE_FILE) down -v --rmi all
	docker system prune -f
	@echo "✅ Cleanup complete!"

# 개발환경 상태 확인
status: ## 서비스 상태 확인
	@echo "📊 Service Status:"
	docker-compose -f $(COMPOSE_FILE) ps

# 쉘 접속
shell-app: ## 애플리케이션 컨테이너 쉘 접속
	docker-compose -f $(COMPOSE_FILE) exec app bash

shell-db: ## 데이터베이스 컨테이너 쉘 접속
	docker-compose -f $(COMPOSE_FILE) exec mysql mysql -u root -p

# 초기 설정
init: ## 초기 개발환경 설정
	@echo "🎯 Initializing development environment..."
	cp .env.example .env
	mkdir -p logs/mysql logs/app docker/mysql/conf.d
	@echo "✅ Environment initialized!"
	@echo "📝 Please edit .env file with your settings"
```

### 6.2 개발 중 변경사항 반영

**핫 리로드 설정:**

```yaml
# docker-compose.override.yml (개발환경)
version: '3.8'

services:
  app:
    build:
      target: development  # 개발용 Dockerfile 스테이지
    environment:
      SPRING_DEVTOOLS_RESTART_ENABLED: true
      SPRING_DEVTOOLS_LIVERELOAD_ENABLED: true
    volumes:
      # 소스 코드 실시간 반영
      - ./src:/app/src:cached
      # Maven 의존성 캐시
      - ~/.m2:/root/.m2:cached
      # 타겟 디렉토리 공유
      - maven_target:/app/target
    ports:
      - "35729:35729"  # LiveReload 포트

volumes:
  maven_target:
```

**멀티 스테이지 Dockerfile:**

```dockerfile
# Dockerfile
FROM eclipse-temurin:21-jdk as base
WORKDIR /app
COPY pom.xml .
COPY .mvn .mvn
COPY mvnw .
RUN chmod +x mvnw && ./mvnw dependency:go-offline

# 개발 스테이지
FROM base as development
COPY src ./src
RUN ./mvnw compile
EXPOSE 8080 5005
CMD ["./mvnw", "spring-boot:run", "-Dspring-boot.run.jvmArguments='-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5005'"]

# 프로덕션 스테이지  
FROM base as production
COPY src ./src
RUN ./mvnw clean package -DskipTests
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=production /app/target/*.jar app.jar
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
```

## 7. 성능 최적화 및 트러블슈팅

### 7.1 성능 최적화

**이미지 크기 최적화:**

```dockerfile
# .dockerignore
target/
.git/
.gitignore
README.md
.env*
docker-compose*.yml
Makefile
logs/
*.iml
.idea/

# 멀티 스테이지로 최종 이미지 크기 최소화
FROM eclipse-temurin:21-jdk-alpine as builder
WORKDIR /app
COPY pom.xml .
COPY .mvn .mvn  
COPY mvnw .
RUN ./mvnw dependency:go-offline

COPY src ./src
RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring
WORKDIR /app
COPY --from=builder --chown=spring:spring /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
```

**빌드 캐시 최적화:**

```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      cache_from:
        - myapp:latest
        - openjdk:21-jdk
      args:
        BUILDKIT_INLINE_CACHE: 1
```

**리소스 제한 설정:**

```yaml
version: '3.8'

services:
  mysql:
    deploy:
      resources:
        limits:
          memory: 2G
          cpus: '2.0'
        reservations:
          memory: 1G
          cpus: '1.0'
  
  redis:
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '0.5'
        reservations:
          memory: 256M
          cpus: '0.25'

  app:
    deploy:
      resources:
        limits:
          memory: 1G
          cpus: '1.0'
        reservations:
          memory: 512M
          cpus: '0.5'
```

### 7.2 자주 발생하는 문제 해결

**문제 1: 포트 충돌**

```bash
# 에러: port is already allocated
# 해결: 사용 중인 포트 확인 및 변경
lsof -i :3306
kill -9 <PID>

# 또는 .env에서 다른 포트 사용
MYSQL_PORT=3307
REDIS_PORT=6380
```

**문제 2: 볼륨 권한 문제**

```bash
# 에러: Permission denied
# 해결: 볼륨 권한 설정
sudo chown -R $USER:$USER ./logs
chmod 755 ./logs

# Docker Compose에서 user 설정
services:
  app:
    user: "${UID:-1000}:${GID:-1000}"
```

**문제 3: 메모리 부족**

```bash
# Docker Desktop 메모리 설정 확인
docker system df
docker system prune -f

# 불필요한 이미지 정리
docker image prune -a
```

**문제 4: 네트워크 연결 문제**

```bash
# 컨테이너 간 통신 확인
docker-compose exec app ping mysql
docker-compose exec app nslookup redis

# 네트워크 상태 확인
docker network ls
docker network inspect myapp_app-network
```

**트러블슈팅 스크립트 (troubleshoot.sh):**

```bash
#!/bin/bash

echo "🔍 Docker Compose 환경 진단 시작..."

# 1. Docker 상태 확인
echo "📋 Docker 상태:"
docker --version
docker-compose --version

# 2. 서비스 상태 확인
echo "📊 서비스 상태:"
docker-compose ps

# 3. 네트워크 연결 확인
echo "🌐 네트워크 연결 테스트:"
docker-compose exec -T app ping -c 3 mysql || echo "❌ MySQL 연결 실패"
docker-compose exec -T app ping -c 3 redis || echo "❌ Redis 연결 실패"

# 4. 포트 확인
echo "🔌 포트 상태:"
netstat -tlnp | grep :8080 || echo "❌ 8080 포트 미사용"
netstat -tlnp | grep :3306 || echo "❌ 3306 포트 미사용"
netstat -tlnp | grep :6379 || echo "❌ 6379 포트 미사용"

# 5. 로그 확인
echo "📝 최근 에러 로그:"
docker-compose logs --tail=50 app | grep -i error || echo "✅ 에러 없음"

# 6. 디스크 사용량
echo "💾 Docker 디스크 사용량:"
docker system df

echo "✅ 진단 완료!"
```

## 8. CI/CD 연동

### 8.1 GitHub Actions와 연동

**테스트 워크플로우 (.github/workflows/test.yml):**

```yaml
name: Test with Docker Compose

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

env:
  COMPOSE_FILE: docker-compose.yml:docker-compose.test.yml

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
    
    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v3
    
    - name: Cache Docker layers
      uses: actions/cache@v3
      with:
        path: /tmp/.buildx-cache
        key: ${{ runner.os }}-buildx-${{ github.sha }}
        restore-keys: |
          ${{ runner.os }}-buildx-
    
    - name: Create test environment file
      run: |
        cat > .env << EOF
        PROJECT_NAME=test-app
        SPRING_PROFILES_ACTIVE=test
        MYSQL_ROOT_PASSWORD=test123
        MYSQL_DATABASE=myapp_test
        MYSQL_USER=test_user
        MYSQL_PASSWORD=test_pass
        MYSQL_PORT=3306
        REDIS_PORT=6379
        APP_PORT=8080
        EOF
    
    - name: Build and run tests
      run: |
        docker-compose -f docker-compose.yml -f docker-compose.test.yml up --build --abort-on-container-exit
        TEST_EXIT_CODE=$?
        docker-compose -f docker-compose.yml -f docker-compose.test.yml down -v
        exit $TEST_EXIT_CODE
    
    - name: Upload test results
      uses: actions/upload-artifact@v3
      if: always()
      with:
        name: test-results
        path: |
          target/surefire-reports/
          target/jacoco/
```

### 8.2 배포 환경과의 연계

**스테이징 환경 구성:**

```yaml
# docker-compose.staging.yml
version: '3.8'

services:
  app:
    image: myapp:${TAG:-latest}
    environment:
      SPRING_PROFILES_ACTIVE: staging
      SPRING_DATASOURCE_URL: jdbc:mysql://staging-db:3306/myapp_staging
    deploy:
      replicas: 2
      resources:
        limits:
          memory: 1G
          cpus: '1.0'
      restart_policy:
        condition: on-failure
        delay: 5s
        max_attempts: 3

  nginx:
    image: nginx:1.25-alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/staging.conf:/etc/nginx/nginx.conf:ro
      - ./certs:/etc/nginx/certs:ro
    depends_on:
      - app
```

## 9. 팀 협업을 위한 베스트 프랙티스

### 9.1 문서화 및 가이드

**README.md 개발환경 섹션:**

```markdown
# 개발환경 설정

## 빠른 시작

1. **사전 요구사항**
   - Docker Desktop 4.24+
   - Git
   - Make (선택사항)

2. **환경 구성**
   ```bash
   git clone https://github.com/your-org/myapp.git
   cd myapp
   cp .env.example .env
   make init
   make up
   ```

3. **서비스 접속**
   - 애플리케이션: http://localhost:8080
   - 데이터베이스 관리: http://localhost:8081
   - Redis 관리: http://localhost:8082

## 주요 명령어

| 명령어 | 설명 |
|--------|------|
| `make up` | 개발환경 시작 |
| `make down` | 개발환경 중지 |
| `make logs` | 전체 로그 확인 |
| `make test` | 테스트 실행 |
| `make clean` | 환경 초기화 |

## 트러블슈팅

문제가 발생하면 `./troubleshoot.sh` 스크립트를 실행하여 진단해보세요.
```

### 9.2 새로운 팀원 온보딩

**온보딩 스크립트 (onboard.sh):**

```bash
#!/bin/bash

echo "🎯 새로운 팀원 온보딩을 시작합니다..."

# 1. 사전 요구사항 확인
echo "📋 사전 요구사항 확인..."

# Docker 설치 확인
if ! command -v docker &> /dev/null; then
    echo "❌ Docker가 설치되지 않았습니다."
    echo "📥 https://docs.docker.com/get-docker/ 에서 Docker를 설치해주세요."
    exit 1
fi

# Docker Compose 확인
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose가 설치되지 않았습니다."
    exit 1
fi

echo "✅ Docker 및 Docker Compose 설치 확인됨"

# 2. 환경 파일 설정
echo "⚙️  환경 설정..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "📝 .env 파일이 생성되었습니다. 필요시 수정해주세요."
fi

# 3. 초기 디렉토리 생성
mkdir -p logs/mysql logs/app docker/mysql/conf.d

# 4. 개발환경 시작
echo "🚀 개발환경을 시작합니다..."
docker-compose up -d

# 5. 헬스체크 대기
echo "⏳ 서비스 시작을 기다리는 중..."
sleep 30

# 6. 서비스 상태 확인
echo "📊 서비스 상태 확인..."
docker-compose ps

# 7. 연결 테스트
echo "🔗 연결 테스트..."
curl -f http://localhost:8080/actuator/health > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ 애플리케이션 정상 동작"
else
    echo "❌ 애플리케이션 연결 실패"
fi

echo ""
echo "🎉 온보딩 완료!"
echo "📱 애플리케이션: http://localhost:8080"
echo "🗄️  데이터베이스 관리: http://localhost:8081"
echo "🔴 Redis 관리: http://localhost:8082"
echo ""
echo "📚 자세한 사용법은 README.md를 참고하세요."
echo "❓ 문제가 있으면 팀 채널에서 문의해주세요."
```

### 9.3 환경 설정 버전 관리

**설정 파일 구조:**

```
config/
├── .env.example          # 예제 환경변수 (커밋)
├── .env.development      # 개발환경 설정 (커밋)
├── .env.test            # 테스트환경 설정 (커밋)
├── .env.staging         # 스테이징환경 설정 (커밋)
└── .env.local           # 개인 로컬 설정 (gitignore)
```

**.gitignore 설정:**

```gitignore
# 환경 파일
.env
.env.local
.env.*.local

# 로그 파일
logs/
*.log

# Docker 볼륨 데이터
docker/mysql/data/
docker/redis/data/

# IDE 설정
.idea/
*.iml
.vscode/
```

## 10. 마무리

### Docker Compose 도입 효과

**도입 전 vs 도입 후:**

| 항목 | 도입 전 | 도입 후 |
|------|---------|---------|
| **환경 구성 시간** | 2-3시간 | 5분 |
| **환경 일관성** | 개발자마다 다름 | 완전 동일 |
| **새 팀원 온보딩** | 1-2일 | 30분 |
| **로컬 시스템 영향** | 많은 의존성 설치 | 격리된 환경 |
| **문제 재현** | 어려움 | 쉬움 |
| **서비스 확장** | 복잡한 설정 | 설정 추가만 |

### 추가 고려사항

**보안 측면:**
- 프로덕션 환경에서는 Docker Secrets 또는 외부 Secret 관리 도구 사용
- 컨테이너 이미지 취약점 스캔 (Trivy, Clair)
- 네트워크 정책 및 방화벽 설정

**모니터링 및 로깅:**
- 중앙집중식 로깅 (ELK Stack, Fluentd)
- 애플리케이션 성능 모니터링 (APM)
- 인프라 모니터링 (Prometheus + Grafana)

**백업 및 복구:**
- 데이터베이스 자동 백업 스케줄링
- 볼륨 데이터 백업 전략
- 재해 복구 절차 문서화

### 다음 단계 로드맵

1. **Kubernetes 전환 준비**
   - Helm 차트 작성
   - ConfigMap 및 Secret 관리
   - Ingress 및 Service 설정

2. **GitOps 도입**
   - ArgoCD 또는 Flux 활용
   - 선언적 인프라 관리
   - 자동 배포 파이프라인

3. **서비스 메시 도입**
   - Istio 또는 Linkerd
   - 마이크로서비스 간 통신 보안
   - 트래픽 관리 및 모니터링

### 최종 점검 체크리스트

**개발팀 도입 전 체크리스트:**

- [ ] Docker Desktop 설치 및 팀 교육 완료
- [ ] 환경 파일 및 설정 문서화
- [ ] 트러블슈팅 가이드 작성
- [ ] CI/CD 파이프라인 통합 테스트
- [ ] 백업 및 복구 절차 수립
- [ ] 보안 정책 수립 및 적용
- [ ] 성능 벤치마크 및 모니터링 설정
- [ ] 팀 온보딩 프로세스 정의

Docker Compose를 활용한 개발환경 표준화는 단순히 기술적 개선을 넘어서 **팀의 생산성과 협업 품질을 혁신**하는 중요한 투자입니다. 

초기 설정에 시간을 투자하면, 장기적으로 엄청난 시간 절약과 안정성 향상을 얻을 수 있습니다. 무엇보다 "내 컴퓨터에서는 잘 되는데?"라는 말을 더 이상 듣지 않게 될 것입니다! 🚀

## 참고 자료

- [Docker Compose Official Documentation](https://docs.docker.com/compose/)
- [Spring Boot Docker Guide](https://spring.io/guides/topicals/spring-boot-docker/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [12 Factor App](https://12factor.net/)

---

**태그**: #Docker #Docker-Compose #Development-Environment #DevOps #Spring-Boot #MySQL #Redis #Kafka #Productivity