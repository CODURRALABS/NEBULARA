FROM gcc:13 AS build
WORKDIR /src
COPY . .
RUN gcc -static -O2 -o /out/nebulara Compiler/nbs-bootstrap.c -lm
RUN gcc -static -O2 -o /out/neb-cli Compiler/nbs_cli.c -lm

FROM alpine:3.19
RUN apk add --no-cache bash
COPY --from=build /out/nebulara /usr/local/bin/nebulara
COPY --from=build /out/neb-cli /usr/local/bin/neb-cli
COPY std/ /usr/local/share/nebulara/std/
WORKDIR /workspace
ENTRYPOINT ["nebulara"]
