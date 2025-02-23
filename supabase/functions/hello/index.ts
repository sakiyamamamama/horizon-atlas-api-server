
console.log("Hello from Functions!");

Deno.serve(() => {
  const data = {
    message: `Hello world!`,
  };

  return new Response(
    JSON.stringify(data),
    { headers: { "Content-Type": "application/json" } }
  );
});
