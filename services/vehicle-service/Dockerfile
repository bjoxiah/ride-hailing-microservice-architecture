FROM golang:1.22-alpine AS builder

WORKDIR /app
COPY . .

RUN go mod download
RUN go build -o vehicle-service main.go

FROM alpine:latest
WORKDIR /root/
COPY --from=builder /app/vehicle-service .

EXPOSE 6000

CMD ["./vehicle-service"]
