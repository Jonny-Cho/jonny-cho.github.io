---
title: '대용량 트래픽 처리를 위한 Spring Boot 성능 최적화: JVM 튜닝부터 아키텍처까지'
date: 2025-07-19 10:00:00
categories: spring performance
draft: false
tags: ['Spring Boot', 'Performance', 'JVM', 'Optimization', 'Architecture', 'Tuning']
toc: true
---

# 대용량 트래픽 처리를 위한 Spring Boot 성능 최적화: JVM 튜닝부터 아키텍처까지

서비스가 성장하면서 피할 수 없는 숙제가 바로 **성능 최적화**입니다. 처음에는 몇 백 명의 사용자도 버거웠던 시스템이 수만 명, 수십만 명의 동시 사용자를 감당해야 하는 상황이 됩니다. 이번 글에서는 실무에서 겪은 성능 병목 지점들과 이를 해결한 구체적인 방법들을 단계별로 정리해보겠습니다.

## 1. 성능 최적화, 왜 필요한가?

### 1.1 실무에서 겪는 성능 문제들

**사용자 경험 악화:**
```
- 페이지 로딩 시간 3초 → 40% 이탈률 증가
- API 응답 시간 1초 → 사용자 만족도 급감
- 시스템 다운 → 비즈니스 손실 직결
```

**비용 증가:**
```
성능 최적화 없는 확장 = 서버 비용 10배 증가
최적화 후 확장 = 서버 비용 2-3배 증가
```

**개발팀 생산성 저하:**
```
- 장애 대응으로 인한 개발 리소스 소모
- 임시방편 해결책의 기술 부채 누적
- 새로운 기능 개발 지연
```

### 1.2 성능 최적화의 우선순위

실무에서는 **측정 → 병목 식별 → 개선 → 재측정** 순서로 접근해야 합니다.

```
1. 모니터링 구축 (가장 중요!)
2. 병목 지점 식별
3. 영향도 큰 순서대로 개선
4. 성능 테스트로 검증
5. 지속적인 모니터링
```

## 2. 성능 모니터링: 문제를 찾아야 해결할 수 있다

### 2.1 APM 도구 도입

**Pinpoint 설정 (오픈소스 APM)**

```yaml
# docker-compose.yml
version: '3.8'
services:
  pinpoint-hbase:
    image: pinpointdocker/pinpoint-hbase:2.5.1
    container_name: pinpoint-hbase
    
  pinpoint-web:
    image: pinpointdocker/pinpoint-web:2.5.1
    container_name: pinpoint-web
    depends_on:
      - pinpoint-hbase
    ports:
      - "8080:8080"
    environment:
      - CLUSTER_ENABLE=true
      - HBASE_HOST=pinpoint-hbase
      
  pinpoint-collector:
    image: pinpointdocker/pinpoint-collector:2.5.1
    container_name: pinpoint-collector
    depends_on:
      - pinpoint-hbase
    ports:
      - "9994:9994"
      - "9995:9995"
      - "9996:9996"
```

**Spring Boot 애플리케이션에 Agent 적용:**

```bash
# JVM 옵션에 Pinpoint Agent 추가
java -javaagent:/path/to/pinpoint-bootstrap.jar \
     -Dpinpoint.agentId=my-app-01 \
     -Dpinpoint.applicationName=my-application \
     -jar my-app.jar
```

### 2.2 JVM 메트릭 모니터링

**Micrometer + Prometheus 설정:**

```xml
<!-- pom.xml -->
<dependency>
    <groupId>io.micrometer</groupId>
    <artifactId>micrometer-registry-prometheus</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

```yaml
# application.yml
management:
  endpoints:
    web:
      exposure:
        include: prometheus, metrics, health
  endpoint:
    metrics:
      enabled: true
    prometheus:
      enabled: true
  metrics:
    export:
      prometheus:
        enabled: true
```

**커스텀 메트릭 수집:**

```java
@Component
public class PerformanceMetrics {
    
    private final MeterRegistry meterRegistry;
    private final Counter errorCounter;
    private final Timer responseTimer;
    
