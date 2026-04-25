#include <stdio.h>
#include <stdlib.h>

// 12345
// $
// ,

// 0, 0, 0, 0
char* formatNumber(char* number, char symbol, char divider) {
    int len = 0, i, j, commas = 0;
    
    // 0 number 1; len 1
    // 1 number 2; len 2
    // 2 number 3; len 3
    // 3 number 4; len 4
    // 4 number 5; len 5
    // 5 number \n;
    while (number[len] != '\0' && number[len] != '\n') len++;

    // comas = 4 / 3 => 1
    commas = (len - 1) / 3;

    // $12,345; malloc(8)
    char* output = (char*)malloc(len + commas + 2);
    if (!output) return NULL;

    // $------
    // $12,345
    output[0] = symbol;
    j = 1;
    
    // rem = 5 % 3 => 2
    int leadingDigitsCount = len % 3;
    if (leadingDigitsCount == 0) leadingDigitsCount = 3;

    // len => 5;
    for (i = 0; i < len; ++i) {
        // true, (3 - 2) mod 3 == 0
        if (i != 0 && (i - leadingDigitsCount) % 3 == 0) {
            // j 3 => 4; output[3] = ,; $12,
            output[j++] = divider;
        }
        // j 1 => 2; output[1] = 1; $1; i=0
        // j 2 => 3; output[2] = 2; $12 i=1
        // j 4 => 5; output[4] = 3; $12,3 i=2
        // j 5 => 6; output[5] = number[3] => 4; $12,34
        // j 6 => 7; output[6] = number[4] => 5; $12,345
        output[j++] = number[i];
    }
    output[j] = '\0';
    return output;
}

void process_and_print_number(
  char **number_ptr, 
  int *index_ptr, 
  FILE *outputFile, 
  char begin, 
  char divider
) {
  (*number_ptr)[*index_ptr] = '\0';
  char* formattedNumber = formatNumber(*number_ptr, begin, divider);
  fprintf(outputFile, "%s\n", formattedNumber);
  free(*number_ptr);
  free(formattedNumber);
  *number_ptr = (char*)malloc(10 * sizeof(char));
  *index_ptr = 0;
}

int main(int argc, char* argv[]) {
  FILE* outputFile = fopen(argv[1], "w");
  int character = fgetc(stdin);
  char* number = (char*)malloc(10 * sizeof(char));
  int index = 0;

  // 12345
  while (character != EOF) {
    if (character != ' ') {
      number[index] = character;
      // number[0] = 1;
      // number[1] = 2;
      // number[2] = 3;
      // number[3] = 4;
      // number[4] = 5;

      // 0 = 0 + 1; = 1
      // 1 = 1 + 1; = 2
      // 2 = 2 + 1; = 3
      // 3 = 3 + 1; = 4
      // 4 = 4 + 1; = 5
      index++;
    }

    // Define function to process and print a number
    

    if (character == ' ') {
      if (index > 0) {
        process_and_print_number(
          &number, 
          &index, 
          outputFile, 
          argv[2][0], 
          argv[3][0]
        );
      }
    }

    character = fgetc(stdin);
  }

  if (index > 0) {
    process_and_print_number(
      &number, 
      &index, 
      outputFile, 
      argv[2][0], 
      argv[3][0]
    );
  }

  fclose(outputFile);
  exit(0);
}