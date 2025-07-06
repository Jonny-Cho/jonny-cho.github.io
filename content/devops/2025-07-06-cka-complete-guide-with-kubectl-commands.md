---
title: 'CKA 시험 완전 정복: 실무 경험자의 합격 후기와 핵심 kubectl 명령어'
date: 2025-07-06
categories: 'devops'
description: 'CKA 시험 준비부터 합격까지의 완전 가이드. 실무에서 자주 사용되는 kubectl 명령어와 시험에서 자주 나오는 핵심 명령어를 정리했습니다.'
---

## 들어가며

Kubernetes 운영자로서 CKA(Certified Kubernetes Administrator) 자격증은 필수가 되었습니다. 실무에서 Kubernetes를 운영하면서 체계적인 지식 정리와 공식 인증의 필요성을 느껴 CKA 시험에 도전하게 되었습니다.

이 글에서는 실무 경험을 바탕으로 한 CKA 시험 준비 과정과 합격 후기, 그리고 시험에서 자주 나오는 kubectl 명령어들을 정리해보겠습니다.

## CKA 시험 개요

CKA는 Cloud Native Computing Foundation(CNCF)에서 주관하는 Kubernetes 관리자 자격증으로, 실무 중심의 핸즈온 시험입니다.

### 시험 정보 (2025년 업데이트)
- **시험 시간**: 2시간
- **문제 수**: 15-20문제
- **합격 점수**: 74점 (2025년 2월부터 상향 조정)
- **시험 방식**: 온라인 실습 시험 (100% 실습, 객관식 없음)
- **유효 기간**: 3년
- **Kubernetes 버전**: v1.33 기준
- **클러스터 환경**: 6개의 서로 다른 클러스터에서 컨텍스트 전환하며 작업
- **시험 개편일**: 2025년 2월 18일부터 새로운 커리큘럼 적용

### 시험 도메인 및 비중
1. **클러스터 아키텍처, 설치 및 구성** (25%)
2. **워크로드 및 스케줄링** (15%)
3. **서비스 및 네트워킹** (20%)
4. **스토리지** (10%)
5. **트러블슈팅** (30%)

## 학습 계획 및 리소스

### 권장 학습 순서
1. **Kubernetes 기초 개념 정리** (1주)
2. **각 도메인별 핵심 개념 학습** (4주)
3. **실습 환경 구축 및 명령어 연습** (2주)
4. **모의 시험 및 취약점 보완** (1주)

