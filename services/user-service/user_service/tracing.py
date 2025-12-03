from opentelemetry import trace
from opentelemetry.sdk.resources import Resource
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter

def configure_tracing():
    # Identify the service for traces
    resource = Resource(attributes={"service.name": "user-service"})
    provider = TracerProvider(resource=resource)

    # gRPC exporter to OTEL Collector
    processor = BatchSpanProcessor(
        OTLPSpanExporter(endpoint="otel-collector:4317", insecure=True)
    )

    provider.add_span_processor(processor)
    trace.set_tracer_provider(provider)
    tracer = trace.get_tracer(__name__)
    return tracer
