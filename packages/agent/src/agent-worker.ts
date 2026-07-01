console.log("Agent loop started...");

const input = await new Response(Bun.stdin.stream()).text();
console.log(`Agent received input: ${input}`);

setTimeout(() => {
  console.log("Reading App.tsx");
  setTimeout(() => {
    console.log("Writing App.tsx");
    setTimeout(() => {
      console.log("Finished modifying App.tsx");
      setTimeout(() => {
        console.log("Agent closing after 10s of inactivity...");
        process.exit(0);
      }, 10000);
    }, 10000);
  }, 10000);
}, 10000);
