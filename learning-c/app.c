#include <stdio.h>
#include <stdlib.h>

typedef struct {
    int id;
    char name[50];
    char position[50];
    float salary;
} Employee;


int main () {
  int x = 10;
  int y = 20;
  int z = x + y;

  // printf("x + y = %d\n", z);

  // printf("sizeof(int) = %zu\n", sizeof(int));
  // printf("sizeof(float) = %zu\n", sizeof(float));
  // printf("sizeof(long int) = %zu\n", sizeof(long int));
  // printf("sizeof(char) = %zu\n", sizeof(char));
  // printf("sizeof(size_t) = %zu\n", sizeof(size_t));
  // printf("sizeof(pointer) = %zu\n", sizeof(void*));

  int number = 3500;
  int* p = &number;

  // printf("number = %d\n", number);
  // printf("*p = %d\n", *p);

  *p = 1000;

  // printf("number = %d\n", number);
  // printf("*p = %d\n", *p);
  
  
  // printf("p = %p\n", p);
  // printf("&number = %p\n", &number);
  // printf("sizeof(p) = %zu\n", sizeof(p));

  int* p2 = malloc(12);
  p2[0] = 10;
  p2[1] = 20;
  p2[2] = 30;
  // printf("p2[0] = %d\n", p2[0]);
  // printf("p2[1] = %d\n", p2[1]);
  // printf("p2[2] = %d\n", p2[2]);
  free(p2);

  int a = 5;
  void byValue(int x) {
    x = 99;
  }
  void byMemoryAddress(int* x) {
    *x = 99;
  }

  byValue(a);
  // printf("a = %d\n", a);
  byMemoryAddress(&a);
  // printf("a = %d\n", a);
  
  Employee employee = {
    1, 
    "John Doe", 
    "Developer", 
    50000.00
  };
  Employee *employeePtr = &employee;

  // printf("sizeof(employee) = %zu\n", sizeof(employee));
  // printf("sizeof(employeePtr) = %zu\n", sizeof(employeePtr));

  // char *myString = "text here";
  // printf("sizeof(myString) = %zu\n", sizeof(myString));
  // printf("myString = %p\n", myString);

  return 0;
}
