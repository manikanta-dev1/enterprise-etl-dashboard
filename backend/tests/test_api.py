import pytest
from fastapi.testclient import TestClient


def test_health_checks_database(api_client: TestClient):
    response = api_client.get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}


def test_lists_seeded_pipelines(api_client: TestClient):
    response = api_client.get("/api/pipelines")

    assert response.status_code == 200
    pipelines = response.json()
    assert len(pipelines) == 4
    assert pipelines[0]["name"] == "Customer 360 Sync"
    assert {pipeline["status"] for pipeline in pipelines} == {
        "running",
        "success",
        "failed",
        "queued",
    }


def test_gets_pipeline_by_id(api_client: TestClient):
    response = api_client.get("/api/pipelines/1")

    assert response.status_code == 200
    assert response.json()["source"] == "PostgreSQL"


def test_lists_jobs_with_pipeline_names(api_client: TestClient):
    response = api_client.get("/api/jobs")

    assert response.status_code == 200
    jobs = response.json()
    assert len(jobs) == 5
    assert jobs[0]["id"] == 5
    assert all(job["pipeline_name"] for job in jobs)


def test_returns_logs_and_aggregate_metrics(api_client: TestClient):
    logs_response = api_client.get("/api/logs")
    metrics_response = api_client.get("/api/metrics")

    assert logs_response.status_code == 200
    assert len(logs_response.json()) == 5
    assert metrics_response.status_code == 200
    assert metrics_response.json()["total_pipelines"] == 4
    assert metrics_response.json()["total_jobs"] == 5
    assert metrics_response.json()["success_rate"] == 66.7


@pytest.mark.parametrize("path", ["/api/pipelines/999", "/api/jobs/999"])
def test_missing_resources_return_404(api_client: TestClient, path: str):
    response = api_client.get(path)

    assert response.status_code == 404