    public PerformanceMetrics(MeterRegistry meterRegistry) {
        this.meterRegistry = meterRegistry;
        this.errorCounter = Counter.builder("api.errors")
            .description("API error count")
            .register(meterRegistry);
        this.responseTimer = Timer.builder("api.response.time")
            .description("API response time")
            .register(meterRegistry);
    }
    
    public void recordError(String endpoint, String errorType) {
        errorCounter.increment(
            Tags.of("endpoint", endpoint, "error.type", errorType)
        );
    }
    
    public void recordResponseTime(String endpoint, Duration duration) {
        responseTimer.record(duration, Tags.of("endpoint", endpoint));
    }
}
```

## 3. JVM 튜닝: 기반부터 탄탄하게

### 3.1 힙 메모리 최적화

**메모리 사용량 분석:**

```bash
# 힙 덤프 생성
jcmd <pid> GC.run_finalization
jcmd <pid> VM.gc
jmap -dump:format=b,file=heap.hprof <pid>

# VisualVM 또는 Eclipse MAT로 분석
```

**최적화된 JVM 옵션:**

```bash
# 프로덕션 환경 JVM 설정 (16GB 서버 기준)
java -server \
     -Xms8g -Xmx8g \
     -XX:+UseG1GC \
     -XX:MaxGCPauseMillis=100 \
     -XX:G1HeapRegionSize=16m \
     -XX:+ParallelRefProcEnabled \
     -XX:+UseStringDeduplication \
     -XX:+UnlockExperimentalVMOptions \
     -XX:+UseCGroupMemoryLimitForHeap \
     -Djava.awt.headless=true \
     -Dfile.encoding=UTF-8 \
     -jar my-app.jar
```

**메모리 설정 가이드라인:**
- **Heap Size**: 물리 메모리의 50-75%
- **Young Generation**: Heap의 25-40%
- **Old Generation**: 나머지

### 3.2 가비지 컬렉터 선택과 튜닝

**G1GC 튜닝 (Java 8+):**

```bash
# G1GC 상세 설정
-XX:+UseG1GC
-XX:MaxGCPauseMillis=100          # 목표 GC 중단 시간
-XX:G1HeapRegionSize=16m          # 리전 크기
-XX:G1NewSizePercent=20           # Young Generation 최소 비율
-XX:G1MaxNewSizePercent=30        # Young Generation 최대 비율
-XX:G1ReservePercent=15           # 여유 공간
-XX:ConcGCThreads=4               # 동시 GC 스레드 수
```

**ZGC 적용 (Java 17+, 대용량 힙):**

```bash
# ZGC 설정 (64GB+ 힙 메모리)
-XX:+UnlockExperimentalVMOptions
-XX:+UseZGC
-XX:SoftMaxHeapSize=30g           # 소프트 제한
-Xmx32g                           # 하드 제한
```

**GC 로그 분석:**

```bash
# GC 로그 활성화
-Xlog:gc*:gc.log:time,level,tags
-XX:+UseGCLogFileRotation
-XX:NumberOfGCLogFiles=10
-XX:GCLogFileSize=10M
```

```java
@Component
public class GCMonitor {
    
    private final Logger logger = LoggerFactory.getLogger(GCMonitor.class);
    
    @EventListener
    public void handleGCEvent(GCEvent event) {
        if (event.getPauseTime() > Duration.ofMillis(200)) {
            logger.warn("Long GC pause detected: {}ms, Type: {}, Before: {}MB, After: {}MB",
                event.getPauseTime().toMillis(),
                event.getGcType(),
                event.getMemoryUsageBeforeGc() / 1024 / 1024,
                event.getMemoryUsageAfterGc() / 1024 / 1024
            );
        }
    }
}
```

### 3.3 스레드 풀 최적화

**적정 스레드 수 계산:**

```
CPU 집약적 작업: 스레드 수 = CPU 코어 수 + 1
I/O 집약적 작업: 스레드 수 = CPU 코어 수 × (1 + 대기시간/처리시간)

