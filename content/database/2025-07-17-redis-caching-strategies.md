---
title: 'Spring Boot + Kotlin에서 Redis 캐싱 완벽 가이드: 기본 전략부터 커스텀 AOP까지'
date: 2025-07-17 14:30:00
categories: database redis kotlin
draft: false
tags: ['Redis', 'Cache', 'Performance', 'Spring Boot', 'Kotlin', 'AOP']
toc: true
---

# Spring Boot + Kotlin에서 Redis 캐싱 완벽 가이드: 기본 전략부터 커스텀 AOP까지

웹 애플리케이션의 성능을 향상시키는 가장 효과적인 방법 중 하나는 캐싱입니다. 특히 Redis를 활용한 캐싱 전략은 데이터베이스 부하를 줄이고 응답 시간을 크게 개선할 수 있습니다. 이번 글에서는 Kotlin과 Spring Boot를 기반으로 실무에서 자주 사용하는 Redis 캐싱 전략들을 살펴보겠습니다.

## 1. 캐싱 전략의 종류

### 1.1 Cache-Aside (Lazy Loading)

가장 일반적인 캐싱 패턴으로, 애플리케이션이 캐시를 직접 관리하는 방식입니다.

```kotlin
@Service
class UserService(
    private val redisTemplate: RedisTemplate<String, Any>,
    private val userRepository: UserRepository
) {
    
    fun getUser(userId: Long): User {
        val key = "user:$userId"
        
        // 1. 캐시에서 조회
        val cachedUser = redisTemplate.opsForValue()[key] as? User
        if (cachedUser != null) {
            return cachedUser
        }
        
        // 2. 캐시에 없으면 DB에서 조회
        val user = userRepository.findById(userId)
            .orElseThrow { UserNotFoundException("User not found") }
        
        // 3. 캐시에 저장 (TTL 1시간)
        redisTemplate.opsForValue().set(key, user, Duration.ofHours(1))
        
        return user
    }
}
```

**장점:**
- 필요한 데이터만 캐시에 저장
- 구현이 단순하고 직관적

**단점:**
- 캐시 미스 시 지연 발생
- 캐시 무효화 로직이 복잡할 수 있음

### 1.2 Write-Through

데이터를 쓸 때 캐시와 데이터베이스를 동시에 업데이트하는 방식입니다.

```kotlin
@Service
class UserService(
    private val redisTemplate: RedisTemplate<String, Any>,
    private val userRepository: UserRepository
) {
    
    @Transactional
    fun updateUser(userId: Long, request: UserUpdateRequest): User {
        val key = "user:$userId"
        
        // 1. DB 업데이트
        val user = userRepository.findById(userId)
            .orElseThrow { UserNotFoundException("User not found") }
        
        user.updateInfo(request.name, request.email)
        val savedUser = userRepository.save(user)
        
        // 2. 캐시 업데이트
        redisTemplate.opsForValue().set(key, savedUser, Duration.ofHours(1))
        
        return savedUser
    }
}
```

**장점:**
- 데이터 일관성 보장
- 캐시가 항상 최신 상태

**단점:**
- 쓰기 성능이 저하될 수 있음
- 캐시 장애 시 전체 시스템 영향

### 1.3 Write-Behind (Write-Back)

데이터를 캐시에 먼저 쓰고, 일정 시간 후 데이터베이스에 비동기적으로 쓰는 방식입니다.

```kotlin
@Service
class UserService(
    private val redisTemplate: RedisTemplate<String, Any>,
    private val userRepository: UserRepository,
    private val asyncUserWriter: AsyncUserWriter
) {
    
    fun updateUser(userId: Long, request: UserUpdateRequest): User {
        val key = "user:$userId"
        
        // 1. 캐시에서 조회
        val user = redisTemplate.opsForValue()[key] as? User
            ?: userRepository.findById(userId)
                .orElseThrow { UserNotFoundException("User not found") }
        
        // 2. 캐시 업데이트
        user.updateInfo(request.name, request.email)
        redisTemplate.opsForValue().set(key, user, Duration.ofHours(1))
        
        // 3. 비동기 DB 쓰기 스케줄링
        asyncUserWriter.scheduleWrite(user)
        
        return user
    }
}

@Component
class AsyncUserWriter(
    private val userRepository: UserRepository
) {
    
    @Async
    fun scheduleWrite(user: User) {
        // 일정 시간 후 DB에 쓰기
        userRepository.save(user)
    }
}
```

**장점:**
- 쓰기 성능이 매우 빠름
- 캐시 히트율이 높음