### 필수 학습 리소스 (2025년 업데이트)
- **공식 문서**: [kubernetes.io](https://kubernetes.io/docs/) (시험 중 유일한 참고 자료)
- **실습 환경**: [killercoda.com](https://killercoda.com/killer-shell-cka)
- **모의 시험**: [killer.sh](https://killer.sh/) (CKA 등록 시 무료 제공)
- **참고 서적**: "Kubernetes Up & Running"
- **새로 추가**: Helm 공식 문서, Gateway API 문서
- **주의사항**: Kustomize 문서는 시험 중 접근 불가

## 도메인별 핵심 학습 포인트 및 kubectl 명령어

### 1. 클러스터 아키텍처, 설치 및 구성 (25%)

#### 핵심 개념 (2025년 업데이트)
- ~~etcd 백업 및 복구 (더 이상 핵심 주제가 아님)~~
- ~~클러스터 업그레이드 (중요도 감소)~~
- **Helm & Kustomize** (새로 추가, 필수 학습)
- **CRD(Custom Resource Definition) 및 Operators** (새로 추가)
- RBAC 설정 (기존 유지)
- 고가용성 클러스터 구성 (기존 유지)

#### 필수 명령어

**etcd 백업 및 복구**
```bash
# etcd 백업
ETCDCTL_API=3 etcdctl snapshot save /backup/etcd-snapshot.db \
  --endpoints=https://127.0.0.1:2379 \
  --cacert=/etc/kubernetes/pki/etcd/ca.crt \
  --cert=/etc/kubernetes/pki/etcd/server.crt \
  --key=/etc/kubernetes/pki/etcd/server.key

# 백업 상태 확인
ETCDCTL_API=3 etcdctl snapshot status /backup/etcd-snapshot.db

# etcd 복구
ETCDCTL_API=3 etcdctl snapshot restore /backup/etcd-snapshot.db \
  --data-dir=/var/lib/etcd-backup
```

**Helm 관리** (2025년 신규 추가)
```bash
# Helm 차트 검색
helm search repo nginx

# Helm 차트 설치
helm install my-release nginx/nginx-ingress

# Helm 릴리즈 상태 확인
helm status my-release

# Helm 릴리즈 업그레이드
helm upgrade my-release nginx/nginx-ingress --version 1.2.3

# Helm 릴리즈 삭제
helm uninstall my-release

# 커스텀 values.yaml 사용
helm install my-release nginx/nginx-ingress -f custom-values.yaml
```

**Kustomize 관리** (2025년 신규 추가)
```bash
# Kustomization 빌드 및 적용
kubectl apply -k ./overlays/production

# Kustomization 빌드 결과 확인
kubectl kustomize ./overlays/production

# 리소스 패치 적용
kubectl patch deployment nginx -p "$(cat patch.yaml)"
```

### 2. 워크로드 및 스케줄링 (15%)

#### 핵심 개념
- Deployment, ReplicaSet, DaemonSet 관리
- 스케줄링 (NodeSelector, Affinity, Taints/Tolerations)
- 리소스 관리 (Requests/Limits)

#### 필수 명령어

**Deployment 관리**
```bash
# Deployment 생성
kubectl create deployment nginx --image=nginx:1.20

# Deployment 스케일링
kubectl scale deployment nginx --replicas=5

# 롤링 업데이트
kubectl set image deployment/nginx nginx=nginx:1.21

# 롤백
kubectl rollout undo deployment/nginx

# 롤아웃 상태 확인
kubectl rollout status deployment/nginx

# 롤아웃 히스토리
kubectl rollout history deployment/nginx
```

**스케줄링 관리**
```bash
# 노드에 레이블 추가
kubectl label node node-name disktype=ssd

# 노드 스케줄링 불가능하게 설정
kubectl cordon node-name

# 노드 드레인 (Pod 제거)
kubectl drain node-name --ignore-daemonsets --delete-emptydir-data

# 노드 스케줄링 가능하게 설정
kubectl uncordon node-name

# Taint 추가
kubectl taint nodes node-name key=value:NoSchedule

# Taint 제거
kubectl taint nodes node-name key=value:NoSchedule-
```

### 3. 서비스 및 네트워킹 (20%)

#### 핵심 개념 (2025년 업데이트)
- Service (ClusterIP, NodePort, LoadBalancer)
- **Gateway API** (Ingress 대체, 새로 추가)
- NetworkPolicy (강화된 네트워크 트러블슈팅)
- **CoreDNS 설정 및 트러블슈팅** (확장된 내용)
- **네트워크 연결성 문제 해결** (내외부 연결 포함)

#### 필수 명령어

**Service 관리**
```bash
# Service 생성
kubectl expose deployment nginx --port=80 --type=ClusterIP

# Service 엔드포인트 확인
kubectl get endpoints nginx

# Service 상세 정보
kubectl describe service nginx

# 포트 포워딩
kubectl port-forward service/nginx 8080:80
```

**네트워킹 트러블슈팅** (2025년 강화)
```bash
# DNS 테스트
kubectl run test-pod --image=busybox --rm -it -- nslookup kubernetes.default

# 네트워크 연결 테스트
kubectl run test-pod --image=busybox --rm -it -- wget -qO- http://service-name

# CoreDNS 로그 확인
kubectl logs -n kube-system -l k8s-app=kube-dns

# CoreDNS 설정 확인
kubectl get configmap coredns -n kube-system -o yaml

# Gateway API 리소스 확인 (2025년 신규)
kubectl get gateway
kubectl get httproute
kubectl describe gateway gateway-name

# 네트워크 정책 테스트
kubectl run test-netpol --image=busybox --rm -it -- nc -zv target-service 80
```

### 4. 스토리지 (10%)

#### 핵심 개념 (2025년 업데이트)
- **동적 스토리지 프로비저닝** (Dynamic Storage Provisioning, 새로 강조)
- PersistentVolume, PersistentVolumeClaim
- **StorageClass 세부 관리** (액세스 모드, 회수 정책 포함)
- **다양한 볼륨 타입** 실습
- 볼륨 마운트

#### 필수 명령어

**스토리지 관리** (2025년 강화)
```bash
# StorageClass 확인
kubectl get storageclass

# 동적 PV 프로비저닝 확인
kubectl get pv -o wide

# PVC 생성 및 확인
kubectl get pvc -o wide

# PVC 상태 상세 확인
kubectl describe pvc pvc-name

# 볼륨 액세스 모드 및 회수 정책 확인
kubectl get pv -o custom-columns=NAME:.metadata.name,CAPACITY:.spec.capacity.storage,ACCESS:.spec.accessModes,RECLAIM:.spec.persistentVolumeReclaimPolicy

# Pod에 볼륨 마운트 확인
kubectl describe pod pod-name | grep -A 10 Volumes

# 볼륨 타입별 확인
kubectl get pv -o jsonpath='{.items[*].spec.csi.driver}' | tr ' ' '\n' | sort | uniq
```

### 5. 트러블슈팅 (30%)

#### 핵심 개념 (2025년 강화 - 가장 중요한 도메인)
- **클러스터 및 노드 진단** (확장된 내용)
- **애플리케이션 장애 분석** (Pod 크래시, 리소스 이슈)
- **네트워크 연결성 문제 해결** (내부/외부 연결 포함)
- **로그 분석 및 디버깅**
- **리소스 사용량 모니터링**

#### 필수 명령어

**클러스터 상태 확인**
```bash
# 클러스터 정보
kubectl cluster-info

# 노드 상태 확인
kubectl get nodes -o wide

# 시스템 Pod 상태 확인
kubectl get pods -n kube-system

# 컴포넌트 상태 확인
kubectl get componentstatuses

# 이벤트 확인
kubectl get events --sort-by='.lastTimestamp'
```

**Pod 트러블슈팅**
```bash
# Pod 상세 정보
kubectl describe pod pod-name

# Pod 로그 확인
kubectl logs pod-name

# 이전 컨테이너 로그 확인
kubectl logs pod-name --previous

# Pod 내부 접속
kubectl exec -it pod-name -- /bin/bash

# 리소스 사용량 확인
kubectl top pods
kubectl top nodes
```

**네트워크 트러블슈팅**
```bash
# 서비스 연결 테스트
kubectl run debug-pod --image=busybox --rm -it -- sh

# 네트워크 정책 확인
kubectl get networkpolicy

# Ingress 상태 확인
kubectl get ingress
kubectl describe ingress ingress-name
```

## 실습 환경 구축

### 로컬 환경
```bash
# Kind 클러스터 생성
kind create cluster --name cka-practice

# 멀티 노드 클러스터 설정
cat > kind-config.yaml << EOF
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
- role: control-plane
- role: worker
- role: worker
EOF

kind create cluster --config kind-config.yaml --name cka-practice
```

### 클라우드 환경
- **AWS**: EKS
- **GCP**: GKE
- **Azure**: AKS

## 시험 당일 팁

### 시험 전 준비
1. **환경 설정 확인**: 브라우저, 웹캠, 마이크 테스트
2. **신분증 준비**: 여권 또는 운전면허증
3. **시험 환경 정리**: 깨끗한 책상, 조용한 환경

### 시험 중 전략
1. **시간 관리**: 문제당 평균 6-8분 할당
2. **어려운 문제 건너뛰기**: 나중에 돌아와서 해결
3. **kubectl 치트시트 활용**: alias 설정으로 시간 단축
4. **문제 요구사항 정확히 파악**: 네임스페이스, 레이블 등 확인

### 유용한 alias 설정 (2025년 업데이트)
```bash
# ~/.bashrc 또는 ~/.zshrc에 추가
alias k=kubectl
alias kg='kubectl get'
alias kgpo='kubectl get pod'
alias kcpyd='kubectl create pod -o yaml --dry-run=client'
alias ksysgpo='kubectl --namespace=kube-system get pod'
alias kd='kubectl describe'
alias ke='kubectl edit'
alias kl='kubectl logs'
alias kex='kubectl exec -it'
alias kdf='kubectl delete -f'

# 시험에서 유용한 추가 alias
alias kgall='kubectl get all --all-namespaces'
alias kgpow='kubectl get pods -o wide --show-labels'

# 자동완성 설정
source <(kubectl completion bash)
complete -F __start_kubectl k
```

## 자주 나오는 명령어 치트시트

### 기본 명령어
```bash
# 리소스 생성
kubectl create -f file.yaml
kubectl apply -f file.yaml

# 리소스 조회
kubectl get pods -o wide
kubectl get all -n namespace

# 리소스 수정
kubectl edit deployment/nginx
kubectl patch deployment nginx -p '{"spec":{"replicas":3}}'

# 리소스 삭제
kubectl delete pod pod-name
kubectl delete -f file.yaml
```

### 고급 명령어
```bash
# JSON Path 활용
kubectl get nodes -o jsonpath='{.items[*].metadata.name}'

# 레이블 및 필드 선택자
kubectl get pods -l app=nginx
kubectl get pods --field-selector=status.phase=Running

# 리소스 정렬
kubectl get pods --sort-by=.metadata.creationTimestamp

# 출력 형식 변경
kubectl get pods -o yaml
kubectl get pods -o json | jq '.items[0].metadata.name'
```

## 합격 후 실무 적용

### 학습한 내용의 실무 활용
1. **클러스터 모니터링**: Prometheus, Grafana 연동
2. **로그 관리**: ELK Stack 구축
3. **CI/CD 파이프라인**: Jenkins, GitLab CI와 연동
4. **보안 강화**: RBAC, Network Policy 적용

### 지속적인 학습
- **CKS(Certified Kubernetes Security Specialist)** 준비
- **Kubernetes 생태계 도구** 학습 (Helm, Istio, etc.)
- **최신 기능** 추적 및 적용

## 2025년 CKA 시험 변화 요약

### 주요 변화점
- **합격 점수 상향**: 66점 → 74점
- **새로 추가된 핵심 주제**: Helm, Kustomize, Gateway API, CRD/Operators
- **강화된 영역**: 동적 스토리지 프로비저닝, 네트워크 트러블슈팅, CoreDNS
- **중요도 감소**: etcd 백업/복구, 클러스터 업그레이드

### 학습 전략 변화
1. **Helm과 Kustomize 필수 학습**: 실제 프로덕션 환경에서 사용되는 도구들
2. **Gateway API 우선 학습**: 기존 Ingress보다 중요도 증가
3. **트러블슈팅 집중**: 30% 비중으로 가장 중요한 도메인
4. **실제 시나리오 연습**: 단순 문서 복사가 아닌 실무 중심 문제

## 마무리

2025년 CKA 시험은 더욱 실무 중심으로 변화하여 실제 Kubernetes 운영 환경에서 필요한 기술들을 다룹니다. 새로 추가된 Helm, Kustomize, Gateway API 등은 현대적인 Kubernetes 환경에서 필수적인 도구들입니다.

특히 kubectl 명령어 숙달과 함께 Helm, Kustomize 명령어도 익숙해져야 합니다. 시험 난이도가 높아진 만큼 충분한 실습과 체계적인 학습이 더욱 중요해졌습니다.

2025년 새로운 CKA 시험 합격을 응원합니다!

## 참고 자료

- [Kubernetes 공식 문서](https://kubernetes.io/docs/)
- [CKA 시험 가이드](https://www.cncf.io/certification/cka/)
- [Killer Shell CKA 시뮬레이터](https://killer.sh/)
- [Kubernetes the Hard Way](https://github.com/kelseyhightower/kubernetes-the-hard-way)