예시: 8코어, API 처리시간 50ms, DB 대기시간 200ms
스레드 수 = 8 × (1 + 200/50) = 8 × 5 = 40
```

**스레드 풀 모니터링:**

```java
@Component
public class ThreadPoolMonitor {
    
    private final MeterRegistry meterRegistry;
    
    @Autowired
    private ThreadPoolTaskExecutor taskExecutor;
    
    @Scheduled(fixedRate = 5000)
    public void monitorThreadPool() {
        Gauge.builder("thread.pool.active")
            .register(meterRegistry, taskExecutor, ThreadPoolTaskExecutor::getActiveCount);
        
        Gauge.builder("thread.pool.queue.size")
            .register(meterRegistry, taskExecutor, executor -> executor.getThreadPoolExecutor().getQueue().size());
        
        Gauge.builder("thread.pool.max")
            .register(meterRegistry, taskExecutor, ThreadPoolTaskExecutor::getMaxPoolSize);
    }
}
```

## 4. Spring Boot 애플리케이션 최적화

### 4.1 Tomcat 설정 최적화

```yaml
# application.yml
server:
  tomcat:
    threads:
      max: 200                    # 최대 스레드 수
      min-spare: 20               # 최소 대기 스레드 수
    max-connections: 8192         # 최대 동시 연결 수
    accept-count: 200             # 큐 대기 연결 수
    connection-timeout: 20000     # 연결 타임아웃 (20초)
    keep-alive-timeout: 20000     # Keep-Alive 타임아웃
    max-keep-alive-requests: 100  # Keep-Alive 최대 요청 수
  compression:
    enabled: true
    mime-types: 
      - application/json
      - application/xml
      - text/html
      - text/xml
      - text/plain
      - text/css
      - text/javascript
      - application/javascript
    min-response-size: 1024
```

**Undertow로 변경 (더 나은 성능):**

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
    <exclusions>
        <exclusion>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-tomcat</artifactId>
        </exclusion>
    </exclusions>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-undertow</artifactId>
</dependency>
```

```yaml
server:
  undertow:
    threads:
      io: 16                      # I/O 스레드 (CPU 코어 수 * 2)
      worker: 200                 # 워커 스레드
    buffer-size: 16384            # 버퍼 크기 (16KB)
    direct-buffers: true          # 다이렉트 버퍼 사용
```

### 4.2 비동기 처리 최적화

**비동기 컨트롤러:**

```java
@RestController
public class AsyncController {
    
    @Autowired
    private UserService userService;
    
    @GetMapping("/users/{id}")
    public CompletableFuture<ResponseEntity<User>> getUser(@PathVariable Long id) {
        return userService.getUserAsync(id)
            .thenApply(user -> ResponseEntity.ok(user))
            .exceptionally(throwable -> {
                logger.error("Error getting user", throwable);
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            });
    }
    
    @GetMapping("/users/{id}/profile")
    public DeferredResult<ResponseEntity<UserProfile>> getUserProfile(@PathVariable Long id) {
        DeferredResult<ResponseEntity<UserProfile>> deferredResult = 
            new DeferredResult<>(5000L); // 5초 타임아웃
        
        deferredResult.onTimeout(() -> 
            deferredResult.setErrorResult(
                ResponseEntity.status(HttpStatus.REQUEST_TIMEOUT).build()
            )
        );
        
        userService.getUserProfileAsync(id)
            .whenComplete((profile, throwable) -> {
                if (throwable != null) {
                    deferredResult.setErrorResult(
                        ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build()
                    );
                } else {
                    deferredResult.setResult(ResponseEntity.ok(profile));
                }
            });
        
        return deferredResult;
    }
}
```

**WebFlux 도입 (리액티브 스택):**