**단점:**
- 데이터 손실 위험
- 구현 복잡도 증가

## 2. Spring Boot에서의 캐싱 구현

### 2.1 Redis 설정

```kotlin
@Configuration
@EnableCaching
class RedisConfig {
    
    @Bean
    fun redisConnectionFactory(): RedisConnectionFactory {
        return LettuceConnectionFactory(
            RedisStandaloneConfiguration("localhost", 6379)
        )
    }
    
    @Bean
    fun redisTemplate(): RedisTemplate<String, Any> {
        val template = RedisTemplate<String, Any>()
        template.connectionFactory = redisConnectionFactory()
        
        // JSON 직렬화 설정
        val serializer = Jackson2JsonRedisSerializer(Any::class.java)
        val mapper = ObjectMapper()
        mapper.setVisibility(PropertyAccessor.ALL, JsonAutoDetect.Visibility.ANY)
        mapper.activateDefaultTyping(
            LaissezFaireSubTypeValidator.instance,
            ObjectMapper.DefaultTyping.NON_FINAL
        )
        serializer.setObjectMapper(mapper)
        
        template.valueSerializer = serializer
        template.keySerializer = StringRedisSerializer()
        template.hashKeySerializer = StringRedisSerializer()
        template.hashValueSerializer = serializer
        
        return template
    }
    
    @Bean
    fun cacheManager(): CacheManager {
        val config = RedisCacheConfiguration.defaultCacheConfig()
            .entryTtl(Duration.ofHours(1))
            .disableCachingNullValues()
        
        return RedisCacheManager.builder(redisConnectionFactory())
            .cacheDefaults(config)
            .build()
    }
}
```

### 2.2 어노테이션 기반 캐싱

```kotlin
@Service
class ProductService(
    private val productRepository: ProductRepository
) {
    
    @Cacheable(value = ["products"], key = "#id")
    fun getProduct(id: Long): Product {
        return productRepository.findById(id)
            .orElseThrow { ProductNotFoundException("Product not found") }
    }
    
    @CacheEvict(value = ["products"], key = "#id")
    fun deleteProduct(id: Long) {
        productRepository.deleteById(id)
    }
    
    @CachePut(value = ["products"], key = "#result.id")
    fun updateProduct(id: Long, request: ProductUpdateRequest): Product {
        val product = productRepository.findById(id)
            .orElseThrow { ProductNotFoundException("Product not found") }
        
        product.updateInfo(request.name, request.price)
        return productRepository.save(product)
    }
    
    @Cacheable(value = ["product-lists"], key = "#category + '_' + #page")
    fun getProductsByCategory(category: String, page: Int): Page<Product> {
        val pageable = PageRequest.of(page, 20)
        return productRepository.findByCategory(category, pageable)
    }
}
```

## 3. 커스텀 캐시 어노테이션과 AOP

### 3.1 커스텀 캐시 어노테이션 정의

```kotlin
@Target(AnnotationTarget.FUNCTION)
@Retention(AnnotationRetention.RUNTIME)
annotation class CacheableWithTtl(
    val key: String,
    val ttl: Long = 3600, // 기본 1시간
    val timeUnit: TimeUnit = TimeUnit.SECONDS,
    val condition: String = "",
    val unless: String = ""
)

@Target(AnnotationTarget.FUNCTION)
@Retention(AnnotationRetention.RUNTIME)
annotation class CacheEvictWithPattern(
    val pattern: String,
    val allEntries: Boolean = false
)

@Target(AnnotationTarget.FUNCTION)
@Retention(AnnotationRetention.RUNTIME)
annotation class DistributedLock(
    val key: String,
    val waitTime: Long = 3000,
    val leaseTime: Long = 30000,
    val timeUnit: TimeUnit = TimeUnit.MILLISECONDS
)
```

### 3.2 캐시 AOP 구현

