# Etap 1: Buildowanie aplikacji
FROM node:20 AS build

# Ustawiamy katalog roboczy w kontenerze
WORKDIR /app

# Kopiujemy pliki package.json i package-lock.json
COPY package*.json ./

# Instalujemy zależności
RUN npm install

# Kopiujemy resztę plików aplikacji
COPY . .

# Etap 2: Przygotowanie finalnego obrazu
FROM node:20-slim AS production

# Ustawiamy katalog roboczy w kontenerze
WORKDIR /app

# Tylko kopiujemy z builda niezbędne pliki do uruchomienia
COPY --from=build /app /app

# Dodajemy metadane autora, zgodnie ze standardem OCI
LABEL org.opencontainers.image.author="Szymon Zych"
LABEL org.opencontainers.image.version="1.0.0"
LABEL org.opencontainers.image.description="Aplikacja do sprawdzania pogody z wykorzystaniem Node.js i Express."

# Instalujemy tylko zależności produkcyjne
RUN npm install --production

# Otwieramy port na którym działa aplikacja
EXPOSE 3000

# Dodajemy healthcheck, aby sprawdzić, czy aplikacja działa
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD curl --silent --fail http://localhost:3000 || exit 1

# Uruchamiamy aplikację
CMD ["npm", "start"]