```java
@RestController
public class ReactiveController {
    
    @Autowired
    private ReactiveUserService userService;
    
    @GetMapping("/users")
    public Flux<User> getUsers() {
        return userService.getAllUsers()
            .doOnSubscribe(subscription -> logger.info("Starting user stream"))
            .doOnComplete(() -> logger.info("User stream completed"))
            .onErrorResume(throwable -> {
                logger.error("Error in user stream", throwable);
                return Flux.empty();
            });
    }
    
    @GetMapping("/users/{id}")
    public Mono<ResponseEntity<User>> getUser(@PathVariable Long id) {
        return userService.getUser(id)
            .map(ResponseEntity::ok)
            .defaultIfEmpty(ResponseEntity.notFound().build())
            .onErrorReturn(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build());
    }
}
```

### 4.3 캐시 최적화

**다층 캐시 전략:**

```java
@Service
public class OptimizedUserService {
    
    private final LoadingCache<Long, User> localCache;
    private final RedisTemplate<String, User> redisTemplate;
    private final UserRepository userRepository;
    
    public OptimizedUserService(UserRepository userRepository, 
                               RedisTemplate<String, User> redisTemplate) {
        this.userRepository = userRepository;
        this.redisTemplate = redisTemplate;
        this.localCache = Caffeine.newBuilder()
            .maximumSize(1000)
            .expireAfterWrite(Duration.ofMinutes(5))
            .recordStats()
            .build(this::loadUserFromRedisOrDb);
    }
    
    public User getUser(Long id) {
        try {
            // 1차: 로컬 캐시
            return localCache.get(id);
        } catch (Exception e) {
            logger.error("Cache error for user {}", id, e);
            // 캐시 실패 시 직접 DB 조회
            return userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found: " + id));
        }
    }
    
    private User loadUserFromRedisOrDb(Long id) {
        // 2차: Redis 캐시
        String key = "user:" + id;
        User user = redisTemplate.opsForValue().get(key);
        
        if (user != null) {
            return user;
        }
        
        // 3차: 데이터베이스
        user = userRepository.findById(id)
            .orElseThrow(() -> new UserNotFoundException("User not found: " + id));
        
        // Redis에 캐시 (TTL 1시간)
        redisTemplate.opsForValue().set(key, user, Duration.ofHours(1));
        
        return user;
    }
    
    @Scheduled(fixedRate = 60000)
    public void reportCacheStats() {
        CacheStats stats = localCache.stats();
        logger.info("Local cache stats - Hit rate: {:.2f}%, Miss count: {}, Eviction count: {}",
            stats.hitRate() * 100,
            stats.missCount(),
            stats.evictionCount()
        );
    }
}
```

## 5. 데이터베이스 연결 최적화

### 5.1 Connection Pool 튜닝

**HikariCP 최적화:**

```yaml
spring:
  datasource:
    hikari:
      maximum-pool-size: 20                    # 최대 커넥션 수
      minimum-idle: 5                          # 최소 유휴 커넥션 수
      connection-timeout: 20000                # 커넥션 타임아웃 (20초)
      idle-timeout: 300000                     # 유휴 타임아웃 (5분)
      max-lifetime: 1200000                    # 커넥션 최대 생명 시간 (20분)
      validation-timeout: 5000                 # 커넥션 검증 타임아웃
      leak-detection-threshold: 60000          # 커넥션 누수 감지 (1분)
      pool-name: HikariPool-1
      register-mbeans: true                    # JMX 모니터링 활성화
```

**적정 Pool Size 계산:**

```
Pool Size = ((코어 수 × 2) + 디스크 수)

예시: 8코어, SSD 1개
Pool Size = (8 × 2) + 1 = 17 ≈ 20

단, 다음 요소들도 고려:
- 평균 쿼리 실행 시간
- 동시 접속자 수
- 애플리케이션 인스턴스 수
```

**Connection Pool 모니터링:**