```kotlin
@Aspect
@Component
class CacheAspect(
    private val redisTemplate: RedisTemplate<String, Any>,
    private val distributedLock: RedisDistributedLock
) {
    
    private val logger = LoggerFactory.getLogger(CacheAspect::class.java)
    
    @Around("@annotation(cacheableWithTtl)")
    fun cacheableWithTtl(joinPoint: ProceedingJoinPoint, cacheableWithTtl: CacheableWithTtl): Any? {
        val key = parseKey(cacheableWithTtl.key, joinPoint)
        val ttl = Duration.of(cacheableWithTtl.ttl, cacheableWithTtl.timeUnit.toChronoUnit())
        
        // 조건 확인
        if (cacheableWithTtl.condition.isNotEmpty() && !evaluateCondition(cacheableWithTtl.condition, joinPoint)) {
            return joinPoint.proceed()
        }
        
        // 캐시에서 조회
        val cachedValue = redisTemplate.opsForValue()[key]
        if (cachedValue != null) {
            // unless 조건 확인
            if (cacheableWithTtl.unless.isNotEmpty() && evaluateCondition(cacheableWithTtl.unless, joinPoint)) {
                return joinPoint.proceed()
            }
            logger.debug("Cache hit for key: $key")
            return cachedValue
        }
        
        // 캐시 미스 시 실제 메서드 실행
        val result = joinPoint.proceed()
        
        // 결과를 캐시에 저장
        if (result != null) {
            redisTemplate.opsForValue().set(key, result, ttl)
            logger.debug("Cache stored for key: $key, ttl: $ttl")
        }
        
        return result
    }
    
    @Around("@annotation(cacheEvictWithPattern)")
    fun cacheEvictWithPattern(joinPoint: ProceedingJoinPoint, cacheEvictWithPattern: CacheEvictWithPattern): Any? {
        val result = joinPoint.proceed()
        
        if (cacheEvictWithPattern.allEntries) {
            // 패턴에 맞는 모든 키 삭제
            val pattern = parseKey(cacheEvictWithPattern.pattern, joinPoint)
            val keys = redisTemplate.keys(pattern)
            if (keys.isNotEmpty()) {
                redisTemplate.delete(keys)
                logger.debug("Cache evicted for pattern: $pattern, keys: ${keys.size}")
            }
        } else {
            // 특정 키만 삭제
            val key = parseKey(cacheEvictWithPattern.pattern, joinPoint)
            redisTemplate.delete(key)
            logger.debug("Cache evicted for key: $key")
        }
        
        return result
    }
    
    @Around("@annotation(distributedLock)")
    fun distributedLock(joinPoint: ProceedingJoinPoint, distributedLock: DistributedLock): Any? {
        val key = parseKey(distributedLock.key, joinPoint)
        val lockValue = UUID.randomUUID().toString()
        
        return try {
            if (this.distributedLock.tryLock(key, lockValue, Duration.of(distributedLock.waitTime, distributedLock.timeUnit.toChronoUnit()))) {
                joinPoint.proceed()
            } else {
                throw LockAcquisitionException("Failed to acquire lock for key: $key")
            }
        } finally {
            this.distributedLock.unlock(key, lockValue)
        }
    }
    
    private fun parseKey(keyExpression: String, joinPoint: ProceedingJoinPoint): String {
        return if (keyExpression.contains("#")) {
            // SpEL 파싱 (간단한 구현)
            parseSpELExpression(keyExpression, joinPoint)
        } else {
            keyExpression
        }
    }
    
    private fun parseSpELExpression(expression: String, joinPoint: ProceedingJoinPoint): String {
        val methodSignature = joinPoint.signature as MethodSignature
        val parameterNames = methodSignature.parameterNames
        val args = joinPoint.args
        
        var result = expression
        parameterNames.forEachIndexed { index, paramName ->
            result = result.replace("#$paramName", args[index].toString())
        }
        
        return result
    }
    
    private fun evaluateCondition(condition: String, joinPoint: ProceedingJoinPoint): Boolean {
        // 간단한 조건 평가 (실제로는 SpEL을 사용)
        return true
    }
}
```

### 3.3 분산 락 구현

```kotlin
@Component
class RedisDistributedLock(
    private val redisTemplate: RedisTemplate<String, Any>
) {
    
    companion object {
        private const val LOCK_PREFIX = "lock:"
    }
    
    fun tryLock(key: String, value: String, waitTime: Duration): Boolean {
        val lockKey = LOCK_PREFIX + key
        val endTime = System.currentTimeMillis() + waitTime.toMillis()
        
        while (System.currentTimeMillis() < endTime) {
            val result = redisTemplate.opsForValue()
                .setIfAbsent(lockKey, value, Duration.ofSeconds(30))
            
            if (result == true) {
                return true
            }
            
            try {
                Thread.sleep(50)
            } catch (e: InterruptedException) {
                Thread.currentThread().interrupt()
                return false
            }
        }
        
        return false
    }
    
    fun unlock(key: String, value: String) {
        val lockKey = LOCK_PREFIX + key
        val script = """
            if redis.call('get', KEYS[1]) == ARGV[1] then 
                return redis.call('del', KEYS[1]) 
            else 
                return 0 
            end
        """.trimIndent()
        
        redisTemplate.execute(
            RedisScript.of(script, Long::class.java),
            listOf(lockKey),
            value
        )
    }
}
```

