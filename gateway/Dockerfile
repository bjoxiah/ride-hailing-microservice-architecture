FROM kong:3.3

COPY kong.yml /usr/local/kong/kong.yml

ENV KONG_DATABASE=off
ENV KONG_DECLARATIVE_CONFIG=/usr/local/kong/kong.yml