```java
@Component
public class ConnectionPoolMonitor {
    
    @Autowired
    private HikariDataSource dataSource;
    
    @Autowired
    private MeterRegistry meterRegistry;
    
    @PostConstruct
    public void setupMonitoring() {
        Gauge.builder("hikari.connections.active")
            .register(meterRegistry, dataSource.getHikariPoolMXBean(), 
                pool -> pool.getActiveConnections());
        
        Gauge.builder("hikari.connections.idle")
            .register(meterRegistry, dataSource.getHikariPoolMXBean(),
                pool -> pool.getIdleConnections());
        
        Gauge.builder("hikari.connections.total")
            .register(meterRegistry, dataSource.getHikariPoolMXBean(),
                pool -> pool.getTotalConnections());
    }
    
    @Scheduled(fixedRate = 30000)
    public void logPoolStats() {
        HikariPoolMXBean pool = dataSource.getHikariPoolMXBean();
        if (pool.getActiveConnections() > pool.getTotalConnections() * 0.8) {
            logger.warn("Connection pool usage high: {}/{}", 
                pool.getActiveConnections(), pool.getTotalConnections());
        }
    }
}
```

### 5.2 쿼리 최적화

**슬로우 쿼리 모니터링:**

```yaml
spring:
  jpa:
    properties:
      hibernate:
        session.events.log.LOG_QUERIES_SLOWER_THAN_MS: 100  # 100ms 이상 쿼리 로깅
    show-sql: false  # 프로덕션에서는 false
logging:
  level:
    org.hibernate.SQL: DEBUG
    org.hibernate.type.descriptor.sql.BasicBinder: TRACE
```

**배치 처리 최적화:**

```java
@Repository
public class OptimizedUserRepository {
    
    @PersistenceContext
    private EntityManager entityManager;
    
    @Transactional
    public void batchInsertUsers(List<User> users) {
        int batchSize = 50;
        
        for (int i = 0; i < users.size(); i++) {
            entityManager.persist(users.get(i));
            
            if (i % batchSize == 0 && i > 0) {
                entityManager.flush();
                entityManager.clear();
            }
        }
        
        entityManager.flush();
        entityManager.clear();
    }
    
    @Transactional
    public void batchUpdateUsers(List<User> users) {
        String sql = """
            UPDATE users 
            SET name = :name, email = :email, updated_at = :updatedAt 
            WHERE id = :id
            """;
        
        Query query = entityManager.createNativeQuery(sql);
        
        for (User user : users) {
            query.setParameter("name", user.getName())
                 .setParameter("email", user.getEmail())
                 .setParameter("updatedAt", LocalDateTime.now())
                 .setParameter("id", user.getId());
            query.executeUpdate();
        }
    }
}
```

### 5.3 읽기/쓰기 분리

**Master/Slave 설정:**

```java
@Configuration
public class DatabaseConfig {
    
    @Bean
    @Primary
    @ConfigurationProperties("spring.datasource.master")
    public DataSource masterDataSource() {
        return DataSourceBuilder.create().build();
    }
    
    @Bean
    @ConfigurationProperties("spring.datasource.slave")
    public DataSource slaveDataSource() {
        return DataSourceBuilder.create().build();
    }
    
    @Bean
    public DataSource routingDataSource() {
        ReplicationRoutingDataSource routingDataSource = new ReplicationRoutingDataSource();
        
        Map<Object, Object> dataSourceMap = new HashMap<>();
        dataSourceMap.put("master", masterDataSource());
        dataSourceMap.put("slave", slaveDataSource());
        
        routingDataSource.setTargetDataSources(dataSourceMap);
        routingDataSource.setDefaultTargetDataSource(masterDataSource());
        
        return routingDataSource;
    }
}

public class ReplicationRoutingDataSource extends AbstractRoutingDataSource {
    
    @Override
    protected Object determineCurrentLookupKey() {
        return TransactionSynchronizationManager.isCurrentTransactionReadOnly() ? "slave" : "master";
    }
}
```

**읽기/쓰기 분리 활용:**

```java
@Service
@Transactional(readOnly = true)  // 기본적으로 읽기 전용 (Slave 사용)
public class UserService {
    
    @Transactional  // 쓰기 작업 (Master 사용)
    public User createUser(UserCreateRequest request) {
        User user = new User(request.getName(), request.getEmail());
        return userRepository.save(user);
    }
    
    // 읽기 작업 (Slave 사용)
    public User getUser(Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new UserNotFoundException("User not found"));
    }
    
    // 읽기 작업 (Slave 사용)
    public Page<User> getUsers(Pageable pageable) {
        return userRepository.findAll(pageable);
    }
}
```

