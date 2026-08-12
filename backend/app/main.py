import os
from contextlib import asynccontextmanager
from datetime import datetime, timedelta, timezone

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import DateTime, Float, ForeignKey, Integer, String, Text, create_engine, func, select
from sqlalchemy.orm import DeclarativeBase, Mapped, Session, mapped_column, relationship, sessionmaker


DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+psycopg://etl_user:etl_password@localhost:5432/etl_dashboard",
)

engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine, expire_on_commit=False)


class Base(DeclarativeBase):
    pass


class Pipeline(Base):
    __tablename__ = "pipelines"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), unique=True)
    description: Mapped[str | None] = mapped_column(Text)
    status: Mapped[str] = mapped_column(String(20), default="inactive")
    source: Mapped[str | None] = mapped_column(String(80))
    target: Mapped[str | None] = mapped_column(String(80))
    schedule: Mapped[str | None] = mapped_column(String(80))
    last_run: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    next_run: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    records_processed: Mapped[int] = mapped_column(Integer, default=0)
    jobs: Mapped[list["Job"]] = relationship(back_populates="pipeline")


class Job(Base):
    __tablename__ = "jobs"

    id: Mapped[int] = mapped_column(primary_key=True)
    pipeline_id: Mapped[int] = mapped_column(ForeignKey("pipelines.id"))
    status: Mapped[str] = mapped_column(String(20), default="queued")
    started_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    finished_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    duration_seconds: Mapped[int] = mapped_column(Integer, default=0)
    records_processed: Mapped[int] = mapped_column(Integer, default=0)
    error_message: Mapped[str | None] = mapped_column(Text)
    pipeline: Mapped[Pipeline] = relationship(back_populates="jobs")
    logs: Mapped[list["LogEntry"]] = relationship(back_populates="job")


class LogEntry(Base):
    __tablename__ = "logs"

    id: Mapped[int] = mapped_column(primary_key=True)
    job_id: Mapped[int | None] = mapped_column(ForeignKey("jobs.id"))
    timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    level: Mapped[str] = mapped_column(String(20), default="info")
    message: Mapped[str] = mapped_column(Text)
    job: Mapped[Job | None] = relationship(back_populates="logs")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def seed_data() -> None:
    with SessionLocal.begin() as db:
        if db.scalar(select(func.count(Pipeline.id))):
            return

        now = datetime.now(timezone.utc)
        pipelines = [
            Pipeline(name="Customer 360 Sync", description="Unifies customer activity across every touchpoint.", status="running", source="PostgreSQL", target="Snowflake", schedule="Every 15 minutes", last_run=now - timedelta(minutes=7), next_run=now + timedelta(minutes=8), records_processed=1_284_320),
            Pipeline(name="Revenue Warehouse", description="Loads billing and subscription data for reporting.", status="success", source="Stripe", target="BigQuery", schedule="Hourly at :05", last_run=now - timedelta(minutes=44), next_run=now + timedelta(minutes=16), records_processed=842_190),
            Pipeline(name="Product Analytics", description="Prepares behavioral events for product intelligence.", status="failed", source="Kafka", target="Databricks", schedule="Every 30 minutes", last_run=now - timedelta(minutes=31), next_run=now - timedelta(minutes=1), records_processed=429_560),
            Pipeline(name="Inventory Snapshot", description="Maintains a current view of inventory by location.", status="queued", source="MySQL", target="Snowflake", schedule="Daily at 02:00", last_run=now - timedelta(minutes=670), next_run=now + timedelta(hours=13), records_processed=318_440),
        ]
        db.add_all(pipelines)
        db.flush()

        jobs = [
            Job(pipeline_id=pipelines[0].id, status="running", started_at=now - timedelta(minutes=7), duration_seconds=438, records_processed=284_320),
            Job(pipeline_id=pipelines[1].id, status="success", started_at=now - timedelta(minutes=44), finished_at=now - timedelta(minutes=41), duration_seconds=186, records_processed=842_190),
            Job(pipeline_id=pipelines[2].id, status="failed", started_at=now - timedelta(minutes=61), finished_at=now - timedelta(minutes=60), duration_seconds=74, records_processed=429_560, error_message="Schema mismatch in event_properties"),
            Job(pipeline_id=pipelines[0].id, status="success", started_at=now - timedelta(minutes=92), finished_at=now - timedelta(minutes=88), duration_seconds=231, records_processed=1_102_440),
            Job(pipeline_id=pipelines[3].id, status="queued", started_at=now - timedelta(minutes=112), duration_seconds=0, records_processed=0),
        ]
        db.add_all(jobs)
        db.flush()
        db.add_all([
            LogEntry(job_id=jobs[0].id, timestamp=now - timedelta(minutes=1), level="info", message="Loaded batch 18 of 24 - 284,320 records committed"),
            LogEntry(job_id=jobs[0].id, timestamp=now - timedelta(minutes=3), level="debug", message="Checkpoint persisted at offset 983104"),
            LogEntry(job_id=jobs[2].id, timestamp=now - timedelta(minutes=31), level="error", message="Schema mismatch: event_properties.device_type expected string"),
            LogEntry(job_id=jobs[2].id, timestamp=now - timedelta(minutes=32), level="warning", message="Retry 3/3 exhausted for transformation stage"),
            LogEntry(job_id=jobs[1].id, timestamp=now - timedelta(minutes=44), level="info", message="Pipeline completed successfully - 842,190 records loaded"),
        ])