### 3.4 커스텀 어노테이션 사용 예시

```kotlin
@Service
class UserService(
    private val userRepository: UserRepository,
    private val redisTemplate: RedisTemplate<String, Any>
) {
    
    @CacheableWithTtl(
        key = "user:#userId",
        ttl = 30,
        timeUnit = TimeUnit.MINUTES,
        condition = "#userId > 0"
    )
    fun getUser(userId: Long): User {
        return userRepository.findById(userId)
            .orElseThrow { UserNotFoundException("User not found") }
    }
    
    @CacheableWithTtl(
        key = "user:profile:#userId",
        ttl = 1,
        timeUnit = TimeUnit.HOURS
    )
    fun getUserProfile(userId: Long): UserProfile {
        return userRepository.findUserProfileById(userId)
    }
    
    @CacheEvictWithPattern(pattern = "user:#userId")
    fun updateUser(userId: Long, request: UserUpdateRequest): User {
        val user = userRepository.findById(userId)
            .orElseThrow { UserNotFoundException("User not found") }
        
        user.updateInfo(request.name, request.email)
        return userRepository.save(user)
    }
    
    @CacheEvictWithPattern(pattern = "user:*", allEntries = true)
    fun deleteUser(userId: Long) {
        userRepository.deleteById(userId)
    }
    
    @DistributedLock(
        key = "user:update:#userId",
        waitTime = 5000,
        leaseTime = 10000
    )
    fun updateUserWithLock(userId: Long, request: UserUpdateRequest): User {
        return updateUser(userId, request)
    }
}
```

## 4. 고급 캐싱 패턴

### 4.1 계층화된 캐싱

```kotlin
@Component
class TieredCacheService(
    private val localCache: CacheManager,
    private val redisTemplate: RedisTemplate<String, Any>
) {
    
    @CacheableWithTtl(key = "product:#id", ttl = 300) // Redis 캐시 5분
    fun getProductFromRedis(id: Long): Product? {
        return redisTemplate.opsForValue()["product:$id"] as? Product
    }
    
    @Cacheable(value = ["local-products"], key = "#id") // 로컬 캐시
    fun getProduct(id: Long): Product {
        // 1. 로컬 캐시 확인 (어노테이션으로 처리)
        
        // 2. Redis 캐시 확인
        val redisProduct = getProductFromRedis(id)
        if (redisProduct != null) {
            return redisProduct
        }
        
        // 3. DB에서 조회
        val product = productRepository.findById(id)
            .orElseThrow { ProductNotFoundException("Product not found") }
        
        // 4. Redis 캐시에 저장
        redisTemplate.opsForValue().set("product:$id", product, Duration.ofMinutes(5))
        
        return product
    }
}
```

### 4.2 캐시 워밍업

```kotlin
@Component
class CacheWarmupService(
    private val userService: UserService,
    private val productService: ProductService
) {
    
    @EventListener(ApplicationReadyEvent::class)
    fun warmupCache() {
        // 인기 상품 미리 캐시
        warmupPopularProducts()
        
        // 자주 조회되는 설정 미리 캐시
        warmupSystemConfigs()
    }
    
    @Async
    fun warmupPopularProducts() {
        val popularProductIds = productService.getPopularProductIds()
        popularProductIds.forEach { productId ->
            try {
                productService.getProduct(productId)
            } catch (e: Exception) {
                // 워밍업 실패는 무시
            }
        }
    }
    
    @Async
    fun warmupSystemConfigs() {
        val configKeys = listOf("app.version", "feature.flags", "rate.limits")
        configKeys.forEach { key ->
            try {
                systemConfigService.getConfig(key)
            } catch (e: Exception) {
                // 워밍업 실패는 무시
            }
        }
    }
}
```

### 4.3 캐시 통계 및 모니터링

