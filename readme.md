## Opis

To repozytorium zawiera konfigurację GitHub Actions umożliwiającą:

- Budowanie obrazu Dockera w architekturze `amd64` (do skanowania),
- Skanowanie obrazu pod kątem podatności przy użyciu **Trivy**,
- Budowanie i wypychanie obrazu w wersji **multiarch** (`amd64` i `arm64`) do rejestrów:
  - **GitHub Container Registry (GHCR)**
  - **Docker Hub**

Cały proces odbywa się automatycznie przy każdym **pushu do gałęzi `main`**
