from datetime import datetime

from airflow import DAG
from airflow.operators.python import PythonOperator


def report_health() -> None:
    print("Enterprise ETL dashboard scheduler is healthy")


with DAG(
    dag_id="etl_dashboard_health",
    description="Periodic health check for the ETL dashboard stack",
    schedule="@hourly",
    start_date=datetime(2025, 1, 1),
    catchup=False,
    tags=["etl-dashboard"],
) as dag:
    PythonOperator(task_id="report_health", python_callable=report_health)

