import importlib
import os
import sys
from pathlib import Path

import pytest
from fastapi.testclient import TestClient


BACKEND_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(BACKEND_ROOT))


@pytest.fixture(scope="session")
def api_client(tmp_path_factory: pytest.TempPathFactory):
    database_path = tmp_path_factory.mktemp("database") / "integration.sqlite3"
    os.environ["DATABASE_URL"] = f"sqlite+pysqlite:///{database_path.as_posix()}"

    main = importlib.import_module("app.main")
    with TestClient(main.app) as client:
        yield client
