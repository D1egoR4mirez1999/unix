/*
 * Mini programa: lee UNA línea de stdin y escribe en dos canales distintos.
 *
 * - stdout: mensaje "usuario" (Recibí: ...)
 * - stderr: mensaje de depuración (cuántos bytes leyó fgets en el buffer)
 *
 * Así puedes redirigir por separado:
 *   ./leer_stdin 1> salida.txt 2> errores.txt
 */

#include <stdio.h>
#include <string.h>

/* Tamaño máximo de la línea (incluye '\n' si cabe y el '\0' final de C). */
#define TAM_BUF 256

int main(void) {
  char linea[TAM_BUF];

  /*
   * Flujo 1 — ENTRADA (stdin)
   * fgets lee hasta encontrar '\n', llegar al límite (TAM_BUF-1 chars + '\0'),
   * o EOF. Si hay pipe o redirección (< archivo), los datos vienen de ahí;
   * si no, el teclado es stdin (hasta que pulses Enter).
   */
  if (fgets(linea, (int)sizeof(linea), stdin) == NULL) {
    /*
     * NULL = error de lectura o EOF sin ningún carácter (ej. entrada vacía
     * cerrada de golpe). Informamos por stderr para no mezclar con stdout.
     */
    fprintf(stderr, "debug: no pude leer una línea (EOF o error)\n");
    return 1;
  }

  /*
   * Flujo 2 — SALIDA de depuración (stderr)
   * strlen cuenta bytes hasta el '\0' (no lo incluye). Suele incluir el '\n'
   * si fgets lo guardó, que es lo que realmente "ocupa" en el buffer.
   */
  fprintf(stderr, "debug: leí %zu bytes\n", strlen(linea));

  /*
   * Flujo 3 — SALIDA normal (stdout)
   * printf va a stdout por defecto; es equivalente a fprintf(stdout, ...).
   * %s imprime el contenido de linea tal cual (normalmente con salto de línea al final).
   */
  printf("Recibí: %s", linea);

  /* Código 0 = terminación correcta (convención Unix). */
  return 0;
}