## 6. 아키텍처 레벨 최적화

### 6.1 로드 밸런서 설정

**Nginx 설정:**

```nginx
upstream backend {
    least_conn;                              # 연결 수가 적은 서버 우선
    server app1:8080 max_fails=3 fail_timeout=30s;
    server app2:8080 max_fails=3 fail_timeout=30s;
    server app3:8080 max_fails=3 fail_timeout=30s;
    keepalive 32;                           # Keep-alive 연결 수
}

server {
    listen 80;
    server_name api.example.com;
    
    # Gzip 압축
    gzip on;
    gzip_types application/json application/javascript text/css text/javascript;
    gzip_min_length 1000;
    
    # 클라이언트 요청 크기 제한
    client_max_body_size 10M;
    
    # 타임아웃 설정
    proxy_connect_timeout 10s;
    proxy_send_timeout 30s;
    proxy_read_timeout 30s;
    
    location /api/ {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Keep-alive 설정
        proxy_http_version 1.1;
        proxy_set_header Connection "";
        
        # 캐시 설정 (정적 리소스)
        location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # Health Check 엔드포인트
    location /health {
        access_log off;
        proxy_pass http://backend/actuator/health;
    }
}
```

### 6.2 CDN 및 정적 리소스 최적화

**AWS CloudFront 설정 예시:**

```yaml
# cloudformation.yml
Resources:
  CloudFrontDistribution:
    Type: AWS::CloudFront::Distribution
    Properties:
      DistributionConfig:
        Origins:
          - Id: ApiOrigin
            DomainName: api.example.com
            CustomOriginConfig:
              HTTPPort: 80
              HTTPSPort: 443
              OriginProtocolPolicy: https-only
        DefaultCacheBehavior:
          TargetOriginId: ApiOrigin
          ViewerProtocolPolicy: redirect-to-https
          CachePolicyId: 4135ea2d-6df8-44a3-9df3-4b5a84be39ad  # Managed-CachingDisabled
          Compress: true
        CacheBehaviors:
          - PathPattern: "/static/*"
            TargetOriginId: ApiOrigin
            ViewerProtocolPolicy: redirect-to-https
            CachePolicyId: 658327ea-f89d-4fab-a63d-7e88639e58f6  # Managed-CachingOptimized
            TTL: 31536000  # 1년
```