@asynccontextmanager
async def lifespan(_: FastAPI):
    Base.metadata.create_all(engine)
    seed_data()
    yield
    engine.dispose()


app = FastAPI(title="Enterprise ETL Dashboard API", version="1.0.0", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health(db: Session = Depends(get_db)):
    db.execute(select(1))
    return {"status": "healthy"}


def pipeline_dict(item: Pipeline) -> dict:
    return {column.name: getattr(item, column.name) for column in Pipeline.__table__.columns}


def job_dict(item: Job) -> dict:
    data = {column.name: getattr(item, column.name) for column in Job.__table__.columns}
    data["pipeline_name"] = item.pipeline.name
    return data


@app.get("/api/pipelines")
def list_pipelines(db: Session = Depends(get_db)):
    return [pipeline_dict(item) for item in db.scalars(select(Pipeline).order_by(Pipeline.id))]


@app.get("/api/pipelines/{pipeline_id}")
def get_pipeline(pipeline_id: int, db: Session = Depends(get_db)):
    item = db.get(Pipeline, pipeline_id)
    if item is None:
        raise HTTPException(status_code=404, detail="Pipeline not found")
    return pipeline_dict(item)


@app.get("/api/jobs")
def list_jobs(db: Session = Depends(get_db)):
    return [job_dict(item) for item in db.scalars(select(Job).order_by(Job.id.desc()))]


@app.get("/api/jobs/{job_id}")
def get_job(job_id: int, db: Session = Depends(get_db)):
    item = db.get(Job, job_id)
    if item is None:
        raise HTTPException(status_code=404, detail="Job not found")
    return job_dict(item)


@app.get("/api/logs")
def list_logs(db: Session = Depends(get_db)):
    entries = db.scalars(select(LogEntry).order_by(LogEntry.timestamp.desc())).all()
    return [
        {
            "id": item.id,
            "job_id": item.job_id,
            "timestamp": item.timestamp,
            "level": item.level,
            "message": item.message,
            "pipeline_name": item.job.pipeline.name if item.job else None,
        }
        for item in entries
    ]


@app.get("/api/metrics")
def metrics(db: Session = Depends(get_db)):
    jobs = db.scalars(select(Job)).all()
    completed = [job for job in jobs if job.status in {"success", "failed"}]
    succeeded = sum(job.status == "success" for job in completed)
    durations = [job.duration_seconds for job in completed if job.duration_seconds]
    return {
        "total_pipelines": db.scalar(select(func.count(Pipeline.id))) or 0,
        "active_pipelines": db.scalar(select(func.count(Pipeline.id)).where(Pipeline.status != "inactive")) or 0,
        "total_jobs": len(jobs),
        "running_jobs": sum(job.status == "running" for job in jobs),
        "failed_jobs": sum(job.status == "failed" for job in jobs),
        "success_rate": round((succeeded / len(completed) * 100), 1) if completed else 0,
        "records_processed": sum(job.records_processed for job in jobs),
        "throughput_per_minute": round(sum(job.records_processed for job in completed) / max(sum(durations) / 60, 1)),
        "average_duration_seconds": round(sum(durations) / len(durations)) if durations else 0,
    }

