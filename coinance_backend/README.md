# Coinance backend

## Installation

0. 애플리케이션 구동에 필요한 환경을 설정합니다.
    * 필요 소프트웨어
        * Python version >= 3.6 (venv)
        * MySQL
        * Redis
    * `.env.example` 을 참조하여 `.env` 를 backend 프로젝트 루트에 생성합니다.

1. 프로젝트 종속성을 설치합니다.

    ```bash
    # Project venv 가 활성화되어있어야 합니다.

    (venv) $ pip install -r requirements/develop.txt
    (venv) $ python manage.py migrate
    ```
2. Initialize cryptocurrency info from Poloniex API
    ```bash
    (venv) $ python manage.py initialize_currencies
    (venv) $ python manage.py initialize_currency_pairs
    ```
3. 어드민에서 필요한 추가 설정을 위해 관리자 계정 생성 후 서버를 실행합니다.
    ```bash
    (venv) $ python manage.py createsuperuser
    (venv) $ python manage.py runserver
    ```
4. 회원가입시 초기자금으로 사용할 화폐를 설정합니다.
    * [어드민 페이지](http://localhost:8000/admin) 에 접속하여 로그인합니다.
    * [홈 › Currency › Poloniex 암호화폐 목록](http://localhost:8000/admin/currency/currency/) 에서 원하는 화폐의 `초기자금 선택 가능 여부` 를 체크, 저장합니다.
5. 주문 체결 Task 를 주기적으로 실행하도록 설정합니다.
    * [홈 › Periodic Tasks › Periodic tasks › periodic task 추가](http://localhost:8000/admin/django_celery_beat/periodictask/add/) 에서 Periodic task 를 추가합니다.
        * Task (registered): `trading.tasks.order.process_able_orders_of_all_currency_pairs_task`
        * Interval Schedule: `every second` ~ `every 5 seconds` 중 컴퓨터 사양에 맞게 조절
6. (옵션) 과도한 TaskResult 누적 방지를 위해 TaskResult 삭제를 주기적으로 실행하도록 설정합니다.
    * [홈 › Periodic Tasks › Periodic tasks › periodic task 추가](http://localhost:8000/admin/django_celery_beat/periodictask/add/) 에서 Periodic task 를 추가합니다.
         * Task (registered): `utils.tasks.remove_all_celery_task_results_task`
         * Interval Schedule: 컴퓨터 사양에 맞게 조절
7. `Ctrl` + `C` 로 서버를 종료합니다.

## Run (for development)

### HTTP server

```
(venv) $ python manage.py runserver
```

### Celery worker

```
(venv) $ celery -A coinance_backend worker -l info
```

### Celery beat

```
# Celery worker must be running
(venv) $ celery -A coinance_backend beat -l info --scheduler django_celery_beat.schedulers:DatabaseScheduler
```

### Poloniex Websocket client

```
# Celery worker must be running
(venv) $ python manage.py poloniex_ws_client
```
