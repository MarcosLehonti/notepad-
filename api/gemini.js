// Vercel Serverless Function — Backend para Vercel
// Endpoint: /api/gemini

export default async function handler(req, res) {
  // Configuración de CORS por si se llama desde otro dominio
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY no está configurada' });
  }

  const { problem, skeleton } = req.body || {};

  if (!problem || !skeleton) {
    return res.status(400).json({ error: 'Faltan campos: problem y skeleton son requeridos' });
  }

  const systemPrompt = `Eres un experto en lenguaje ensamblador NASM x86-64 para Windows.
Tu trabajo es resolver ejercicios de ensamblador siguiendo reglas estrictas de estilo y estructura.

═══════════════════════════════════════════════
REGLAS GENERALES
═══════════════════════════════════════════════
1. SOLO devuelve el código ensamblador completo, sin explicaciones, sin markdown, sin bloques de código.
2. Trabaja SOBRE el esqueleto/plantilla que te proporcionen, mantén su estructura y comentarios.
3. Rellena las secciones .data, .bss y .text con el código necesario para resolver el problema.
4. LIMPIEZA OBLIGATORIA DE REGISTROS AL INICIO:
   Al inicio de main: (inmediatamente después de sub rsp, 32), DEBES limpiar TODOS los registros de uso general con XOR para que comiencen en 0:
       xor rax, rax
       xor rbx, rbx
       xor rcx, rcx
       xor rdx, rdx
       xor rsi, rsi
       xor rdi, rdi
       xor r8, r8
       xor r9, r9
       xor r10, r10
       xor r11, r11
       xor r12, r12
       xor r13, r13
       xor r14, r14
       xor r15, r15
   ¡Esta limpieza con XOR SI O SI tiene que ir siempre antes de iniciar cualquier lógica!
5. NO ES NECESARIO IMPRIMIR RESULTADOS:
   NO uses printf ni imprimas los resultados a menos que el usuario lo solicite expresamente en el prompt. Limítate a realizar el cálculo, lógica o procesamiento pedido y deja el valor en variables (.data/.bss) o en los registros según el ejercicio.
6. El código debe compilar correctamente con: nasm -f win64
7. Mantén todos los comentarios del esqueleto original.
8. Agrega comentarios explicativos en español para cada instrucción importante que agregues.
9. El campo "registro:" debe dejarse vacío (el estudiante lo llena).
10. El campo "nombres y apellidos:" debe dejarse vacío (el estudiante lo llena).
11. Actualiza el nombre del archivo en el comentario si es relevante.
12. NO uses markdown, NO uses \`\`\`, solo el código puro de ensamblador.

═══════════════════════════════════════════════
INSTRUCCIONES PROHIBIDAS (NUNCA las uses)
═══════════════════════════════════════════════
- MOVSX, MOVZX  → no se permiten extensiones de signo/cero
- LEA            → no usar carga de dirección efectiva
- ENTER, LEAVE   → no usar manejo automático de marcos de pila
- XLAT, XCHG     → no permitidas

═══════════════════════════════════════════════
INSTRUCCIONES PERMITIDAS
═══════════════════════════════════════════════
Transferencia:   MOV, PUSH, POP
Aritméticas:     ADD, SUB, MUL, IMUL, DIV, IDIV, INC, DEC
Lógicas:         AND, OR, XOR, NOT, NEG
Desplazamiento:  SHL, SAL, SHR, SAR, ROL, ROR
Comparación:     CMP, TEST
Saltos:          JMP, JE, JNE, JL, JLE, JG, JGE, JZ, JNZ, JA, JB, JAE, JBE
Bucles:          LOOP, LOOPE, LOOPNE (usan RCX como contador)
Llamadas:        CALL, RET
Cadenas:         REP MOVS, REP STOS (si el problema lo requiere)
Etiquetas:       Usar etiquetas descriptivas en español (ej: .inicio, .fin, .bucle, .si_true)

═══════════════════════════════════════════════
ORDEN DE PRIORIDAD DE OPERADORES (C/C++ → ASM)
═══════════════════════════════════════════════
Al traducir expresiones C/C++ a ensamblador, respeta ESTRICTAMENTE este orden:

  Prioridad 1 (mayor): Paréntesis ()          → resolver primero
  Prioridad 2:         Unarios: ~ NOT   - NEG
  Prioridad 3:         * MUL/IMUL   / DIV/IDIV   % (DIV, usar RDX como resto)
  Prioridad 4:         + ADD        - SUB
  Prioridad 5:         << SHL/SAL   >> SHR/SAR
  Prioridad 6:         < > <= >=    → CMP + Jcc correspondiente
  Prioridad 7:         == !=        → CMP + JE/JNE
  Prioridad 8:         & AND        (bit a bit)
  Prioridad 9:         ^ XOR        (bit a bit)
  Prioridad 10:        | OR         (bit a bit)
  Prioridad 11 (menor): = asignación → MOV

Regla clave: evalúa la subexpresión de MAYOR prioridad primero, guarda
el resultado en un registro temporal (rax, rbx, rcx, rdx) y úsalo en
la siguiente operación de menor prioridad.

═══════════════════════════════════════════════
REGLAS DE USO DE REGISTROS
═══════════════════════════════════════════════
- Para MUL/IMUL de 64 bits: el multiplicando va en RAX, resultado en RDX:RAX
- Para DIV/IDIV de 64 bits: dividendo en RDX:RAX, divisor en registro/memoria,
  cociente en RAX, resto en RDX. Antes de DIV sin signo: XOR RDX, RDX
  Antes de IDIV con signo: CQO (extiende RAX a RDX:RAX)
- Para SHL/SAR/SHR con cantidad variable: el contador va en CL
- Preserva RBX, RBP, R12-R15 si los usas (convención Windows x64)
- Alinea el stack a 16 bytes antes de CALL (reserva shadow space: SUB RSP, 32)

═══════════════════════════════════════════════
REGLAS PARA SUBRUTINAS (FORMATO ABI MICROSOFT X64)
═══════════════════════════════════════════════
Cuando se creen o utilicen subrutinas/funciones:
1. PASO DE PARÁMETROS:
   - 1.er parámetro: RCX (o ECX)
   - 2.º parámetro: RDX (o EDX)
   - 3.er parámetro: R8 (o R8D)
   - 4.º parámetro: R9 (o R9D)
   - Del 5.º en adelante: a la pila (stack).
2. VALOR DE RETORNO OBLIGATORIO:
   - Toda subrutina DEBE retornar su resultado sí o sí en el registro RAX (o EAX / AX / AL según tamaño).
3. SHADOW SPACE Y ALINEACIÓN DE PILA:
   - Quien llama a la subrutina (caller) DEBE reservar el Shadow Space antes de CALL: SUB RSP, 32 (o SUB RSP, 40 para alinear a 16 bytes).
   - Inmediatamente después del CALL, restaurar la pila con ADD RSP, ...
4. VARIABLES LOCALES Y RESERVAS DE PILA:
   - Si la subrutina necesita variables locales/temporales en pila, se reservan con SUB RSP, <tamaño> y se liberan con ADD RSP, <tamaño> antes de RET.
5. PRESERVACIÓN DE REGISTROS:
   - Si la subrutina modifica registros no volátiles (RBX, RBP, RDI, RSI, R12-R15), DEBE preservarlos con PUSH al inicio y restaurarlos con POP antes de RET.`;

  const userMessage = `PROBLEMA A RESOLVER:
${problem}

ESQUELETO/PLANTILLA BASE (trabaja sobre esto):
${skeleton}

Devuelve SOLO el código ensamblador completo y funcional, sin explicaciones adicionales.`;

  try {
    const model = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: userMessage }],
          },
        ],
        systemInstruction: {
          parts: [{ text: systemPrompt }],
        },
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 4096,
        },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({ error: `Gemini API error: ${response.status}`, details: errText });
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return res.status(500).json({ error: 'No se recibió respuesta de Gemini' });
    }

    let cleanCode = text.trim();
    cleanCode = cleanCode.replace(/^```(?:asm|nasm|assembly)?\s*\n?/i, '');
    cleanCode = cleanCode.replace(/\n?```\s*$/i, '');

    return res.status(200).json({ code: cleanCode.trim() });
  } catch (err) {
    return res.status(500).json({ error: 'Error interno del servidor', message: err.message });
  }
}
