import json
import asyncio
import uuid
from aiokafka import AIOKafkaProducer
from opentelemetry import trace
from opentelemetry.trace import SpanKind
from opentelemetry.trace.propagation.tracecontext import TraceContextTextMapPropagator
from user_service.config import settings


class KafkaManager:
    producer: AIOKafkaProducer | None = None

    async def start(self, retries: int = 10, delay: float = 3.0):
        self.producer = AIOKafkaProducer(
            bootstrap_servers=settings.KAFKA_BROKER,
            enable_idempotence=True,
        )

        for attempt in range(1, retries + 1):
            try:
                await self.producer.start()
                print(f"Kafka producer connected on attempt {attempt}")
                return
            except Exception:
                print(f"Kafka not ready (attempt {attempt}), retrying in {delay}s...")
                await asyncio.sleep(delay)

        raise RuntimeError("Failed to connect to Kafka.")

    async def stop(self):
        if self.producer:
            await self.producer.stop()

    async def publish(self, topic: str, message: dict):
        if not self.producer:
            raise RuntimeError("Kafka producer not initialized")

        # ---- START SPAN (equivalent to .NET ActivitySource.StartActivity)
        tracer = trace.get_tracer("user-service")
        with tracer.start_as_current_span(
            "kafka.produce",
            kind=SpanKind.PRODUCER
        ) as span:

            # Set span attributes similar to your C#
            span.set_attribute("messaging.system", "kafka")
            span.set_attribute("messaging.destination", topic)

            # ---- INJECT W3C traceparent (THIS IS WHAT REDPANDA NEEDS)
            carrier = {}
            TraceContextTextMapPropagator().inject(carrier)

            traceparent = carrier.get("traceparent")
            span.set_attribute("messaging.trace_id", traceparent)

            # ---- HEADERS
            headers = [
                ("traceparent", traceparent.encode("utf-8")),
                ("content-type", b"application/json"),
                ("content-encoding", b"utf-8"),
            ]

            # ---- SEND
            key = uuid.uuid4().hex.encode("utf-8")
            value = json.dumps(message).encode("utf-8")

            await self.producer.send_and_wait(
                topic=topic,
                key=key,
                value=value,
                headers=headers
            )


kafka = KafkaManager()
