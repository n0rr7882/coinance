from celery import shared_task
from django_celery_results.models import TaskResult


@shared_task
def remove_all_celery_task_results_task():
    return TaskResult.objects.all().delete()
