import json
import asyncio
from aiokafka import AIOKafkaProducer, errors
from user_service.config import settings

class KafkaManager:
    producer: AIOKafkaProducer | None = None

    async def start(self, retries: int = 10, delay: float = 3.0):
        self.producer = AIOKafkaProducer(
            bootstrap_servers=settings.KAFKA_BROKER
        )
        for attempt in range(1, retries + 1):
            try:
                await self.producer.start()
                print(f"Kafka producer connected on attempt {attempt}")
                return
            except errors.KafkaConnectionError as e:
                print(f"Kafka not ready yet (attempt {attempt}/{retries}), retrying in {delay}s...")
                await asyncio.sleep(delay)
        raise RuntimeError("Failed to connect to Kafka after several retries")

    async def stop(self):
        if self.producer:
            await self.producer.stop()

    async def publish(self, topic: str, message: dict):
        if not self.producer:
            raise RuntimeError("Kafka producer not initialized")
        await self.producer.send_and_wait(
            topic,
            json.dumps(message).encode("utf-8")
        )

kafka = KafkaManager()
