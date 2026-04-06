#include <stdio.h>
#include <unistd.h>
#include <stdlib.h>

int main(int argc, char *argv[]) {

//   for (int i = 0; i < argc; i++) {
//       printf("argv number %d is: %s\n", i, argv[i]);
//   }

//   printf("Process ID: %d\n", getpid());
//   printf("Parent Process ID: %d\n", getppid());

//   printf("Mode is: %s\n", getenv("MODE"));

  fprintf(stdout, "(Comming from C) Some text on stdout.\n");
  fprintf(stderr, "(Comming from C) Some text on stderr.\n");

  int c = fgetc(stdin);
  while (c != EOF) {
    fprintf(stdout, "%c", c);
    fflush(stdout);
    c = fgetc(stdin);
  }

  return 0;
}