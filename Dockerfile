FROM gcc:13 AS build
WORKDIR /src
COPY . .
RUN mkdir -p /out && gcc -static -O2 -o /out/nebulara Compiler/nbs-bootstrap.c -lm

FROM alpine:3.19
RUN apk add --no-cache bash
COPY --from=build /out/nebulara /usr/local/bin/nebulara
COPY std/ /usr/local/share/nebulara/std/
WORKDIR /workspace
ENTRYPOINT ["nebulara"]