```kotlin
@Component
class CacheStatsService(
    private val meterRegistry: MeterRegistry
) {
    
    private val cacheHitCounter = Counter.builder("cache.hits")
        .description("Cache hit count")
        .register(meterRegistry)
    
    private val cacheMissCounter = Counter.builder("cache.misses")
        .description("Cache miss count")
        .register(meterRegistry)
    
    fun recordCacheHit(cacheName: String, key: String) {
        cacheHitCounter.increment(
            Tags.of(
                "cache", cacheName,
                "key", key
            )
        )
    }
    
    fun recordCacheMiss(cacheName: String, key: String) {
        cacheMissCounter.increment(
            Tags.of(
                "cache", cacheName,
                "key", key
            )
        )
    }
    
    @Scheduled(fixedRate = 60000)
    fun reportCacheStats() {
        val hitRate = cacheHitCounter.count() / (cacheHitCounter.count() + cacheMissCounter.count())
        meterRegistry.gauge("cache.hit.rate", hitRate)
    }
}
```

## 5. 실무 적용 시 고려사항

### 5.1 캐시 키 네이밍 컨벤션

```kotlin
object CacheKeyConvention {
    
    // 도메인:엔티티:식별자 형태
    fun userKey(userId: Long) = "user:profile:$userId"
    fun productKey(productId: Long) = "product:detail:$productId"
    
    // 리스트는 조건을 포함
    fun productListKey(category: String, page: Int) = "product:list:$category:$page"
    
    // 검색 결과는 해시 사용
    fun searchKey(query: String) = "search:${query.hashCode()}"
    
    // 임시 데이터는 접두사로 구분
    fun sessionKey(sessionId: String) = "session:$sessionId"
    fun tokenKey(token: String) = "token:$token"
}
```

### 5.2 캐시 장애 대응

```kotlin
@Component
class CacheCircuitBreaker(
    private val meterRegistry: MeterRegistry
) {
    
    private val circuitBreakerRegistry = CircuitBreakerRegistry.of(
        CircuitBreakerConfig.custom()
            .failureRateThreshold(50.0f)
            .waitDurationInOpenState(Duration.ofSeconds(30))
            .slidingWindowSize(10)
            .build()
    )
    
    fun <T> executeWithCircuitBreaker(
        name: String,
        cacheOperation: () -> T?,
        fallbackOperation: () -> T
    ): T {
        val circuitBreaker = circuitBreakerRegistry.circuitBreaker(name)
        
        return try {
            val result = circuitBreaker.executeSupplier {
                cacheOperation()
            }
            result ?: fallbackOperation()
        } catch (e: Exception) {
            meterRegistry.counter("cache.circuit.breaker.fallback", "cache", name).increment()
            fallbackOperation()
        }
    }
}
```

### 5.3 캐시 성능 최적화

```kotlin
@Service
class OptimizedCacheService(
    private val redisTemplate: RedisTemplate<String, Any>
) {
    
    // 배치 조회로 성능 개선
    fun getUsers(userIds: List<Long>): Map<Long, User> {
        val keys = userIds.map { "user:$it" }
        
        val pipeline = redisTemplate.executePipelined { connection ->
            keys.forEach { key ->
                connection.get(key.toByteArray())
            }
            null
        }
        
        val result = mutableMapOf<Long, User>()
        val missingIds = mutableListOf<Long>()
        
        userIds.forEachIndexed { index, userId ->
            val cachedUser = pipeline[index] as? User
            if (cachedUser != null) {
                result[userId] = cachedUser
            } else {
                missingIds.add(userId)
            }
        }
        
        // 캐시 미스 된 데이터는 DB에서 일괄 조회
        if (missingIds.isNotEmpty()) {
            val dbUsers = userRepository.findAllById(missingIds)
            dbUsers.forEach { user ->
                result[user.id] = user
                // 캐시에 저장
                redisTemplate.opsForValue().set("user:${user.id}", user, Duration.ofHours(1))
            }
        }
        
        return result
    }
}
```

## 마무리

Redis를 활용한 캐싱은 웹 애플리케이션의 성능을 크게 향상시킬 수 있는 강력한 도구입니다. 특히 AOP와 커스텀 어노테이션을 활용하면 비즈니스 로직과 캐싱 로직을 깔끔하게 분리할 수 있어 유지보수성이 크게 향상됩니다.

핵심 포인트:
- 데이터 특성에 맞는 캐싱 전략 선택
- AOP를 활용한 관심사 분리
- 적절한 TTL 설정과 무효화 전략
- 캐시 장애 시 Circuit Breaker 패턴 적용
- 지속적인 모니터링과 성능 최적화

실무에서는 단일 전략보다는 데이터 특성에 따라 여러 전략을 혼합하여 사용하는 것이 효과적입니다. 또한 커스텀 어노테이션을 통해 팀의 캐싱 정책을 표준화하고, 모니터링을 통해 지속적으로 최적화하는 것이 중요합니다.