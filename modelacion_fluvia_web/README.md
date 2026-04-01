# 🌊 HIDROLOGÍA · TRAZADORES

## Fluvia · Análisis de Dispersión de Trazadores

📌 **Versión 1.0.0** &nbsp;·&nbsp; 2025

---

## 🎯 OBJETIVO

**Fluvia** es una herramienta de escritorio para el análisis de experimentos de trazadores en cuerpos de agua superficiales. Su objetivo principal es obtener las variables de concentración y transporte hidráulico mediante el **acople del modelo matemático de dispersión** a las curvas de concentración experimental registradas en campo, permitiendo estimar parámetros como caudal (Q), tiempo de tránsito (Tp) y coeficiente de dispersión (Φ) con alta precisión.

---

## FLUJO DEL PROCESO

### 1 · 📥 Ingesta de Datos

Se carga un archivo `.json` exportado desde los dispositivos de medición en campo (convertido desde CSV plano). El archivo contiene series de tiempo de concentración del trazador junto con los metadatos del ensayo (masa vertida, ancho del canal, distancia al sensor).

El archivo incorpora el **ajuste de tiempos de corrimiento del gatillo** — sincronización entre el momento de vertimiento del trazador y el encendido del dispositivo de medición — garantizando que `t=0` corresponde exactamente al instante del vertimiento.

---

### 2 · 📈 Visualización Interactiva

La gráfica principal muestra simultáneamente la **Curva Experimental** (eje izquierdo, azul continuo) y la **Curva del Modelo** (eje derecho, naranja discontinuo) con ejes duales independientes. Esto permite comparar la forma de ambas curvas independientemente de la escala de concentración. Un tooltip interactivo muestra los valores exactos en cualquier punto temporal.

---

### 3 · ⬛ Ajuste de Línea Base

Antes del ajuste automático, la curva experimental debe normalizarse a cero. Se calcula la **línea base** como el promedio del percentil 10% inferior de lecturas no nulas:

```
baseline = promedio(percentil_10%(obs > 0))
```

Cada valor observado se corrige restando este offset y truncando a cero los valores negativos resultantes:

```
C_corr(t) = max(0, C_obs(t) − baseline)
```

Este paso elimina el ruido de fondo del sensor y garantiza que la curva parta desde cero antes del frente del trazador.

---

### 4 · ✦ Algoritmo de Acople (Auto-Ajuste)

El auto-ajuste optimiza los parámetros Q, Tp y Φ minimizando el RMSE entre la curva observada y la generada por `modelC(t, M, Q, Tp, Φ, W)`. Se utiliza el **algoritmo Nelder-Mead (Simplex)** implementado directamente en JavaScript:

- Operación en **espacio logarítmico** para manejar diferencias de escala entre parámetros.
- **Semilla inteligente**: Q inicial derivado analíticamente del pico observado.
- **500 iteraciones** ejecutadas en chunks asíncronos para no bloquear la interfaz.
- La masa M permanece **constante** durante el ajuste (controlada manualmente por el usuario).

---

### 5 · 📐 Fundamento Matemático

Modelo de concentración de trazador para flujo en canal:

```
C(t) = (M / (W · Q · √(4π·Φ·t³/Q²))) · exp(−(t − Tp)² · Q² / (4·Φ·t))
```

| Parámetro | Descripción |
|-----------|-------------|
| `M` | Masa del trazador vertida [g] |
| `Q` | Caudal [m³/s] |
| `Tp` | Tiempo de tránsito al pico [s] |
| `Φ` | Coeficiente de dispersión longitudinal [m²/s] |
| `W` | Ancho del canal [m] |
