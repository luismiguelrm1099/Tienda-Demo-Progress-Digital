# Plantilla Progress Digital

Paleta para proyectos de portafolio basada en [Progress Digital - Demo Store](../index.html). Los fondos de obsidiana y pizarra dan profundidad sin competir con las imágenes. El cian aporta la identidad tecnológica en detalles y elementos interactivos. El amarillo industrial concentra la atención en la acción principal y el foco de teclado.

| Color | Valor | Uso |
| --- | --- | --- |
| Obsidiana | `#0B0D10` | Fondo general |
| Pizarra profunda | `#101318` | Fondo de secciones |
| Pizarra | `#151920` | Tarjetas y paneles |
| Pizarra elevada | `#1B2029` | Superficies al pasar el cursor |
| Blanco frío | `#F3F5F8` | Títulos y texto principal |
| Gris acero | `#99A3B2` | Descripciones y metadatos |
| Gris tenue | `#626D7C` | Detalles decorativos prescindibles |
| Cian Progress | `#18C8F0` | Acentos, enlaces y detalles interactivos |
| Amarillo industrial | `#F4C430` | Botón principal, foco y selección |
| Amarillo brillante | `#FFD44F` | Botón principal al pasar el cursor |
| Tinta oscura | `#090B0E` | Texto e iconos sobre el amarillo |

El CSS incluye también el cian al 14 % para fondos de acento y dos bordes claros al 9 % y 22 % para divisores decorativos.

## Aplicación en otro proyecto

Copia `paleta.css` al proyecto y enlázalo antes de los estilos de tus componentes.

```html
<link rel="stylesheet" href="paleta.css">
```

```css
body {
  background: var(--pd-bg);
  color: var(--pd-ink);
}

.project-card {
  background: var(--pd-surface);
  border: 1px solid var(--pd-hairline);
}

.project-card p {
  color: var(--pd-ink-secondary);
}

a {
  color: var(--pd-accent);
}

.button-primary {
  background: var(--pd-signal);
  color: var(--pd-signal-ink);
}

.button-primary:hover {
  background: var(--pd-signal-bright);
}

:focus-visible {
  outline: 2px solid var(--pd-signal);
  outline-offset: 3px;
}
```

## Contraste

Sobre fondos sólidos, el contraste es de **17,81:1** para el blanco frío sobre obsidiana, **6,91:1** para el gris acero sobre pizarra, **8,86:1** para el cian sobre pizarra y **12,00:1** para la tinta oscura sobre el amarillo industrial.

Usa gris acero para texto secundario que deba leerse. El gris tenue logra **3,35:1** sobre pizarra, por debajo del mínimo WCAG AA de **4,5:1** para texto normal. Usa tinta oscura en los botones amarillos, donde el blanco frío alcanza **1,50:1**.
