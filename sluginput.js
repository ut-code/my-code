import {readdir, readFile, unlink, writeFile}from"node:fs/promises";
import readlinePromises from "node:readline/promises";

for (const dir of await readdir("./public/docs")) {
  if(dir.includes(".")){
    continue;
  }
for (const dir2 of await readdir(`./public/docs/${dir}`)) {
  const slug2 = dir2.split("-").slice(1).join("-")
  let sec1 = 0;
  let sec2 = 0;
  const files = await readdir(`./public/docs/${dir}/${dir2}`)
  files.sort((a, b) => Number(a.split(".")[0].split("-")[0]) - Number(b.split(".")[0].split("-")[0]));
  for(const file of files){
    if(file === "-intro.md"){
      continue;
    }
    let content = await readFile(`./public/docs/${dir}/${dir2}/${file}`, {encoding:"utf8"});
    if(content.includes("level: 2")){
      sec1++;
      sec2 = 0;
    }else{
      sec2++;
    }
    const rl = readlinePromises.createInterface({input: process.stdin, output:process.stdout});
    console.log(`${dir}/${dir2}/${file}:`)
    console.log(content)
    const newSlug = await rl.question(`new slug: `);
    rl.close();
    console.log(`id: ${dir}-${slug2}-${newSlug}`)
    console.log(`moving to ./public/docs/${dir}/${dir2}/${sec1}-${sec2}-${newSlug}.md`)
    console.log("--------------------------------")
    content = content.replace(/id: [\w-]+/, `id: ${dir}-${slug2}-${newSlug}`)
    await writeFile(`./public/docs/${dir}/${dir2}/${sec1}-${sec2}-${newSlug}.md`, content, {encoding: "utf8"});
    await unlink(`./public/docs/${dir}/${dir2}/${file}`)
  }
}
}
