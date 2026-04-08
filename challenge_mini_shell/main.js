const { spawn } = require("node:child_process");

const args = process.argv.slice(2);
const commandA = args[0];
const commandB = args[1];

if (!commandA) {
  console.warn("No commandA provided");
  return process.exit(1);
}

if (!commandB) {
  console.warn("No commandB provided");
  return process.exit(1);
}

const childA = spawn(commandA, [], {
  shell: true,
  stdio: ["inherit", "pipe", "inherit"],
});

const childB = spawn(commandB, [], {
  shell: true,
  stdio: ["pipe", "inherit", "inherit"],
});

// Si falla crear o ejecutar A, no dejamos B vivo sin sentido (evita procesos huérfanos).
childA.on("error", (err) => {
  console.error("Error al ejecutar el comando A: ", err);
  childB.kill();
  return process.exit(1);
});

childA.stdout.on("error", (err) => {
  console.error("Error al ejecutar el comando A: ", err);
  childB.kill();
  return process.exit(1);
});

// Mismo criterio: fallo en B → intentamos terminar A.
childB.on("error", (err) => {
  console.error("Error al ejecutar el comando B: ", err);
  childA.kill();
  return process.exit(1);
});

childB.stdin.on("error", (err) => {
  console.error("Error al escribir en stdin del hijo B: ", err);
  childA.kill();
  return process.exit(1);
});

// Solo depuración: en un pipeline, A suele terminar antes que B (B sigue leyendo el pipe).
childA.on("close", (code, signal) => {
  console.log(
    `[PADRE] A terminó code=${code} signal=${signal ?? "none"}`
  );
});

childB.on("close", (code, signal) => {
  console.log(
    `[PADRE] B terminó code=${code} signal=${signal ?? "none"}`
  );
  // Node emite 'close' con (code, signal). Si el hijo termina por señal,
  // code suele ser null (no hubo wait() con código de salida clásico).
  // process.exit(null) no es un contrato claro; normalizamos a fallo (1).
  // Si quisieras imitar bash: 128 + número_de_señal cuando code === null.
  const exitCode = typeof code === "number" ? code : 1;
  return process.exit(exitCode);
});

childA.stdout.pipe(childB.stdin);