**정적 리소스 최적화:**

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/static/**")
            .addResourceLocations("classpath:/static/")
            .setCacheControl(CacheControl.maxAge(Duration.ofDays(365))
                .cachePublic())
            .resourceChain(true)
            .addResolver(new VersionResourceResolver()
                .addContentVersionStrategy("/**"));
    }
    
    @Override
    public void configureContentNegotiation(ContentNegotiationConfigurer configurer) {
        configurer.favorParameter(false)
            .ignoreAcceptHeader(false)
            .defaultContentType(MediaType.APPLICATION_JSON)
            .mediaType("json", MediaType.APPLICATION_JSON)
            .mediaType("xml", MediaType.APPLICATION_XML);
    }
}
```

## 7. 성능 테스트 및 측정

### 7.1 JMeter 부하 테스트

**기본 부하 테스트 시나리오:**

```xml
<!-- jmeter-test-plan.jmx -->
<?xml version="1.0" encoding="UTF-8"?>
<jmeterTestPlan version="1.2">
  <hashTree>
    <TestPlan guiclass="TestPlanGui" testclass="TestPlan" testname="API Performance Test">
      <stringProp name="TestPlan.arguments"></stringProp>
      <boolProp name="TestPlan.functional_mode">false</boolProp>
      <boolProp name="TestPlan.serialize_threadgroups">false</boolProp>
    </TestPlan>
    <hashTree>
      <ThreadGroup guiclass="ThreadGroupGui" testclass="ThreadGroup" testname="User Load">
        <stringProp name="ThreadGroup.on_sample_error">continue</stringProp>
        <elementProp name="ThreadGroup.main_controller" elementType="LoopController">
          <boolProp name="LoopController.continue_forever">false</boolProp>
          <stringProp name="LoopController.loops">100</stringProp>
        </elementProp>
        <stringProp name="ThreadGroup.num_threads">50</stringProp>
        <stringProp name="ThreadGroup.ramp_time">30</stringProp>
      </ThreadGroup>
    </hashTree>
  </hashTree>
</jmeterTestPlan>
```

**자동화된 성능 테스트:**

```bash
#!/bin/bash
# performance-test.sh

echo "Starting performance test..."

# JMeter 실행
jmeter -n -t api-test-plan.jmx -l results.jtl -e -o report

# 결과 분석
python3 analyze-results.py results.jtl

# 임계값 체크
RESPONSE_TIME_P95=$(grep "95th percentile" report/statistics.json | cut -d: -f2)
ERROR_RATE=$(grep "Error rate" report/statistics.json | cut -d: -f2)

if [ "$RESPONSE_TIME_P95" -gt 1000 ]; then
    echo "❌ 95th percentile response time too high: ${RESPONSE_TIME_P95}ms"
    exit 1
fi

if [ "$ERROR_RATE" -gt 1 ]; then
    echo "❌ Error rate too high: ${ERROR_RATE}%"
    exit 1
fi

echo "✅ Performance test passed"
```

### 7.2 지속적 성능 모니터링

**자동 알림 설정:**

```java
@Component
public class PerformanceAlert {
    
    private final SlackWebhookClient slackClient;
    private final MeterRegistry meterRegistry;
    
    @Scheduled(fixedRate = 60000)  // 1분마다 체크
    public void checkPerformanceMetrics() {
        // 응답 시간 체크
        Timer responseTimer = meterRegistry.find("http.server.requests").timer();
        if (responseTimer != null) {
            Duration p95 = Duration.ofNanos((long) responseTimer.percentile(0.95));
            if (p95.toMillis() > 1000) {  // 1초 초과
                sendAlert("High Response Time", 
                    String.format("95th percentile response time: %dms", p95.toMillis()));
            }
        }
        
        // 에러율 체크
        Counter errorCounter = meterRegistry.find("http.server.requests")
            .tag("status", "5xx").counter();
        Counter totalCounter = meterRegistry.find("http.server.requests").counter();
        
        if (errorCounter != null && totalCounter != null) {
            double errorRate = (errorCounter.count() / totalCounter.count()) * 100;
            if (errorRate > 5.0) {  // 5% 초과
                sendAlert("High Error Rate", 
                    String.format("Error rate: %.2f%%", errorRate));
            }
        }
        
        // 메모리 사용량 체크
        MemoryMXBean memoryBean = ManagementFactory.getMemoryMXBean();
        MemoryUsage heapUsage = memoryBean.getHeapMemoryUsage();
        double heapUsagePercent = (double) heapUsage.getUsed() / heapUsage.getMax() * 100;
        
        if (heapUsagePercent > 80) {  // 80% 초과
            sendAlert("High Memory Usage", 
                String.format("Heap usage: %.2f%%", heapUsagePercent));
        }
    }
    
    private void sendAlert(String title, String message) {
        slackClient.send(SlackMessage.builder()
            .channel("#alerts")
            .username("Performance Bot")
            .text(String.format("🚨 %s: %s", title, message))
            .build());
    }
}
```

## 8. 실무 적용 사례와 결과

### 8.1 Before/After 성능 비교

**최적화 전:**
```
- 평균 응답 시간: 2.5초
- 95th percentile: 8초
- 처리량: 50 TPS
- 에러율: 15%
- 서버 리소스: CPU 80%, Memory 90%
```

**최적화 후:**
```
- 평균 응답 시간: 300ms (83% 개선)
- 95th percentile: 800ms (90% 개선)
- 처리량: 300 TPS (6배 향상)
- 에러율: 0.5% (30배 개선)
- 서버 리소스: CPU 40%, Memory 60%
```

### 8.2 최적화 단계별 효과

**1단계: JVM 튜닝**
- G1GC 적용 + 힙 메모리 최적화
- 응답 시간 30% 개선
- GC 중단 시간 80% 감소

**2단계: Connection Pool 최적화**
- HikariCP 설정 튜닝
- 데이터베이스 응답 시간 50% 개선
- Connection timeout 에러 90% 감소

**3단계: 캐시 도입**
- Redis 캐시 + 로컬 캐시
- 응답 시간 70% 개선
- 데이터베이스 부하 80% 감소

**4단계: 비동기 처리**
- CompletableFuture + 스레드 풀 최적화
- 처리량 300% 향상
- 자원 사용률 50% 개선

### 8.3 ROI 분석

**비용 절감:**
```
서버 비용: 월 $5,000 → $2,000 (60% 절감)
운영 비용: 장애 대응 시간 80% 감소
개발 비용: 성능 개선으로 신기능 개발에 집중 가능
```

**비즈니스 영향:**
```
사용자 만족도: 70% → 95% (25% 향상)
이탈률: 40% → 15% (25% 개선)
매출 영향: 성능 개선으로 인한 전환율 20% 향상
```

## 9. 성능 최적화 체크리스트

### 9.1 모니터링 설정
- [ ] APM 도구 설치 (Pinpoint, New Relic 등)
- [ ] JVM 메트릭 수집 (Micrometer + Prometheus)
- [ ] 비즈니스 메트릭 정의 및 수집
- [ ] 알림 설정 (응답 시간, 에러율, 리소스 사용률)
- [ ] 대시보드 구성 (Grafana, DataDog 등)

### 9.2 JVM 최적화
- [ ] 적절한 힙 메모리 크기 설정
- [ ] GC 알고리즘 선택 및 튜닝
- [ ] GC 로그 분석 환경 구축
- [ ] 스레드 덤프 분석 도구 준비
- [ ] 메모리 누수 모니터링

### 9.3 애플리케이션 최적화
- [ ] 웹 서버 설정 최적화 (Tomcat/Undertow)
- [ ] 스레드 풀 크기 최적화
- [ ] 비동기 처리 도입
- [ ] 캐시 전략 수립 및 구현
- [ ] 데이터베이스 쿼리 최적화

### 9.4 인프라 최적화
- [ ] 로드 밸런서 설정
- [ ] CDN 도입
- [ ] 데이터베이스 읽기/쓰기 분리
- [ ] 캐시 서버 구축 (Redis)
- [ ] 모니터링 서버 분리

### 9.5 지속적 관리
- [ ] 정기적인 성능 테스트
- [ ] 자동화된 성능 회귀 테스트
- [ ] 용량 계획 수립
- [ ] 장애 대응 플레이북 작성
- [ ] 성능 최적화 가이드라인 문서화

## 마무리

성능 최적화는 한 번에 끝나는 작업이 아닙니다. **측정 → 분석 → 개선 → 검증**의 사이클을 지속적으로 반복해야 합니다. 

가장 중요한 것은 **무엇을 개선할지 아는 것**입니다. 추측이 아닌 데이터를 기반으로 병목 지점을 찾고, 우선순위를 정해서 단계적으로 개선해야 합니다.

실무에서는 기술적 완벽함보다는 **비즈니스 임팩트**가 큰 개선사항부터 적용하는 것이 효과적입니다. 사용자 경험을 크게 개선하면서도 운영 비용을 절감할 수 있는 최적화 포인트를 찾는 것이 핵심입니다.

성능 최적화는 개발자의 성장에도 큰 도움이 됩니다. 시스템의 전체적인 동작 원리를 이해하게 되고, 비즈니스와 기술의 균형점을 찾는 안목을 기를 수 있습니다.

지속적인 모니터링과 개선을 통해 안정적이고 빠른 시스템을 만들어가시기 바랍니다!
